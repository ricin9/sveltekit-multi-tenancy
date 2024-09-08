// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
    interface Locals {
      user: import("lucia").User | null;
      session: import("lucia").Session | null;
      tenantDb: import("$lib/server/db/tenant").TenantDbType | null;
      lucia: import("$lib/server/auth").LuciaType | null;
    }
  }
}

export {};
