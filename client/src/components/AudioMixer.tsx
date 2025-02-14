import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/lib/useAudio";
import { soundPresets } from "@shared/schema";

export function AudioMixer() {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const { playSound, stopSound } = useAudio();

  const handleVolumeChange = (sound: string, value: number[]) => {
    setVolumes(prev => ({ ...prev, [sound]: value[0] }));
    playSound(sound, value[0] / 100);
  };

  const stopAll = () => {
    Object.keys(volumes).forEach(sound => {
      stopSound(sound);
    });
    setVolumes({});
  };

  const randomMix = () => {
    stopAll();
    const newVolumes: Record<string, number> = {};
    const sounds = Object.keys(soundPresets);
    const numSounds = Math.floor(Math.random() * 3) + 2; // 2-4 sounds

    for (let i = 0; i < numSounds; i++) {
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      if (!newVolumes[sound]) {
        newVolumes[sound] = Math.random() * 50 + 25; // Random volume between 25-75
        playSound(sound, newVolumes[sound] / 100);
      }
    }
    setVolumes(newVolumes);
  };

  const handlePlayJazz = () => {
    playSound('jazz', 0.5); // Play jazz at 50% volume
  };

  const handleStopJazz = () => {
    stopSound('jazz');
  };

  return (
    <div className="p-6 rounded-lg bg-card space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={stopAll}>Stop All</Button>
        <Button onClick={randomMix}>Random Mix</Button>
        <Button onClick={handlePlayJazz}>Play Jazz</Button>
        <Button onClick={handleStopJazz}>Stop Jazz</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(soundPresets).map(([name]) => (
          <div key={name} className="flex items-center gap-4">
            <span className="w-16 text-sm capitalize">{name}</span>
            <Slider
              value={[volumes[name] || 0]}
              onValueChange={v => handleVolumeChange(name, v)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}