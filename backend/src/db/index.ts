import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config.js';
import * as schema from './schema.js';

// PostgreSQL ulanishi (postgres.js driver)
const client = postgres(config.databaseUrl);

// Drizzle ORM instance
export const db = drizzle(client, { schema });

console.log('✅ PostgreSQL connected');
