import { z } from 'zod'

export type CreateGoalRequest = {
  title: string
  desired_weekly_frequency: number
}

export const createGoalSchema = z.object({
  title: z.string().min(5),
  desired_weekly_frequency: z.number().int().min(1).max(7),
})
