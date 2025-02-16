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
      <header className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between p-4 sm:p-6 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
          Dhyaan
        </h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <Quote />
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-8">
          <div className="p-4 sm:p-8 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-200 max-w-3xl mx-auto w-full">
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => setActiveTab(v as "clock" | "timer")}
              className="animate-slide-in"
            >
              <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-4 sm:mb-8">
                <TabsTrigger 
                  value="clock"
                  className="data-[state=active]:scale-100 transition-transform"
                >
                  Clock
                </TabsTrigger>
                <TabsTrigger 
                  value="timer"
                  className="data-[state=active]:scale-100 transition-transform"
                >
                  Timer
                </TabsTrigger>
              </TabsList>
              <div className="max-w-2xl mx-auto">
                <TabsContent value="clock" className="animate-slide-in">
                  <Clock />
                </TabsContent>
                <TabsContent value="timer" className="animate-slide-in">
                  <Timer />
                </TabsContent>
              </div>
            </Tabs>
          </div>
          <div className="animate-slide-up max-w-3xl mx-auto w-full">
            <AudioMixer />
          </div>
        </div>
        <div className="animate-slide-in">
          <TaskList />
        </div>
      </main>
    </div>
  );
}