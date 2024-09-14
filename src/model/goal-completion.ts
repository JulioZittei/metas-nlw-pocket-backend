class GoalCompletion {
  public readonly id?: string
  public readonly goalId: string
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  private constructor({ id, goalId, createdAt, updatedAt }: GoalCompletion) {
    this.id = id
    this.goalId = goalId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    Object.freeze(this)
  }

  public static create({
    id,
    goalId,
    createdAt,
    updatedAt,
  }: GoalCompletion): GoalCompletion {
    return new GoalCompletion({ id, goalId, createdAt, updatedAt })
  }
}

export { GoalCompletion }
