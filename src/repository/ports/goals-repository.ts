import type { GoalCompletion } from '@src/model/goal-completion'
import type { Goal } from '../../model/goal'
import type { Repository } from './default-repository'
import type { PendingGoal } from '@src/model/pending-goal'

type GoalsRepository = Repository<Goal | GoalCompletion | PendingGoal[]>

export type { GoalsRepository }
