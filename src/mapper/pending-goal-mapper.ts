import type { CreateGoalRequest } from '@src/controller/request/create-goal-request'
import type { CreateGoalResponse } from '@src/controller/response/create-goal-response'
import type { PendingGoalsResponse } from '@src/controller/response/pending-goals-response'
import { Goal } from '@src/model/goal'
import type { PendingGoal } from '@src/model/pending-goal'
import { Component } from '@src/shared/decorators/component.decorator'

@Component('PendingGoalMapper')
class PendingGoalMapper {
  toResponse(model: PendingGoal): PendingGoalsResponse {
    return {
      id: model.id as string,
      title: model.title,
      desired_weekly_frequency: model.desiredWeeklyFrequency,
      completion_count: model.completionCount,
    }
  }
}

export { PendingGoalMapper }
