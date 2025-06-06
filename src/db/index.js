// db/index.js
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // We'll create this next

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });