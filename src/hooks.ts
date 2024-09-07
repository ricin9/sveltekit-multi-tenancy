import { PUBLIC_DOMAIN } from "$env/static/public";
import { getDomainAndType } from "$lib/util";
import type { Reroute } from "@sveltejs/kit";

export const reroute: Reroute = ({ url }) => {
  const domain = getDomainAndType(url.host);
  if (domain.type === "appDomain") {
    return url.pathname;
  } else {
    const tenantDomain = domain.domain;
    return `/tenant/${tenantDomain}/${url.pathname}`;
  }
};
