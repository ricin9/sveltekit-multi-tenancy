import { z } from "zod";

export const customDomainSchema = z.object({
  host: z
    .string()
    .min(4)
    .includes(".")
    .max(255)
    .refine(
      (host) =>
        !host.includes(":") && !host.includes("/") && !host.includes(" "),
      "Must not include protocols, ':' or '/'"
    ),
});
