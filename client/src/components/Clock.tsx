import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center items-baseline gap-2">
        <span className="text-8xl font-mono font-light tracking-tight">
          {hours}
          <span className="text-primary animate-pulse">:</span>
          {minutes}
        </span>
        <span className="text-4xl font-mono text-muted-foreground">
          {seconds}
        </span>
      </div>

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