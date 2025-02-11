import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  userId: text("user_id").notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  userId: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const soundPresets = {
  nature: "https://cdn.example.com/sounds/nature.mp3",
  gamma: "https://cdn.example.com/sounds/40hz.mp3",
  bowls: "https://cdn.example.com/sounds/singing-bowls.mp3",
  animals: "https://cdn.example.com/sounds/animals.mp3",
  jazz: "https://cdn.example.com/sounds/soft-jazz.mp3",
  cafe: "https://cdn.example.com/sounds/cafe.mp3"
} as const;

export const quotes = [
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" }
];