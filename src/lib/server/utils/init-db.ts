import {
  TURSO_GROUP_AUTH_TOKEN,
  TURSO_ORGANIZATION_NAME,
} from "$env/static/private";
import { createClient } from "@libsql/client";
import { tenantTSchema } from "../db/tenant";
import { drizzle } from "drizzle-orm/libsql";

export const getTenantDbClient = (databaseName: string) => {
  const authToken = TURSO_GROUP_AUTH_TOKEN;

  const tenantDbUrl = makeTenantDbUrl({
    dbName: databaseName,
    orgName: TURSO_ORGANIZATION_NAME,
  });

  const tenantTursoClient = createClient({ url: tenantDbUrl, authToken });
  const tenantDb = drizzle(tenantTursoClient, { schema: tenantTSchema });

  return tenantDb;
};

type MakeTenantDbUrl = {
  orgName: string;
  dbName: string;
};

function makeTenantDbUrl(input: MakeTenantDbUrl) {
  const { orgName, dbName } = input;
  return `libsql://${dbName}-${orgName}.turso.io`;
}
