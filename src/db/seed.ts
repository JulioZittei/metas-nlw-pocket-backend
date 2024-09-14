import dayjs from 'dayjs'
import { client, db } from '@src/db'
import { goalCompletions, goals } from '@src/db/schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const createdGoals = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Exercitar-se', desiredWeeklyFrequency: 3 },
      { title: 'Meditar', desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    {
      goalId: createdGoals[0].id,
      createdAt: startOfWeek.toDate(),
      updatedAt: startOfWeek.toDate(),
    },
    {
      goalId: createdGoals[1].id,
      createdAt: startOfWeek.add(1, 'day').toDate(),
      updatedAt: startOfWeek.add(1, 'day').toDate(),
    },
  ])
}

seed().finally(() => client.end())
