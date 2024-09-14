import { Inject } from '@fastify-decorators/simple-di'
import { GoalServiceImpl } from '@src/service/goals-service-impl'
import type { GoalService } from '@src/service/ports/goals-service'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { Controller, GET, POST } from 'fastify-decorators'
import {
  createGoalSchema,
  type CreateGoalRequest,
} from '@src/controller/request/create-goal-request'
import {
  type CreateGoalCompletionRequest,
  createGoalCompletionSchema,
} from './request/create-goal-completion-request'

type Request = FastifyRequest
type Response = FastifyReply

@Controller('/api/v1')
class GoalsController {
  @Inject(GoalServiceImpl)
  private readonly goalService!: GoalService

  @POST({
    url: '/goals',
    options: {
      schema: {
        body: createGoalSchema,
      },
    },
  })
  public async createGoal(req: Request, res: Response): Promise<Response> {
    const createdGoal = await this.goalService.createGoal(
      req.body as CreateGoalRequest
    )
    return res.status(201).send(createdGoal)
  }

  @POST({
    url: '/completions',
    options: {
      schema: {
        body: createGoalCompletionSchema,
      },
    },
  })
  public async createGoalCompletion(
    req: Request,
    res: Response
  ): Promise<Response> {
    const createdGoalCompletion = await this.goalService.createGoalCompletion(
      req.body as CreateGoalCompletionRequest
    )
    return res.status(201).send(createdGoalCompletion)
  }

  @GET({
    url: '/pending-goals',
  })
  public async getWeekPendingGoals(
    req: Request,
    res: Response
  ): Promise<Response> {
    const pendingGoals = await this.goalService.getWeekPendingGoals()
    return res.status(200).send(pendingGoals)
  }
}

export { GoalsController }
