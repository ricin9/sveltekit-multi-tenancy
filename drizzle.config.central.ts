import type { Config } from "@libsql/client";
import { defineConfig } from "drizzle-kit";

const databaseUrlConfig: Config = {
  url: process.env.TURSO_CENTRAL_DATABASE_URL!,
  authToken: process.env.TURSO_GROUP_AUTH_TOKEN!,
};

export default defineConfig({
  schema: [
    "./src/lib/server/db/central/schema.ts",
    "./src/lib/server/db/central/relations.ts",
  ],
  out: "drizzle/central",
  dialect: "sqlite",
  dbCredentials: databaseUrlConfig,
  driver: "turso",
});
