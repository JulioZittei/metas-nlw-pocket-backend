import type { GoalCompletion } from '@src/model/goal-completion'
import type { Goal } from '../../model/goal'
import type { Repository } from './default-repository'
import type { PendingGoal } from '@src/model/pending-goal'
import type { GoalsWeekSummary } from '@src/model/goals-week-summary'

type GoalsRepository = Repository<
  Goal | GoalCompletion | GoalsWeekSummary | PendingGoal[]
>

export type { GoalsRepository }
