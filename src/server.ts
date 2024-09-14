import '@src/config/module-alias'
import fs from 'node:fs'
import cors from '@fastify/cors'
import logger from '@src/logger'
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import type { FastifyInstance } from 'fastify'
import { bootstrap } from 'fastify-decorators'
import { GoalsController } from '@src/controller/goals-controller'
import { FastifySchemaValidationError } from 'fastify/types/schema'
import { ZodError } from 'zod'

class SetupServer {
  private server: FastifyInstance

  constructor(
    private port = 3333,
    private baseUrl = 'https://localhost'
  ) {
    this.server = Fastify({
      https: {
        key: fs.readFileSync('localhost-key.pem'),
        cert: fs.readFileSync('localhost.pem'),
      },
    }).withTypeProvider<ZodTypeProvider>()
  }

  public async init(): Promise<void> {
    logger.info('🛠️ Initializing server setup')
    this.setupFastify()
    this.setupControllers()
    this.setupErrorHandlers()
  }

  public async start(): Promise<string> {
    logger.info('🕐 Starting up server')
    const httpServer = await this.server.listen({
      port: this.port,
    })
    logger.info(`🚀 HTTP server running on ${this.baseUrl}:${this.port}`)
    return httpServer
  }

  public async close(): Promise<void> {
    logger.info('🕚 Shutting down server')
    await this.server.close()
  }

  private setupFastify(): void {
    logger.info('🔌 Setting up plugins')
    this.server.register(cors, { origin: '*' })
    this.server.decorate('logger', logger)
    this.server.setValidatorCompiler(validatorCompiler)
    this.server.setSerializerCompiler(serializerCompiler)
  }

  private setupControllers(): void {
    logger.info('🎮 Setting up controllers')

    this.server.register(bootstrap, {
      controllers: [GoalsController],
    })
  }

  private setupErrorHandlers(): void {
    logger.info('❎ Setting up error handlers')
    this.server.setErrorHandler((error, req, res) => {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          message: err.message,
          path: err.path.join(),
        }))

        return res.status(400).send({
          statusCode: 400,
          code: error.code,
          error: 'Bad Request',
          message: 'Validation failed',
          errors: formattedErrors,
        })
      }

      return res.status(500).send({
        statusCode: 500,
        code: 'FST_ERR_UNKNOW',
        error: 'Internal Server Error',
        message: error.message,
      })
    })
  }
}

export { SetupServer }
