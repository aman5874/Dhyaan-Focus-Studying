import { useRef, useCallback, useState } from "react";
import { soundPresets } from "@shared/schema";

// Define a type for the keys of soundPresets
type SoundName = keyof typeof soundPresets;

export function useAudio() {
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContext = useRef<AudioContext>();
  const gainNodes = useRef<Map<string, GainNode>>(new Map());
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  const initializeAudioContext = useCallback(async () => {
    try {
      if (!audioContext.current) {
        // Create context only on user gesture
        const context = new AudioContext();
        audioContext.current = context;
        setIsInitialized(true);
      } else if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, []);

  const ensureAudioContext = useCallback(async () => {
    if (!isInitialized) {
      await initializeAudioContext();
    }
    return audioContext.current;
  }, [isInitialized, initializeAudioContext]);

  const playSound = useCallback(async (soundName: SoundName, volume: number) => {
    try {
      const context = await ensureAudioContext();
      if (!context) return;

      let audioElement = audioElements.current.get(soundName);
      let gainNode = gainNodes.current.get(soundName);

      if (!audioElement) {
        audioElement = new Audio(soundPresets[soundName]);
        audioElement.loop = true;
        audioElements.current.set(soundName, audioElement);

        // Wait for audio to be loaded
        await new Promise((resolve, reject) => {
          audioElement!.addEventListener('canplaythrough', resolve, { once: true });
          audioElement!.addEventListener('error', reject, { once: true });
          audioElement!.load();
        });

        // Create audio nodes after loading
        const source = context.createMediaElementSource(audioElement);
        gainNode = context.createGain();
        source.connect(gainNode);
        gainNode.connect(context.destination);
        gainNodes.current.set(soundName, gainNode);
      }

      if (gainNode) {
        gainNode.gain.value = volume;
      }

      if (audioElement.paused) {
        if (context.state === 'suspended') {
          await context.resume();
        }
        await audioElement.play();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        setIsInitialized(false);
        console.warn('Audio playback requires user interaction first');
      } else {
        console.error(`Failed to play ${soundName}:`, error);
      }
    }
  }, [ensureAudioContext]);

  const stopSound = useCallback((soundName: SoundName) => {
    const audioElement = audioElements.current.get(soundName);
    const gainNode = gainNodes.current.get(soundName);

    if (audioElement && gainNode && audioContext.current) {
      // Fade out
      const currentTime = audioContext.current.currentTime;
      gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.1);
      
      setTimeout(() => {
        audioElement.pause();
        audioElement.currentTime = 0;
      }, 100);
    }
  }, []);

  return {
    playSound,
    stopSound,
    initializeAudioContext,
    isInitialized
  };
}
