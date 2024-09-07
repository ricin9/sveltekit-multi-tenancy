import { createInsertSchema } from "drizzle-zod";
import { companies, users } from "../../../../lib/db/central/schema";
import { z } from "@hono/zod-openapi";

export const loginUserSchema = z.object({
  username: z.string().trim().min(4).max(32),
  password: z.string().min(8).max(32),
});

const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-_]{0,32}[a-zA-Z0-9])?$/;
export const createCompanySchema = loginUserSchema.merge(
  createInsertSchema(companies, {
    companySubdomain: z
      .string()
      .trim()
      .regex(
        subdomainRegex,
        "subdomain contains only alphabetic characters, numbers, and hyphens (-), and cannot end with a hyphen"
      )
      .toLowerCase(),
  }).omit({ companyId: true, createdAt: true })
);
