import z from 'zod'

const envSchema = z.object({
  APP_SERVER_PORT: z.string().transform(v => Number(v)),
  APP_SERVER_BASE_URL: z.string().url(),
  APP_SERVERR_LOGGER_ENABLED: z.string().transform(v => Boolean(v === 'true')),
  APP_SERVER_LOGGER_LEVEL: z.string(),
  DATABASE_URL: z.string().url(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_QUERY_DEBUG_ENABLED: z
    .string()
    .transform(v => Boolean(v === 'true')),
})

export const env = envSchema.parse(process.env)
