import { PUBLIC_DOMAIN } from "$env/static/public";

export const subdomainRegex = new RegExp(
  `(.*)\.${PUBLIC_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
);

interface Domain {
  domain: string;
  type: "subdomain" | "customDomain" | "appDomain";
}

export function getDomainAndType(host: string): Domain {
  if (host === PUBLIC_DOMAIN) return { domain: host, type: "appDomain" };

  const domain = host.match(subdomainRegex)?.[1];
  if (domain) {
    return { domain, type: "subdomain" };
  }

  return { domain: host, type: "customDomain" };
}
