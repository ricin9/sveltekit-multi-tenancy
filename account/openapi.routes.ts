import { createRoute, z } from "@hono/zod-openapi";
import { ZodBadRequestOpenApi } from "../../../../lib/util/zodhttperrorschema";
import { createCompanySchema, loginUserSchema } from "./schema";

const tags = ["Account"];

export const login = createRoute({
  method: "post",
  path: "/login",
  tags,
  summary: "Login to user account",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Successful response",
    },
    400: ZodBadRequestOpenApi,
  },
});

export const logout = createRoute({
  method: "post",
  path: "/logout",
  tags,
  summary: "Logout from user account",

  responses: {
    201: {
      description: "Successful response",
    },
  },
});

export const create = createRoute({
  method: "post",
  path: "/",
  tags,
  summary: "Create a new company",
  description:
    "Creates a new company, with its admin account and a new database",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createCompanySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Successful response",
      content: {
        "application/json": {
          schema: createCompanySchema
            .omit({ password: true })
            .merge(z.object({ companyId: z.number(), userId: z.number() })),
        },
      },
    },
    400: ZodBadRequestOpenApi,
    409: {
      description: "When entered company subdomain already exists",
    },
  },
});
