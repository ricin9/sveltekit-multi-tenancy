import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import {
  TURSO_CENTRAL_DATABASE_URL,
  TURSO_GROUP_AUTH_TOKEN,
} from "$env/static/private";
import * as centralSchema from "./schema";
import * as centralRelations from "./relations";

export const centralTSchema = { ...centralSchema, ...centralRelations };

const authToken = TURSO_GROUP_AUTH_TOKEN;
const centralDbUrl = TURSO_CENTRAL_DATABASE_URL;

const centralTursoClient = createClient({ url: centralDbUrl, authToken });
export const centralDb = drizzle(centralTursoClient, {
  schema: centralTSchema,
});
