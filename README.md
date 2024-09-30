# Multi-Tenant SvelteKit Web App

This project is a SaaS web application built with SvelteKit, showcasing a multi-tenancy implementation using Turso for database management and Cloudflare for hosting and domain management.

Demo : [https://miloudi-mutli-tenancy.software/](https://miloudi-mutli-tenancy.software/)

## Features

- Multi-tenancy with one database per tenant
- Subdomain per tenant
- Custom tenant domain with auto SSL using Cloudflare for SaaS
- Tenants can download their entire database dump.
- Deployed on Cloudflare Workers

## Prerequisites

Before you begin, ensure you have the following:

- Node.js and pnpm installed.
- Turso CLI installed. [Docs](https://docs.turso.tech/cli/installation).
- An apex domain connected to Cloudflare.

## Environment Variables

For development copy `.env.example` to `.env`, For build and production, export the environment variables to the build environment. If that's Cloudflare Workers, add them to build environment.

```
TURSO_PLATFORM_AUTH_TOKEN=
TURSO_GROUP_AUTH_TOKEN=
TURSO_CENTRAL_DATABASE_URL=libsql://<db-name>-<org-name>.turso.io
TURSO_SCHEMA_DATABASE_NAME=
TURSO_ORGANIZATION_NAME=
TURSO_GROUP_NAME=default
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_TOKEN=
PUBLIC_DOMAIN=localhost:5173
```

### How to obtain the environment variables:

1. `TURSO_PLATFORM_AUTH_TOKEN`: Run `turso auth api-tokens mint <api-token-name>`. This token allows you to create new databases for tenants.
2. `TURSO_GROUP_AUTH_TOKEN`: Run `turso group tokens create`. This token allows you to access all the databases in `TURSO_GROUP_NAME`.
3. `TURSO_CENTRAL_DATABASE_URL`: Create a central database in Turso and use the provided URL, Command `turso db create <db-name>`. This database manages all the tenants including their domains and subdomains. This is where you would track usage for subscription and allow/disallow/limit features if this were a SaaS.
4. `TURSO_SCHEMA_DATABASE_NAME`: Create a database with the schema flag in Turso, Command : `turso db create <db-name> --type schema`.This database will not have any rows, but it's used to synchronize the tenants db. [docs](https://docs.turso.tech/features/multi-db-schemas)
5. `TURSO_ORGANIZATION_NAME`: Run `turso org list` and use the slug of your organization.
6. `TURSO_GROUP_NAME`: Default is "default".
7. `CLOUDFLARE_ZONE_ID`: After having added your domain to cloudflare. Go to Cloudflare Dashboard -> Websites -> (your domain) -> you can find the Zone ID in the right sidebar.
8. `CLOUDFLARE_TOKEN`: Generate a token with access to your zone with permission `SSL and Certificates:Edit`. This is used to manage custom tenant domains.
9. `PUBLIC_DOMAIN`: Use `localhost:5173` for local development, change to your domain in production. Note: If you don't put the right _PUBLIC_DOMAIN_ you won't be able to access your app normally because the right domain will be treated as a custom tenant domain which probably does not exist.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ricin9/sveltekit-multi-tenancy
   ```

2. Navigate to the project directory:

   ```bash
   cd sveltekit-multi-tenancy
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up your environment variables as described above.

5. Migrate your central and schema databases

   ```bash
   pnpm db:central migrate
   pnpm db:tenant migrate
   ```

6. Run the development server:

   ```bash
   pnpm run dev
   ```

## Deployment to Cloudflare Workers

To deploy your SvelteKit app to Cloudflare Workers, follow these steps:

1. Create a Cloudflare Workers project:

   - Log in to your Cloudflare dashboard
   - Navigate to "Workers & Pages"
   - Click "Create application" and follow the prompts to set up your project

2. Add environment variables to build environment:

   - In your Cloudflare Workers project settings, go to the "Settings" tab
   - Scroll down to "Environment Variables"
   - Add all the environment variables from your `.env` file
   - Note: Do not add environment variables to production or preview environment, instead add them to Build environment. This step is crucial because we're using Sveltekit static env which embeds envars as strings directly in build step.

3. Modify Worker routes:
   Assuming your domain is `example.com`, add the following routes:

   - `example.com`
   - `*.example.com`
   - `*/*` (This route is for custom domains added through Cloudflare for SaaS)

   To add these routes:

   - Go to your Cloudflare dashboard -> Workers -> Your Worker -> Settings -> Domains & Routes
   - For the first two domains select _Custom Domain_, for `*/*` select _Routes_, for the zone select your `PUBLIC_DOMAIN`.

4. Enable Custom Hostname SSL:

   - In your Cloudflare site's SSL/TLS settings, go to the "Custom Hostnames" tab
   - Ensure that "Cloudflare For SaaS" is enabled. [Docs](https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/start/enable/)

5. Deploy your application:

   1. Manual Deployment.

   - Run `wrangler deploy`.

   2. Automatic Deployment.

   - If you're using Worker Git integration (added very recently as of writing of this readme), just push to your remote git repo and it will be pulled down and built automatically.

Remember to update your `PUBLIC_DOMAIN` environment variable to your production domain when deploying.

## Why Cloudflare Workers and not Pages

As of the date of writing this readme, there is no way to add wildcard subdomain to pages `*.example.com`, and you cannot add `*/*` route so that custom tenant domains are routes automatically to your worker.

You can use Cloudflare Pages, but you would have to add each created subdomain and custom tenant domain either manually or by using the Cloudflare API. I prefer automatically for this demo this is why I used Cloudflare Workers instead.

## Why is an apex domain required

It is not required unless you do not have the _Entreprise plan_. Because of you were to set `PUBLIC_DOMAIN` to `sub.example.com`, Cloudflare will not install SSL Certificates for 3rd layer `*.sub.example.com` unless you are on `Entreprise Plan`. So it's just easier using an apex domain.

## Can this be deployed anywhere besides Cloudflare

Yes you can deploy this anywhere, Cloudflare for SaaS would still work, but you will have to configure your proxy to route the wildcard subdomain of your apex, and the custom tenant domains to your application. You can therefore skip all steps of `Deployment to Cloudflare Workers` except for the activation of `Cloudflare For SaaS` step.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
