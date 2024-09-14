import pino from 'pino'
import { env } from '@src/env'

const logger = pino({
  enabled: env.APP_SERVERR_LOGGER_ENABLED,
  level: env.APP_SERVER_LOGGER_LEVEL,
})

export default logger
