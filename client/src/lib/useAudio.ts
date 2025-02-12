import { useRef, useEffect } from "react";
import { soundPresets } from "@shared/schema";

export function useAudio() {
  const audioContext = useRef<AudioContext>();
  const gainNodes = useRef<Map<string, GainNode>>(new Map());
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    audioContext.current = new AudioContext();
    return () => {
      audioContext.current?.close();
    };
  }, []);

  const playSound = (soundName: string, volume: number) => {
    if (!audioContext.current) return;

    let audioElement = audioElements.current.get(soundName);
    let gainNode = gainNodes.current.get(soundName);

    if (!audioElement) {
      const soundUrl = soundPresets[soundName];
      audioElement = new Audio(soundUrl);
      audioElement.loop = true;
      audioElements.current.set(soundName, audioElement);

      const source = audioContext.current.createMediaElementSource(audioElement);
      gainNode = audioContext.current.createGain();
      source.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      gainNodes.current.set(soundName, gainNode);
    }

    if (gainNode) {
      gainNode.gain.value = volume;
    }

    if (audioElement.paused) {
      audioElement.play();
    }
  };

  const stopSound = (soundName: string) => {
    const audioElement = audioElements.current.get(soundName);
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  return { playSound, stopSound };
}
