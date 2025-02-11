import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import confetti from 'canvas-confetti';

export function TaskList() {
  const [newTask, setNewTask] = useState("");
  const userId = "demo-user"; // In a real app, this would come from auth

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks", userId],
  });

  const createTask = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
      setNewTask("");
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", userId] });
      
      // Check if all tasks are completed
      const allCompleted = tasks.every(t => t.completed);
      if (allCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
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
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyPress={e => {
            if (e.key === "Enter" && newTask) {
              createTask.mutate(newTask);
            }
          }}
          placeholder="Add a new task..."
        />
        <Button onClick={() => newTask && createTask.mutate(newTask)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 rounded hover:bg-accent"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
            >
              <Check className={`h-4 w-4 ${task.completed ? "opacity-100" : "opacity-0"}`} />
            </Button>
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
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
