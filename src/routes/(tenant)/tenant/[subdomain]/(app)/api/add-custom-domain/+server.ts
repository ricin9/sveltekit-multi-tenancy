import { json } from "@sveltejs/kit";
import { Resolver } from "dns/promises";

export async function GET({ request, locals }) {
  const resolver = new Resolver();
  // resolver.setServers(["1.1.1.1", "1.0.0.1"]);
  const records = await resolver.resolveTxt("resend._domainkey.miloudi.dev");
  return json({ records });
}
