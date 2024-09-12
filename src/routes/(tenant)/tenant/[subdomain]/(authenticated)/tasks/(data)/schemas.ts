import { z } from "zod";

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  createdBy: z
    .object({
      id: z.number(),
      username: z.string(),
    })
    .optional(),
  priority: z.string(),
  createdAt: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3),
  status: z.string().min(1, "Status is required"),
  label: z.string().min(1, "Label is required"),
  priority: z.string().min(1, "Priority is required"),
});

export type CreateTask = z.infer<typeof createTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
