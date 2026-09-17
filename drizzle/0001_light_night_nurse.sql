CREATE TABLE `match_profiles` (
	`deletion_hash` text PRIMARY KEY NOT NULL,
	`country_code` text NOT NULL,
	`stage` text NOT NULL,
	`business_type` text NOT NULL,
	`sector` text NOT NULL,
	`needs` text NOT NULL,
	`recommended_ids` text NOT NULL,
	`privacy_version` text NOT NULL,
	`algorithm_version` text NOT NULL,
	`consent_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `subscribers` ADD `deletion_hash` text;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `privacy_version` text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
ALTER TABLE `subscribers` ADD `status` text DEFAULT 'unverified' NOT NULL;