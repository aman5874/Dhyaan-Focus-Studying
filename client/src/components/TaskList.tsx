import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Check, Plus, Trash2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import confetti from 'canvas-confetti';

const celebrateCompletion = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500']
  });

  // Second burst after a small delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500']
    });
  }, 200);

  // Third burst from the other side
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500']
    });
  }, 400);
};

export function TaskList() {
  const [newTask, setNewTask] = useState("");
  const userId = "demo-user";
  const { toast } = useToast();

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks", userId],
    queryFn: () => apiRequest("GET", `/api/tasks/${userId}`).then(res => res.json())
  });

  const createTask = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/tasks", { title, userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
      setNewTask("");
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
      const allCompleted = tasks.every(t => t.completed);
      if (allCompleted && tasks.length > 0) {
        celebrateCompletion();
        toast({
          title: "Outstanding Achievement! 🏆",
          description: "You've completed all your tasks! Your dedication is truly inspiring!",
          duration: 5000,
        });
      }
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
    },
  });

  return (
    <Card className="p-4 h-[calc(100vh-8rem)] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>

      <div className="flex gap-2 mb-4">
        <Input
          data-new-task
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && newTask.trim()) {
              createTask.mutate(newTask.trim());
            }
          }}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button 
          onClick={() => newTask.trim() && createTask.mutate(newTask.trim())}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="group flex items-center gap-2 p-2 rounded-md hover:bg-accent/50"
          >
            <Button
              variant={task.completed ? "default" : "outline"}
              size="icon"
              className="h-6 w-6 p-0 shrink-0"
              onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
            >
              <Check className={`h-4 w-4 ${task.completed ? "opacity-100" : "opacity-50"}`} />
            </Button>

            <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteTask.mutate(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}