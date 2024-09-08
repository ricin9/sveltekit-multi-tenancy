import { eq } from "drizzle-orm";
import { centralDb } from "../db/central";
import { tenants, customDomains } from "../db/central/schema";
import { getTenantDbClient } from "../utils/init-db";
import { getDomainAndType } from "../../util";

export async function getDatabaseClientForHost(host: string) {
  const { domain, type } = getDomainAndType(host);

  if (type === "appDomain") return null;

  let databaseName: string = "";
  if (type === "subdomain") {
    const tenant = await centralDb.query.tenants.findFirst({
      where: eq(tenants.subdomain, domain.toLocaleLowerCase()),
      columns: { databaseName: true },
    });

    if (!tenant) return null;
    databaseName = tenant.databaseName;
  } else if (type === "customDomain") {
    const data = await centralDb.query.customDomains.findFirst({
      where: eq(customDomains.customDomain, domain.toLocaleLowerCase()),
      columns: {},
      with: { tenant: { columns: { databaseName: true } } },
    });

    if (!data) return null;
    databaseName = data.tenant.databaseName;
  }

  const tenantDb = getTenantDbClient(databaseName);
  return tenantDb;
}
