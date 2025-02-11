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
    Object.entries(soundPresets).forEach(([category, sounds]) => {
      const sound = Object.keys(sounds)[Math.floor(Math.random() * Object.keys(sounds).length)];
      newVolumes[sound] = Math.random() * 50 + 25; // Random volume between 25-75
      playSound(sound, newVolumes[sound] / 100);
    });
    setVolumes(newVolumes);
  };

  return (
    <div className="p-6 rounded-lg bg-card space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sound Mixer</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={stopAll}>Stop All</Button>
          <Button onClick={randomMix}>Random Mix</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(soundPresets).map(([category, sounds]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium capitalize">{category}</h3>
            {Object.entries(sounds).map(([name, _url]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-20 text-sm capitalize">{name}</span>
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
        ))}
      </div>
    </div>
  );
}
