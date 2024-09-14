import type { CreateGoalCompletionRequest } from '@src/controller/request/create-goal-completion-request'
import type { CreateGoalRequest } from '@src/controller/request/create-goal-request'
import type { CreateGoalCompletionResponse } from '@src/controller/response/create-goal-completion-response'
import type { CreateGoalResponse } from '@src/controller/response/create-goal-response'
import type { PendingGoalsResponse } from '@src/controller/response/pending-goals-response'

interface GoalService {
  createGoal(request: CreateGoalRequest): Promise<CreateGoalResponse>
  createGoalCompletion(
    request: CreateGoalCompletionRequest
  ): Promise<CreateGoalCompletionResponse>
  getWeekPendingGoals(): Promise<PendingGoalsResponse[]>
}

export type { GoalService }
