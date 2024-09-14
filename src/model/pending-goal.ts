class PendingGoal {
  public readonly id?: string
  public readonly title: string
  public readonly desiredWeeklyFrequency: number
  public readonly completionCount: number

  private constructor({
    id,
    title,
    desiredWeeklyFrequency,
    completionCount,
  }: PendingGoal) {
    this.id = id
    this.title = title
    this.desiredWeeklyFrequency = desiredWeeklyFrequency
    this.completionCount = completionCount
    Object.freeze(this)
  }

  public static create({
    id,
    title,
    desiredWeeklyFrequency,
    completionCount,
  }: PendingGoal): PendingGoal {
    return new PendingGoal({
      id,
      title,
      desiredWeeklyFrequency,
      completionCount,
    })
  }
}

export { PendingGoal }
