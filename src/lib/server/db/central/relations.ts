import { relations } from "drizzle-orm";
import { customDomains, tenants } from "./schema";

export const tenantRelations = relations(tenants, ({ many }) => ({
  customDomains: many(customDomains),
}));

export const customDomainRelations = relations(customDomains, ({ one }) => ({
  tenant: one(tenants, {
    fields: [customDomains.tenantId],
    references: [tenants.tenantId],
  }),
}));
