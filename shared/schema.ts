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
  jazz: "/music/jazz.mp3",
  cafe: "https://cdn.example.com/sounds/cafe.mp3"
} as const;

export const quotes = [
  { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
  { text: "Success is no accident. It is hard work, perseverance, and learning.", author: "Pelé" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { "text": "The important thing is not to stop questioning.", "author": "Albert Einstein" },
  { "text": "If I have seen further, it is by standing on the shoulders of giants.", "author": "Isaac Newton" },
  { "text": "Nothing in life is to be feared; it is only to be understood.", "author": "Marie Curie" },
  { "text": "Intelligence is the ability to adapt to change.", "author": "Stephen Hawking" },
  { "text": "The science of today is the technology of tomorrow.", "author": "Edward Teller" },
  { "text": "The more you know, the less you fear.", "author": "Chris Hadfield" },
  { "text": "Be the change you wish to see in the world.", "author": "Mahatma Gandhi" },
  { "text": "The present is theirs; the future, for which I really worked, is mine.", "author": "Nikola Tesla" },
  { "text": "I have no special talent. I am only passionately curious.", "author": "Albert Einstein" },
  { "text": "Innovation distinguishes between a leader and a follower.", "author": "Steve Jobs" },
  { "text": "When something is important enough, you do it even if the odds are not in your favor.", "author": "Elon Musk" },
  { "text": "Failure is an option here. If things are not failing, you are not innovating enough.", "author": "Elon Musk" },
  { "text": "Play long-term games with long-term people.", "author": "Naval Ravikant" },
  { "text": "The most important skill for getting rich is becoming a perpetual learner.", "author": "Naval Ravikant" },
  { "text": "The greatest weapon against stress is our ability to choose one thought over another.", "author": "William James" },
  { "text": "Success is no accident. It is hard work, perseverance, learning, and sacrifice.", "author": "Pelé" },
  { "text": "Logic will get you from A to B. Imagination will take you everywhere.", "author": "Albert Einstein" },
  { "text": "Your time is limited, don't waste it living someone else's life.", "author": "Steve Jobs" },
  { "text": "It always seems impossible until it's done.", "author": "Nelson Mandela" },
  { "text": "A smooth sea never made a skilled sailor.", "author": "Franklin D. Roosevelt" }
];