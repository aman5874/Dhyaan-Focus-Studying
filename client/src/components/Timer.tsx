import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
    setTimeLeft(value[0] * 60);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <Slider
        value={[duration]}
        onValueChange={handleDurationChange}
        min={1}
        max={60}
        step={1}
        disabled={isRunning}
      />

      <div className="flex justify-center gap-2">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "destructive" : "default"}
        >
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(duration * 60);
          }}
          variant="outline"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
