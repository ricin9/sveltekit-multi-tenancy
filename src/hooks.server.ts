import { PUBLIC_DOMAIN } from "$env/static/public";
import { getLuciaForTenant } from "$lib/server/auth";
import { getDatabaseClientForHost } from "$lib/server/getDatabaseClientForHost";
import { getTenantDbClient } from "$lib/server/init-db";
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

  const tenantDb = await getDatabaseClientForHost(host);
  if (!tenantDb) {
    error(404, { message: "Not Found" });
  }

  /* authenticate users of tenants with lucia */
  const lucia = getLuciaForTenant(tenantDb);
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
  event.locals.tenantDb = tenantDb;
  return resolve(event);
};
