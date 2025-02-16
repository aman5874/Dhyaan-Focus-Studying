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
  // First burst from bottom-center
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.8, x: 0.5 },
    gravity: 0.8,
    scalar: 1.2,
    startVelocity: 30,
    colors: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500']
  });

  // Second burst from left
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.5 },
      gravity: 0.8,
      scalar: 1.2,
      startVelocity: 30,
      colors: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500']
    });
  }, 250);

  // Third burst from right
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.5 },
      gravity: 0.8,
      scalar: 1.2,
      startVelocity: 30,
      colors: ['#FF1493', '#00FF00', '#00BFFF', '#FFD700', '#FF4500']
    });
  }, 500);
};

// Define a type for the task objects
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export function TaskList() {
  const [newTask, setNewTask] = useState("");
  const userId = "demo-user";
  const { toast } = useToast();

  const { data: tasks = [] } = useQuery<Task[]>({
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
    onSuccess: (_, { completed }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
      const allCompleted = tasks.every((t: Task) => 
        t.id === _.id ? completed : t.completed
      );
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
    <Card className="p-4 md:p-6 h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col max-w-2xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">My Tasks</h2>

      <div className="flex gap-3 mb-4 md:mb-6">
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
          className="flex-1 text-base md:text-lg h-11"
        />
        <Button 
          onClick={() => newTask.trim() && createTask.mutate(newTask.trim())}
          size="default"
          className="h-11 px-4 md:px-6"
        >
          <Plus className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Add</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="group flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors border border-transparent hover:border-accent-foreground/10"
            >
              <Button
                variant={task.completed ? "default" : "outline"}
                size="icon"
                className="h-6 w-6 md:h-7 md:w-7 p-0 shrink-0"
                onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
              >
                <Check className={`h-4 w-4 md:h-5 md:w-5 ${task.completed ? "opacity-100" : "opacity-50"}`} />
              </Button>

              <span className={`flex-1 text-base md:text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-7 md:w-7 p-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteTask.mutate(task.id)}
              >
                <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}