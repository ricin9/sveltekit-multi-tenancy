import {
  TURSO_GROUP_AUTH_TOKEN,
  TURSO_ORGANIZATION_NAME,
} from "$env/static/private";
import { error } from "@sveltejs/kit";

export async function GET({ request, locals }) {
  if (!locals.user?.role || locals.user.role !== "admin") {
    error(401, "Unauthorized");
  }

  const { databaseName } = locals.tenantInfo!;

  const res = await fetch(
    `https://${databaseName}-${TURSO_ORGANIZATION_NAME}.turso.io/dump`,
    {
      headers: {
        Authorization: `Bearer ${TURSO_GROUP_AUTH_TOKEN}`,
      },
    }
  );

  const stream = res.body;

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Disposition": "attachment",
      filename: databaseName + ".sql",
    },
  });
}
