import type { CreateGoalCompletionRequest } from '@src/controller/request/create-goal-completion-request'
import type { CreateGoalCompletionResponse } from '@src/controller/response/create-goal-completion-response'
import type {
  GoalsPerDayResponse,
  GoalsWeekSummaryResponse,
} from '@src/controller/response/goal-week-summary-response'
import { GoalCompletion } from '@src/model/goal-completion'
import type { GoalsWeekSummary } from '@src/model/goals-week-summary'
import { Component } from '@src/shared/decorators/component.decorator'

@Component('GoalWeekSummaryMapper')
class GoalWeekSummaryMapper {
  toResponse(model: GoalsWeekSummary): GoalsWeekSummaryResponse {
    const goalsPerDayResponse: GoalsPerDayResponse = {}

    for (const day in model.goalsPerDay) {
      goalsPerDayResponse[day] = model.goalsPerDay[day].map(goal => ({
        id: goal.id,
        title: goal.title,
        completed_at: goal.completedAt,
      }))
    }

    return {
      completed: model.completed,
      total: model.total,
      goals_per_day: goalsPerDayResponse,
    }
  }
}

export { GoalWeekSummaryMapper }
