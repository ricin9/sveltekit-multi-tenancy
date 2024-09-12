import { relations } from "drizzle-orm";
import { tasks, users } from "./schema";

export const userRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  createdBy: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
  }),
}));
