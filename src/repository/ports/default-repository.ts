interface Repository<T> {
  createGoal(input: T): Promise<T>
  getWeekPendingGoals(): Promise<T>
  createGoalCompletion(input: T): Promise<T>
  getWeekSummary(): Promise<T>
}

export type { Repository }
