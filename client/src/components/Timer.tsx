import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Clock, Play, Square, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const motivationalMessages = [
  "You're doing great! Keep pushing forward!",
  "Amazing work! One step closer to your goals!",
  "Fantastic progress! Your dedication is inspiring!",
  "Keep going! You're building great habits!",
  "Outstanding focus! You're mastering the art of learning!"
];

export function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(25);
  const [studyTime, setStudyTime] = useState(0);
  const { toast } = useToast();

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

      setStudyTime(time => {
        const newTime = time + 1;
        // Check if user has completed an hour (3600 seconds)
        if (newTime % 3600 === 0) {
          const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          toast({
            title: "Study Milestone! 🎉",
            description: message,
            duration: 5000,
          });
        }
        return newTime;
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
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-5 h-5" />
        <h2 className="text-lg font-medium">Focus Timer</h2>
      </div>

      <div className="text-center space-y-2">
        <div className="text-7xl font-mono tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-sm text-muted-foreground">
          Duration: {duration} minutes
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          Adjust Duration
        </label>
        <Slider
          value={[duration]}
          onValueChange={handleDurationChange}
          min={1}
          max={60}
          step={1}
          disabled={isRunning}
          className="py-4"
        />
      </div>

      <div className="flex justify-center gap-3">
        <Button
          size="lg"
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "destructive" : "default"}
          className="w-24"
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          size="lg"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(duration * 60);
          }}
          variant="outline"
          className="w-24"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </Card>
  );
}