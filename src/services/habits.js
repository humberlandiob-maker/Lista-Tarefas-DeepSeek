import { supabase } from './supabaseClient'
import { startOfDay, subDays, differenceInCalendarDays } from 'date-fns'

const TABLE = 'habits'
const LOG_TABLE = 'habit_logs'

function transformHabit(data, todayLog = null) {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    frequency: data.frequency,
    daysOfWeek: data.days_of_week,
    goalPerDay: data.goal_per_day,
    color: data.color,
    position: data.position,
    createdAt: data.created_at,
    todayCount: todayLog ? todayLog.count : 0,
  }
}

export async function getHabits(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch habits:', error)
    return []
  }

  if (data.length === 0) return []

  const today = new Date().toISOString().slice(0, 10)
  const habitIds = data.map((h) => h.id)

  const { data: logs, error: logError } = await supabase
    .from(LOG_TABLE)
    .select('*')
    .in('habit_id', habitIds)
    .eq('user_id', userId)
    .eq('log_date', today)

  const logMap = {}
  if (!logError && logs) {
    for (const log of logs) {
      logMap[log.habit_id] = log
    }
  }

  return data.map((habit) => transformHabit(habit, logMap[habit.id] || null))
}

export async function createHabit(habit, userId) {
  const { data: maxData } = await supabase
    .from(TABLE)
    .select('position')
    .eq('user_id', userId)
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = maxData?.[0]?.position != null ? maxData[0].position + 1 : 0

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: habit.title,
      description: habit.description || null,
      frequency: habit.frequency || 'daily',
      days_of_week: habit.daysOfWeek || null,
      goal_per_day: habit.goalPerDay || 1,
      color: habit.color || '#3B82F6',
      position: nextPosition,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create habit:', error)
    return null
  }

  return transformHabit(data)
}

export async function updateHabit(id, updates) {
  const dbUpdates = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency
  if (updates.daysOfWeek !== undefined) dbUpdates.days_of_week = updates.daysOfWeek
  if (updates.goalPerDay !== undefined) dbUpdates.goal_per_day = updates.goalPerDay
  if (updates.color !== undefined) dbUpdates.color = updates.color
  if (updates.position !== undefined) dbUpdates.position = updates.position

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update habit:', error)
    return null
  }

  return transformHabit(data)
}

export async function deleteHabit(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete habit:', error)
    return false
  }

  return true
}

export async function logHabit(habitId, userId, date, count = 1) {
  const { data, error } = await supabase
    .from(LOG_TABLE)
    .upsert(
      { habit_id: habitId, user_id: userId, log_date: date, count },
      { onConflict: 'habit_id, user_id, log_date' }
    )
    .select()
    .single()

  if (error) {
    console.error('Failed to log habit:', error)
    return null
  }

  return data
}

export async function getHabitStreak(habitId) {
  const { data, error } = await supabase
    .from(LOG_TABLE)
    .select('log_date')
    .eq('habit_id', habitId)
    .order('log_date', { ascending: false })

  if (error || !data || data.length === 0) return 0

  let streak = 0
  const today = startOfDay(new Date())

  for (let i = 0; i < data.length; i++) {
    const expectedDate = subDays(today, i)
    const logDate = startOfDay(new Date(data[i].log_date))

    if (differenceInCalendarDays(expectedDate, logDate) === 0) {
      streak++
    } else {
      break
    }
  }

  return streak
}
