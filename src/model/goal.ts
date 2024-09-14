class Goal {
  public readonly id?: string
  public readonly title: string
  public readonly desiredWeeklyFrequency: number
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  private constructor({
    id,
    title,
    desiredWeeklyFrequency,
    createdAt,
    updatedAt,
  }: Goal) {
    this.id = id
    this.title = title
    this.desiredWeeklyFrequency = desiredWeeklyFrequency
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    Object.freeze(this)
  }

  public static create({
    id,
    title,
    desiredWeeklyFrequency,
    createdAt,
    updatedAt,
  }: Goal): Goal {
    return new Goal({
      id,
      title,
      desiredWeeklyFrequency,
      createdAt,
      updatedAt,
    })
  }
}

export { Goal }
