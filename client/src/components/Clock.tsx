
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sun, Moon, Cloud } from "lucide-react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  const getTimeIcon = () => {
    if (hours >= 6 && hours < 18) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    } else if (hours >= 18 && hours < 20) {
      return <Cloud className="w-8 h-8 text-orange-500" />;
    } else {
      return <Moon className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <Card className="p-8 flex flex-col items-center space-y-6 bg-gradient-to-br from-background to-accent/20">
      <div className="animate-float">
        {getTimeIcon()}
      </div>
      
      <div className="flex items-baseline gap-4">
        <div className="text-8xl font-mono font-light tracking-tighter">
          {displayHours}
          <span className="text-primary animate-pulse">:</span>
          {minutes}
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="text-4xl font-mono text-muted-foreground">
            {seconds}
          </span>
          <span className="text-sm font-semibold">
            {period}
          </span>
        </div>
      </div>

      <div className="text-sm text-muted-foreground font-medium">
        {time.toLocaleDateString(undefined, { 
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </Card>
  );
}
