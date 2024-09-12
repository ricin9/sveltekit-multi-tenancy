import { PUBLIC_DOMAIN } from "$env/static/public";
import { getLuciaForTenant } from "$lib/server/auth";
import { getTenant } from "$lib/server/utils/getTenantInformation";
import { error, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  /* disallow access to PUBLIC_DOMAIN/tenant, this is optional */
  const { host, pathname } = event.url;
  if (host === PUBLIC_DOMAIN) {
    if (pathname.startsWith("/tenant")) {
      error(404, { message: "Not Found" });
    } else {
      return resolve(event);
    }
  }

  /* if no database returned for given subdomain or custom domain then the tenant does not exist */

  const tenant = await getTenant(host);
  if (!tenant) {
    error(404, { message: "Not Found" });
  }
  event.locals.tenantDb = tenant.tenantDb;
  event.locals.tenantInfo = tenant.tenantInfo!;

  /* authenticate users of tenants with lucia */
  const lucia = getLuciaForTenant(tenant.tenantDb);
  event.locals.lucia = lucia;
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }

  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};
