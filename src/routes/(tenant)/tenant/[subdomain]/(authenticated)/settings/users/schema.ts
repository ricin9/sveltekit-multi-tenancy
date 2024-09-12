import { z } from "zod";
import { tenantCreationSchema } from "../../../../../../(central)/schema";

export const createUserSchema = tenantCreationSchema
  .pick({
    username: true,
    password: true,
  })
  .extend({
    role: z.enum(["normal", "admin"]),
  });
