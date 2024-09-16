export type GoalsPerDayResponse = Record<
  string,
  {
    id: string
    title: string
    completed_at: string
  }[]
>

export type GoalsWeekSummaryResponse = {
  completed: number
  total: number
  goals_per_day: GoalsPerDayResponse
}
