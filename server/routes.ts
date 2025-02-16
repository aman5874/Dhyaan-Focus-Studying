import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { quotes } from "@shared/schema";
import express from 'express';
import { deleteAllTasks } from './storage';

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/quotes", (_req, res) => {
    res.json(quotes);
  });

  app.get("/api/tasks/:userId", async (req, res) => {
    const tasks = await storage.getTasks(req.params.userId);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const task = await storage.createTask(result.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const task = await storage.updateTask(Number(req.params.id), req.body.completed);
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await storage.deleteTask(Number(req.params.id));
    res.status(204).end();
  });

  const router = express.Router();

  router.delete('/api/tasks/:userId/all', async (req, res) => {
    const { userId } = req.params;
    try {
      await deleteAllTasks(userId);
      res.status(200).send({ message: 'All tasks deleted' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete tasks' });
    }
  });

  return httpServer;
}

export default registerRoutes;
