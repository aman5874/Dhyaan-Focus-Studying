import { useState } from "react";
import { Clock } from "@/components/Clock";
import { Timer } from "@/components/Timer";
import { AudioMixer } from "@/components/AudioMixer";
import { TaskList } from "@/components/TaskList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Quote } from "@/components/Quote";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"clock" | "timer">("clock");
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Dhyaan
        </h1>
        <Quote />
        <ThemeToggle />
      </header>

      <main className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-lg bg-card shadow-sm">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "clock" | "timer")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="clock">Clock</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
              </TabsList>
              <TabsContent value="clock">
                <Clock />
              </TabsContent>
              <TabsContent value="timer">
                <Timer />
              </TabsContent>
            </Tabs>
          </div>
          <AudioMixer />
        </div>
        <TaskList />
      </main>
    </div>
  );
}