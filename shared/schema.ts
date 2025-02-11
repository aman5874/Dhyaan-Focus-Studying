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
  nature: {
    rain: "https://cdn.example.com/sounds/rain.mp3",
    forest: "https://cdn.example.com/sounds/forest.mp3",
    waterfall: "https://cdn.example.com/sounds/waterfall.mp3"
  },
  focus: {
    gamma: "https://cdn.example.com/sounds/40hz.mp3"
  },
  zen: {
    bowls: "https://cdn.example.com/sounds/singing-bowls.mp3"
  },
  animals: {
    birds: "https://cdn.example.com/sounds/birds.mp3"
  },
  jazz: {
    soft: "https://cdn.example.com/sounds/soft-jazz.mp3"
  },
  ambient: {
    cafe: "https://cdn.example.com/sounds/cafe.mp3"
  }
} as const;

export const quotes = [
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" }
];