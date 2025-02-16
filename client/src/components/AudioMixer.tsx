import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/lib/useAudio";
import { soundPresets, type SoundPreset } from "@shared/schema";
import { Volume2, VolumeX, Shuffle, Music } from "lucide-react";

export function AudioMixer() {
  const [volumes, setVolumes] = useState<Record<SoundPreset, number>>(() => ({
    nature: 0,
    gamma: 0,
    bowls: 0,
    animals: 0,
    jazz: 0,
    cafe: 0
  }));
  const { playSound, stopSound, initializeAudioContext, isInitialized } = useAudio();

  const handleUserInteraction = useCallback(async () => {
    if (!isInitialized) {
      await initializeAudioContext();
    }
  }, [isInitialized, initializeAudioContext]);

  const handleVolumeChange = useCallback(async (sound: SoundPreset, value: number[]) => {
    try {
      await handleUserInteraction();
      setVolumes(prev => ({ ...prev, [sound]: value[0] }));
      await playSound(sound, value[0] / 100);
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  }, [playSound, handleUserInteraction]);

  const handleButtonClick = useCallback(async (action: () => Promise<void> | void) => {
    try {
      await handleUserInteraction();
      await action();
    } catch (error) {
      console.error('Error handling button click:', error);
    }
  }, [handleUserInteraction]);

  const stopAll = useCallback(() => {
    (Object.keys(volumes) as SoundPreset[]).forEach(sound => {
      stopSound(sound);
    });
    setVolumes(() => ({
      nature: 0,
      gamma: 0,
      bowls: 0,
      animals: 0,
      jazz: 0,
      cafe: 0
    }));
  }, [volumes, stopSound]);

  const randomMix = useCallback(() => {
    stopAll();
    const newVolumes: Record<SoundPreset, number> = {} as Record<SoundPreset, number>;
    const sounds = Object.keys(soundPresets) as SoundPreset[];
    const numSounds = Math.floor(Math.random() * 3) + 2; // 2-4 sounds

    for (let i = 0; i < numSounds; i++) {
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      if (!newVolumes[sound]) {
        newVolumes[sound] = Math.random() * 50 + 25; // Random volume between 25-75
        playSound(sound, newVolumes[sound] / 100);
      }
    }
    setVolumes(newVolumes);
  }, [playSound, stopAll]);

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-card space-y-4 sm:space-y-6">
      <div className="flex justify-between sm:justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => handleButtonClick(stopAll)}
          className="flex-1 sm:flex-none"
          size="sm"
          title="Stop All Sounds"
        >
          <VolumeX className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Stop All</span>
        </Button>
        <Button 
          onClick={() => handleButtonClick(randomMix)}
          className="flex-1 sm:flex-none"
          size="sm"
          title="Random Sound Mix"
        >
          <Shuffle className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Random Mix</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {(Object.keys(soundPresets) as SoundPreset[]).map((name) => (
          <div 
            key={name} 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{name}</span>
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {volumes[name]}%
                </span>
              </div>
              <Slider
                value={[volumes[name] || 0]}
                onValueChange={v => handleVolumeChange(name, v)}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}