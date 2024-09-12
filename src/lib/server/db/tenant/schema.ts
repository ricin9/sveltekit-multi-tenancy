import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("user_id").primaryKey({ autoIncrement: true }), // have to use id instead of userId for lucia auth
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "normal"] }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`current_timestamp`),
});

export const sessions = sqliteTable("sessions", {
  id: text("session_id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("task_id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  status: text("status").notNull(),
  label: text("label").notNull(),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  priority: text("priority").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`current_timestamp`),
});
