CREATE TABLE `custom_domains` (
	`custom_domain_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`custom_domain` text NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`cloudflare_hostname_id` text,
	`tenant_id` integer NOT NULL,
	`created_at` text DEFAULT current_timestamp NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`tenant_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`subdomain` text NOT NULL,
	`database_name` text NOT NULL,
	`created_at` text DEFAULT current_timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `custom_domains_custom_domain_unique` ON `custom_domains` (`custom_domain`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_subdomain_unique` ON `tenants` (`subdomain`);--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_database_name_unique` ON `tenants` (`database_name`);