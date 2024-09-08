import { z } from "zod";

const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-_]{0,32}[a-zA-Z0-9])?$/;

export const tenantCreationSchema = z.object({
  tenantName: z.string().min(4),
  subdomain: z
    .string()
    .min(4)
    .max(32)
    .regex(
      subdomainRegex,
      "subdomain contains only alphabetic characters, numbers, and hyphens (-), and cannot end with a hyphen"
    ),
  username: z.string().min(4).max(64),
  password: z.string().min(8).max(32),
});
