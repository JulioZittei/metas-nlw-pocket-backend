import logger from '@src/logger'
import { SetupServer } from '@src/server'
import { env } from '@src/env'

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `🕚 App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  )
  throw reason
})

process.on('uncaughtException', error => {
  logger.error(`🕚 App exiting due to an uncaught exception: ${error}`)
  process.exit(ExitStatus.Failure)
})
;(async (): Promise<void> => {
  try {
    const server = new SetupServer(env.APP_SERVER_PORT, env.APP_SERVER_BASE_URL)
    await server.init()
    await server.start()

    const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT']

    for (const exitSignal of exitSignals) {
      process.on(exitSignal, async () => {
        try {
          await server.close()
          logger.info('✅ App exited with success')
          process.exit(ExitStatus.Success)
        } catch (error) {
          logger.error(`🚫 App exited with error: ${error}`)
          process.exit(ExitStatus.Failure)
        }
      })
    }
  } catch (error) {
    logger.error(`🚫 App exited with error: ${error}`)
    process.exit(ExitStatus.Failure)
  }
})()
