import type { CreateGoalCompletionRequest } from '@src/controller/request/create-goal-completion-request'
import type { CreateGoalCompletionResponse } from '@src/controller/response/create-goal-completion-response'
import { GoalCompletion } from '@src/model/goal-completion'
import { Component } from '@src/shared/decorators/component.decorator'

@Component('GoalCompletionMapper')
class GoalCompletionMapper {
  toModel(request: CreateGoalCompletionRequest): GoalCompletion {
    return GoalCompletion.create({
      goalId: request.goal_id,
    })
  }

  toResponse(model: GoalCompletion): CreateGoalCompletionResponse {
    return {
      id: model.id as string,
      goal_id: model.goalId,
      created_at: model.createdAt as Date,
      updated_at: model.updatedAt as Date,
    }
  }
}

export { GoalCompletionMapper }
