import * as tenantSchema from "./schema";
import * as tenantRelations from "./relations";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

export const tenantTSchema = { ...tenantSchema, ...tenantRelations };

export type TenantDbType = LibSQLDatabase<typeof tenantTSchema>;
