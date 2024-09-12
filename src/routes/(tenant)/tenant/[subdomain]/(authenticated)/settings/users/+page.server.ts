import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createUserSchema } from "./schema.js";
import { error } from "@sveltejs/kit";
import { hashPassword } from "$lib/server/utils/password-utils.js";
import { users } from "$lib/server/db/tenant/schema.js";

export async function load() {
  const form = await superValidate(zod(createUserSchema));
  return { form };
}

export const actions = {
  createUser: async ({ request, locals }) => {
    if (!locals.user?.role || locals.user.role !== "admin") {
      error(401, "Unauthorized");
    }
    const form = await superValidate(request, zod(createUserSchema));

    if (!form.valid) return fail(400, { form });

    const { username, password, role } = form.data;

    const passwordHash = await hashPassword(password);

    const tenantDb = locals.tenantDb!;

    try {
      await tenantDb.insert(users).values({
        username,
        password: passwordHash,
        role,
      });
    } catch (err) {
      // TODO, narrow error to libsql error and see if it's really foreign key constraint violation
      setError(form, "username", "Username already exists");
      return fail(400, { form });
    }
    return message(form, "User Created Successfully");
  },
};
