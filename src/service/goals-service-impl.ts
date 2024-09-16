import { Service, Inject } from '@fastify-decorators/simple-di'
import { GoalsRepositoryImpl } from '@src/adapter/repository/goals-repository-impl'
import type { CreateGoalCompletionRequest } from '@src/controller/request/create-goal-completion-request'
import type { CreateGoalRequest } from '@src/controller/request/create-goal-request'
import type { CreateGoalCompletionResponse } from '@src/controller/response/create-goal-completion-response'
import type { CreateGoalResponse } from '@src/controller/response/create-goal-response'
import type { GoalsWeekSummaryResponse } from '@src/controller/response/goal-week-summary-response'
import type { PendingGoalsResponse } from '@src/controller/response/pending-goals-response'
import { GoalCompletionMapper } from '@src/mapper/goal-completion-mapper'
import { GoalMapper } from '@src/mapper/goal-mapper'
import { GoalWeekSummaryMapper } from '@src/mapper/goal-week-summary'
import { PendingGoalMapper } from '@src/mapper/pending-goal-mapper'
import type { Goal } from '@src/model/goal'
import type { GoalCompletion } from '@src/model/goal-completion'
import type { GoalsWeekSummary } from '@src/model/goals-week-summary'
import type { PendingGoal } from '@src/model/pending-goal'
import type { GoalsRepository } from '@src/repository/ports/goals-repository'
import type { GoalService } from '@src/service/ports/goals-service'

@Service()
class GoalServiceImpl implements GoalService {
  @Inject(GoalsRepositoryImpl)
  private readonly repository!: GoalsRepository

  @Inject(GoalMapper)
  private readonly goalMapper!: GoalMapper

  @Inject(PendingGoalMapper)
  private readonly pendingGoalMapper!: PendingGoalMapper

  @Inject(GoalCompletionMapper)
  private readonly goalCompletionMapper!: GoalCompletionMapper

  @Inject(GoalWeekSummaryMapper)
  private readonly goalWeekSummaryMapper!: GoalWeekSummaryMapper

  public async getWeekSummary(): Promise<GoalsWeekSummaryResponse> {
    const weekSummary = await this.repository.getWeekSummary()
    return this.goalWeekSummaryMapper.toResponse(
      weekSummary as GoalsWeekSummary
    )
  }

  public async createGoalCompletion(
    request: CreateGoalCompletionRequest
  ): Promise<CreateGoalCompletionResponse> {
    const goalCompletion = this.goalCompletionMapper.toModel(request)
    const savedGoalCompletion =
      await this.repository.createGoalCompletion(goalCompletion)
    return this.goalCompletionMapper.toResponse(
      savedGoalCompletion as GoalCompletion
    )
  }

  public async getWeekPendingGoals(): Promise<PendingGoalsResponse[]> {
    const pendingGoals =
      (await this.repository.getWeekPendingGoals()) as PendingGoal[]
    return pendingGoals.map(pg => this.pendingGoalMapper.toResponse(pg))
  }

  public async createGoal(
    request: CreateGoalRequest
  ): Promise<CreateGoalResponse> {
    const goal = this.goalMapper.toModel(request)
    const savedGoal = await this.repository.createGoal(goal)
    return this.goalMapper.toResponse(savedGoal as Goal)
  }
}
export { GoalServiceImpl }
