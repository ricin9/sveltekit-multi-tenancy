import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { tenantCreationSchema } from "./schema";
import type { Actions } from "@sveltejs/kit";
import { centralDb } from "$lib/server/db/central";
import { tenants } from "$lib/server/db/central/schema";
import { eq } from "drizzle-orm";
import {
  TURSO_GROUP_NAME,
  TURSO_ORGANIZATION_NAME,
  TURSO_PLATFORM_AUTH_TOKEN,
  TURSO_SCHEMA_DATABASE_NAME,
} from "$env/static/private";
import { createClient } from "@tursodatabase/api";
import { hashPassword } from "$lib/server/utils/password-utils";
import { getTenantDbClient } from "$lib/server/utils/init-db";
import { users } from "$lib/server/db/tenant/schema";
import { PUBLIC_DOMAIN } from "$env/static/public";

export async function load() {
  const form = await superValidate(zod(tenantCreationSchema));

  return { form };
}

export const actions: Actions = {
  default: async function ({ request }) {
    const form = await superValidate(request, zod(tenantCreationSchema));

    if (!form.valid) return fail(400, { form });

    const { username, subdomain, tenantName, password } = form.data;

    const tenant = await centralDb.query.tenants.findFirst({
      where: eq(tenants.subdomain, subdomain),
      columns: { tenantId: true },
    });

    if (tenant) {
      return setError(form, "subdomain", "Subdomain already exists");
    }

    const tursoPlatform = createClient({
      org: TURSO_ORGANIZATION_NAME,
      token: TURSO_PLATFORM_AUTH_TOKEN,
    });

    const databaseName = `v1-${subdomain}`;
    const data = await tursoPlatform.databases.create(databaseName, {
      group: TURSO_GROUP_NAME,
      schema: TURSO_SCHEMA_DATABASE_NAME,
    });

    const passwordHash = await hashPassword(password);

    const companyData = await centralDb.insert(tenants).values({
      subdomain,
      name: tenantName,
      databaseName,
    });
    const tenantDb = getTenantDbClient(databaseName);

    const userData = await tenantDb.insert(users).values({
      username,
      password: passwordHash,
      role: "admin",
    });
    return message(form, {
      message: "Your tenant has been successfully created",
      domain: `http://${subdomain}.${PUBLIC_DOMAIN}`,
    });
  },
};
