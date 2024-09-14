import { z } from 'zod'

export type CreateGoalCompletionRequest = {
  goal_id: string
}

export const createGoalCompletionSchema = z.object({
  goal_id: z.string().min(5),
})
