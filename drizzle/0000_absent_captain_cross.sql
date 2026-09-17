CREATE TABLE `subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`consent_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`source` text DEFAULT 'landing' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `suggestions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`official_url` text NOT NULL,
	`country` text NOT NULL,
	`kind` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`reply_email` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
