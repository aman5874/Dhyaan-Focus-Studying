import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <time className="text-6xl font-mono">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
      <p className="text-sm text-muted-foreground mt-2">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
}
