type GoalsPerDay = Record<
  string,
  {
    id: string
    title: string
    completedAt: string
  }[]
>

class GoalsWeekSummary {
  public readonly completed: number
  public readonly total: number
  public readonly goalsPerDay: GoalsPerDay

  private constructor({ completed, total, goalsPerDay }: GoalsWeekSummary) {
    this.completed = completed
    this.total = total
    this.goalsPerDay = goalsPerDay
    Object.freeze(this)
  }

  public static create({
    completed,
    total,
    goalsPerDay,
  }: GoalsWeekSummary): GoalsWeekSummary {
    return new GoalsWeekSummary({
      completed,
      total,
      goalsPerDay,
    })
  }
}

export { GoalsWeekSummary, type GoalsPerDay }
