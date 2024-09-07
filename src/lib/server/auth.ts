import { Lucia } from "lucia";
import { dev } from "$app/environment";
import type { TenantDbType } from "./db/tenant";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessions, users } from "./db/tenant/schema";

export function getLuciaForTenant(db: TenantDbType) {
  // @ts-ignore fix later, idk why it's complaining about db
  const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !dev,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        id: attributes.id,
        username: attributes.username,
        role: attributes.role,
      };
    },
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof getLuciaForTenant>;
    DatabaseUserAttributes: {
      id: number;
      username: string;
      role: ["admin", "normal"];
    };
  }
}
