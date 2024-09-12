import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { customDomainSchema } from "./schema.js";
import { centralDb } from "$lib/server/db/central/index.js";
import { customDomains, tenants } from "$lib/server/db/central/schema.js";
import { eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import { CLOUDFLARE_ZONE_ID, CLOUDFLARE_TOKEN } from "$env/static/private";

async function getDomainInfo(tenantId: number) {
  const [domainInfo] = await centralDb
    .select({
      subdomain: tenants.subdomain,
      customDomain: customDomains.customDomain,
      customDomainVerified: customDomains.verified,
    })
    .from(tenants)
    .leftJoin(customDomains, eq(tenants.tenantId, customDomains.tenantId))
    .where(eq(tenants.tenantId, tenantId))
    .limit(1);
  return domainInfo;
}

export async function load({ locals }) {
  const domainInfo = await getDomainInfo(locals.tenantInfo?.tenantId!);
  const form = await superValidate(zod(customDomainSchema));
  return { form, domainInfo };
}

export const actions = {
  setCustomDomain: async ({ request, locals }) => {
    if (!locals.user?.role || locals.user.role !== "admin") {
      error(401, "Unauthorized");
    }

    const domainInfo = await getDomainInfo(locals.tenantInfo?.tenantId!);
    if (domainInfo.customDomain) {
      return fail(400, {
        form: {
          errors: [{ message: "Custom domain already set" }],
        },
      });
    }

    const form = await superValidate(request, zod(customDomainSchema));

    if (!form.valid) return fail(400, { form });

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
        },
        body: JSON.stringify({
          hostname: form.data.host,
          ssl: {
            method: "http",
            settings: {
              min_tls_version: "1.0",
            },
            type: "dv",
          },
        }),
      }
    );

    if (!res.ok) {
      setError(form, "host", "failed to add custom domain");
      console.log(await res.json());
      return fail(500, { form });
    }

    await centralDb.insert(customDomains).values({
      tenantId: locals.tenantInfo?.tenantId!,
      customDomain: form.data.host,
    });

    return message(
      form,
      "Added custom domain successfully, please wait for DNS to propagate and SSL to be issued"
    );
  },
};
