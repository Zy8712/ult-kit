// src/db/schema.js (or db/schema.js if not using src folder)
import { pgTable, serial, text, varchar, timestamp, boolean, integer, primaryKey, foreignKey, numeric, jsonb } from 'drizzle-orm/pg-core';

// --- User-related tables (as defined before) ---
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const signInTokens = pgTable('sign_in_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- Tool Table - Revised ---
export const tools = pgTable('tools', {
  // Database structure not available in public preview.
  // Code for database seeding only available in private ver.
  // This is for security purposes.
  // Contact me if you'd like further details.
});


// --- Likes, Lists, ListItems (as defined before, ensure toolId matches type) ---
export const likes = pgTable('likes', {
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  toolId: varchar('tool_id', { length: 255 }).notNull().references(() => tools.id, { onDelete: 'cascade' }), // References new tools table
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.toolId] }),
  };
});

export const lists = pgTable('lists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const listItems = pgTable('list_items', {
  listId: integer('list_id').notNull().references(() => lists.id, { onDelete: 'cascade' }),
  toolId: varchar('tool_id', { length: 255 }).notNull().references(() => tools.id, { onDelete: 'cascade' }), // References new tools table
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.listId, table.toolId] }),
  };
});