CREATE TABLE `daily_intake` (
	`day` text NOT NULL,
	`kind` text NOT NULL,
	`used` integer NOT NULL,
	PRIMARY KEY(`day`, `kind`)
);
--> statement-breakpoint
CREATE INDEX `match_profiles_updated_at_idx` ON `match_profiles` (`updated_at`);--> statement-breakpoint
CREATE INDEX `subscribers_deletion_hash_idx` ON `subscribers` (`deletion_hash`);--> statement-breakpoint
CREATE INDEX `subscribers_consent_at_idx` ON `subscribers` (`consent_at`);--> statement-breakpoint
CREATE INDEX `suggestions_created_at_idx` ON `suggestions` (`created_at`);