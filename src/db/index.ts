import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@src/db/schema'
import { env } from '@src/env'

export const client = postgres(env.DATABASE_URL)
export const db = drizzle(client, {
  schema,
  logger: env.DATABASE_QUERY_DEBUG_ENABLED,
})
