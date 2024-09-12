import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { tenantNameSchema } from "./schema.js";
import { centralDb } from "$lib/server/db/central/index.js";
import { tenants } from "$lib/server/db/central/schema.js";
import { eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";

export async function load({ locals }) {
  const tenantName = locals.tenantInfo?.name;
  const form = await superValidate({ tenantName }, zod(tenantNameSchema));
  return { form };
}

export const actions = {
  changeTenantName: async ({ request, locals }) => {
    if (!locals.user?.role || locals.user.role !== "admin") {
      error(401, "Unauthorized");
    }
    const form = await superValidate(request, zod(tenantNameSchema));

    if (!form.valid) return fail(400, { form });

    await centralDb
      .update(tenants)
      .set({ name: form.data.tenantName })
      .where(eq(tenants.tenantId, locals.tenantInfo?.tenantId!));

    return message(form, "Tenant name updated successfully");
  },
};
