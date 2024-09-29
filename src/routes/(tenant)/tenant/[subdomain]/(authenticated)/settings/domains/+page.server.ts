import { fail, message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { customDomainSchema } from "./schema.js";
import { centralDb } from "$lib/server/db/central/index.js";
import { customDomains, tenants } from "$lib/server/db/central/schema.js";
import { and, eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import { CLOUDFLARE_ZONE_ID, CLOUDFLARE_TOKEN } from "$env/static/private";
import { PUBLIC_DOMAIN } from "$env/static/public";

async function getDomainInfo(tenantId: number) {
  const [domainInfo] = await centralDb
    .select({
      subdomain: tenants.subdomain,
      customDomain: customDomains.customDomain,
      customDomainCfId: customDomains.cloudflareHostnameId,
      customDomainVerified: customDomains.verified,
    })
    .from(tenants)
    .leftJoin(customDomains, eq(tenants.tenantId, customDomains.tenantId))
    .where(eq(tenants.tenantId, tenantId))
    .limit(1);
  return domainInfo;
}

async function checkDomainStatusCF(
  domainCfId: string | null
): Promise<string[]> {
  if (!domainCfId) return [];
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames/${domainCfId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
      },
      body: JSON.stringify({
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

  const errors: string[] = [];
  const result = (await res.json()) as Record<string, any>;
  const verificationErrors =
    result.result.verification_errors || ([] as string[]);
  if (
    verificationErrors.length > 0 &&
    verificationErrors[0].includes("CNAME")
  ) {
    errors.push(`Your domain does not CNAME to ${PUBLIC_DOMAIN}`);
  }

  if (errors.length == 0 && result.result.status == "pending") {
    errors.push(
      "Your domain's SSL certificate installation is pending, this shouldn't take a long time"
    );
  }
  return errors;
}

export async function load({ locals }) {
  // maybe stream domain Info and domain errors
  const domainInfo = await getDomainInfo(locals.tenantInfo?.tenantId!);
  const form = await superValidate(zod(customDomainSchema));
  const domainErrors = await checkDomainStatusCF(domainInfo.customDomainCfId);
  return { form, domainInfo, domainErrors };
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

    const result = (await res.json()) as Record<string, any>;
    const domainCfId = result.result.id as string;
    if (!res.ok || !domainCfId) {
      setError(form, "host", "failed to add custom domain");
      console.log(result);
      return fail(500, { form });
    }

    await centralDb.insert(customDomains).values({
      tenantId: locals.tenantInfo?.tenantId!,
      customDomain: form.data.host,
      cloudflareHostnameId: domainCfId,
    });

    return message(
      form,
      "Added custom domain successfully, please wait for DNS to propagate and SSL to be issued"
    );
  },
  deleteCustomDomain: async ({ locals }) => {
    if (!locals.user?.role || locals.user.role !== "admin") {
      error(401, "Unauthorized");
    }

    const domainInfo = await getDomainInfo(locals.tenantInfo?.tenantId!);

    if (!domainInfo.customDomain || !domainInfo.customDomainCfId) return;
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/custom_hostnames/${domainInfo.customDomainCfId}`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
        },
      }
    );

    if (!res.ok) return;

    await centralDb
      .delete(customDomains)
      .where(
        and(
          eq(customDomains.tenantId, locals.tenantInfo?.tenantId!),
          eq(customDomains.cloudflareHostnameId, domainInfo.customDomainCfId)
        )
      );
  },
};
