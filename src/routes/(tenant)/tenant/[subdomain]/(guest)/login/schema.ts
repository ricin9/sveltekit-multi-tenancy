import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(4).max(64),
  password: z.string().min(8).max(32),
});
