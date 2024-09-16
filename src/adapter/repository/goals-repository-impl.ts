import type { GoalsRepository } from '@src/repository/ports/goals-repository'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '@src/db/schema'
import { goals, goalCompletions } from '@src/db/schema'
import type { Goal } from '@src/model/goal'
import { Repository } from '@src/shared/decorators/repository.decorator'
import { db } from '@src/db/index'
import type { GoalCompletion } from '@src/model/goal-completion'
import dayjs from 'dayjs'
import { lte, and, gte, sql, eq, count, desc } from 'drizzle-orm'
import { PendingGoal } from '@src/model/pending-goal'
import type {
  GoalsPerDay,
  GoalsWeekSummary,
} from '@src/model/goals-week-summary'
import logger from '@src/logger'

@Repository('GoalsRepository')
class GoalsRepositoryImpl implements GoalsRepository {
  constructor(private dbClient: PostgresJsDatabase<typeof schema> = db) {}

  public async getWeekSummary(): Promise<GoalsWeekSummary> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = this.dbClient
      .$with('goals_created_up_to_week')
      .as(
        this.dbClient
          .select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
          })
          .from(goals)
          .where(lte(goals.createdAt, lastDayOfWeek))
      )

    const goalsCompletedInWeek = this.dbClient
      .$with('goals_completed_in_week')
      .as(
        this.dbClient
          .select({
            id: goalCompletions.id,
            title: goals.title,
            completedAt: goalCompletions.createdAt,
            completedAtDate: sql /*sql*/`
          DATE(${goalCompletions.createdAt})
        `.as('completedAtDate'),
          })
          .from(goalCompletions)
          .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
          .where(
            and(
              gte(goalCompletions.createdAt, firstDayOfWeek),
              lte(goalCompletions.createdAt, lastDayOfWeek)
            )
          )
          .orderBy(desc(goalCompletions.createdAt))
      )

    const goalsCompletedByWeekDay = this.dbClient
      .$with('goals_completed_by_week_day')
      .as(
        this.dbClient
          .select({
            completedAtDate: goalsCompletedInWeek.completedAtDate,
            completions: sql /*sql*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as('completions'),
          })
          .from(goalsCompletedInWeek)
          .groupBy(goalsCompletedInWeek.completedAtDate)
          .orderBy(desc(goalsCompletedInWeek.completedAtDate))
      )

    const result = await this.dbClient
      .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
      .select({
        completed:
          sql /*sql*/`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
            Number
          ),
        total:
          sql /*sql*/`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
            Number
          ),
        goalsPerDay: sql /*sql*/<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `,
      })
      .from(goalsCompletedByWeekDay)
    logger.info(result[0])

    return result[0]
  }

  public async createGoalCompletion({
    goalId,
  }: GoalCompletion): Promise<GoalCompletion> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalCompletionCounts = this.dbClient
      .$with('goal_completion_counts')
      .as(
        this.dbClient
          .select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
          })
          .from(goalCompletions)
          .where(
            and(
              gte(goalCompletions.createdAt, firstDayOfWeek),
              lte(goalCompletions.createdAt, lastDayOfWeek),
              eq(goalCompletions.goalId, goalId)
            )
          )
          .groupBy(goalCompletions.goalId)
      )

    const result = await this.dbClient
      .with(goalCompletionCounts)
      .select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
      })
      .from(goals)
      .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
      .where(eq(goals.id, goalId))
      .limit(1)

    if (result.length === 0) throw new Error('Goal does not exists!')

    const { completionCount, desiredWeeklyFrequency } = result[0]

    if (completionCount >= desiredWeeklyFrequency) {
      throw new Error('Goal already completed this week!')
    }

    const insertResult = await this.dbClient
      .insert(goalCompletions)
      .values({ goalId })
      .returning()

    const goalCompletion = insertResult[0]

    return goalCompletion
  }

  public async getWeekPendingGoals(): Promise<PendingGoal[]> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = this.dbClient
      .$with('goals_created_up_to_week')
      .as(
        this.dbClient
          .select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
          })
          .from(goals)
          .where(lte(goals.createdAt, lastDayOfWeek))
      )

    const goalCompletionCounts = this.dbClient
      .$with('goal_completion_counts')
      .as(
        this.dbClient
          .select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as('completionCount'),
          })
          .from(goalCompletions)
          .where(
            and(
              gte(goalCompletions.createdAt, firstDayOfWeek),
              lte(goalCompletions.createdAt, lastDayOfWeek)
            )
          )
          .groupBy(goalCompletions.goalId)
      )

    const pendingGoals = await this.dbClient
      .with(goalsCreatedUpToWeek, goalCompletionCounts)
      .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
      })
      .from(goalsCreatedUpToWeek)
      .leftJoin(
        goalCompletionCounts,
        eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
      )

    return pendingGoals.map(pg => PendingGoal.create(pg))
  }

  public async createGoal(goal: Goal): Promise<Goal> {
    const result = await this.dbClient
      .insert(goals)
      .values({
        ...{
          title: goal.title,
          desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        },
      })
      .returning()
    return result[0]
  }
}

export { GoalsRepositoryImpl }
