import type { CreateGoalRequest } from '@src/controller/request/create-goal-request'
import type { CreateGoalResponse } from '@src/controller/response/create-goal-response'
import { Goal } from '@src/model/goal'
import { Component } from '@src/shared/decorators/component.decorator'

@Component('GoalMapper')
class GoalMapper {
  toModel(request: CreateGoalRequest): Goal {
    return Goal.create({
      desiredWeeklyFrequency: request.desired_weekly_frequency,
      ...request,
    })
  }

  toResponse(model: Goal): CreateGoalResponse {
    return {
      id: model.id as string,
      title: model.title,
      desired_weekly_frequency: model.desiredWeeklyFrequency,
      created_at: model.createdAt as Date,
      updated_at: model.updatedAt as Date,
    }
  }
}

export { GoalMapper }
