import { users } from "$lib/server/db/tenant/schema";
import { verifyPassword } from "$lib/server/utils/password-utils";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "./schema";
import { delay } from "$lib/server/utils/fluff";

export async function load() {
  const form = await superValidate(zod(loginSchema));

  return { form };
}

export const actions: Actions = {
  default: async function ({ request, locals, cookies, url }) {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) return fail(400, { form });

    const { username, password } = form.data;

    const { tenantDb, lucia } = locals;
    if (!tenantDb || !lucia) {
      error(500, "This app (sub)domain is invalid");
    }
    const existingUser = await tenantDb.query.users.findFirst({
      where: eq(users.username, username),
      columns: { id: true, username: true, password: true },
    });

    if (
      !existingUser ||
      !(await verifyPassword(existingUser.password, password))
    ) {
      return setError(form, "", "Username or password incorrect");
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    await delay(2000);
    redirect(302, "/");
  },
};
