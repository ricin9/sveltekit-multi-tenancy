import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createTaskSchema } from "./(data)/schemas.js";
import { tasks } from "$lib/server/db/tenant/schema.js";

export async function load({ locals, parent }) {
  await parent();
  const form = await superValidate(zod(createTaskSchema));
  const { tenantDb } = locals;
  const tasks = await tenantDb!.query.tasks.findMany({
    with: { createdBy: { columns: { username: true, id: true } } },
  });

  return { tasks, form };
}

export const actions = {
  default: async function ({ request, locals }) {
    const { tenantDb, user } = locals;
    const form = await superValidate(request, zod(createTaskSchema));

    console.log(form.data, form.valid);
    if (!form.valid) return fail(400, { form });

    const { title, status, label, priority } = form.data;

    const task = await tenantDb!
      .insert(tasks)
      .values({
        title,
        status,
        label,
        priority,
        createdBy: user!.id,
      })
      .returning();
    return message(form, { task });
  },
};
