import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull(),
  consentAt: text('consent_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  source: text('source').notNull().default('landing'),
}, (table) => [uniqueIndex('subscribers_email_unique').on(table.email)]);

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
});
