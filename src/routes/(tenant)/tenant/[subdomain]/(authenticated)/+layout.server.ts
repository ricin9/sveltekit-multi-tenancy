import { redirect } from "@sveltejs/kit";

export function load({ locals }) {
  if (!locals.user || !locals.tenantInfo) {
    redirect(302, "/login");
  }

  return { user: locals.user, tenantInfo: locals.tenantInfo };
}
