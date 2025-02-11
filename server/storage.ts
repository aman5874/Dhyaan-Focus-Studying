import { tasks, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, completed: boolean): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
  }

  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = { ...insertTask, id, completed: false };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, completed: boolean): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error("Task not found");
    
    const updatedTask = { ...task, completed };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
