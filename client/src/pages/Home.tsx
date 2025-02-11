import { useState } from "react";
import { Clock } from "@/components/Clock";
import { Timer } from "@/components/Timer";
import { AudioMixer } from "@/components/AudioMixer";
import { TaskList } from "@/components/TaskList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Quote } from "@/components/Quote";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";

export default function Home() {
  const [showTimer, setShowTimer] = useState(false);
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Dhyaan
        </h1>
        <Quote />
        <ThemeToggle />
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-lg bg-card">
            {showTimer ? <Timer /> : <Clock />}
            <button
              onClick={() => setShowTimer(!showTimer)}
              className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Switch to {showTimer ? "Clock" : "Timer"}
            </button>
          </div>
          <AudioMixer />
        </div>
        <TaskList />
      </main>
    </div>
  );
}
