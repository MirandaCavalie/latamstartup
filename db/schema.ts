import { sql } from 'drizzle-orm';
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull(),
  consentAt: text('consent_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  source: text('source').notNull().default('landing'),
  deletionHash: text('deletion_hash'),
  privacyVersion: text('privacy_version').notNull().default('legacy'),
  status: text('status').notNull().default('unverified'),
}, (table) => [
  uniqueIndex('subscribers_email_unique').on(table.email),
  index('subscribers_deletion_hash_idx').on(table.deletionHash),
  index('subscribers_consent_at_idx').on(table.consentAt),
]);

export const suggestions = sqliteTable('suggestions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  officialUrl: text('official_url').notNull(),
  country: text('country').notNull(),
  kind: text('kind').notNull(),
  note: text('note').notNull().default(''),
  replyEmail: text('reply_email'),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  privacyVersion: text('privacy_version').notNull().default('legacy'),
}, (table) => [index('suggestions_created_at_idx').on(table.createdAt)]);

export const matchProfiles = sqliteTable('match_profiles', {
  deletionHash: text('deletion_hash').primaryKey(),
  countryCode: text('country_code').notNull(),
  stage: text('stage').notNull(),
  businessType: text('business_type').notNull(),
  sector: text('sector').notNull(),
  needs: text('needs').notNull(),
  recommendedIds: text('recommended_ids').notNull(),
  privacyVersion: text('privacy_version').notNull(),
  algorithmVersion: text('algorithm_version').notNull(),
  consentAt: text('consent_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index('match_profiles_updated_at_idx').on(table.updatedAt)]);

// Only aggregate daily counters. No IPs, emails or device identifiers.
export const dailyIntake = sqliteTable('daily_intake', {
  day: text('day').notNull(),
  kind: text('kind').notNull(),
  used: integer('used').notNull(),
}, (table) => [primaryKey({ columns: [table.day, table.kind] })]);
