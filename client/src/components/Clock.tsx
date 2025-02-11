import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-4">
      <time className="text-7xl font-mono tracking-tight">
        {time.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        })}
      </time>
      <p className="text-sm text-muted-foreground">
        {time.toLocaleDateString([], { 
          weekday: 'long', 
          year: 'numeric',
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
  );
}