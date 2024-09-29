import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tenants = sqliteTable("tenants", {
  tenantId: integer("tenant_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  databaseName: text("database_name").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`current_timestamp`),
});

export const customDomains = sqliteTable("custom_domains", {
  customDomainId: integer("custom_domain_id").primaryKey({
    autoIncrement: true,
  }),
  customDomain: text("custom_domain").unique().notNull(),
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  cloudflareHostnameId: text("cloudflare_hostname_id"),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenants.tenantId),
  createdAt: text("created_at")
    .notNull()
    .default(sql`current_timestamp`),
});
