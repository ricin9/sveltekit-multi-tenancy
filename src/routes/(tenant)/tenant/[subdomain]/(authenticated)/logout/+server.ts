import { redirect } from "@sveltejs/kit";

export async function GET({ locals, cookies }) {
  const { lucia } = locals;
  if (!locals.session || !lucia) {
    redirect(301, "/login");
  }

  await lucia.invalidateSession(locals.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: ".",
    ...sessionCookie.attributes,
  });
  redirect(301, "/login");
}
