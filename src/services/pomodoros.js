import { supabase } from './supabaseClient'

const TABLE = 'pomodoros'

export async function saveSession({ userId, taskId, duration, type }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      task_id: taskId || null,
      duration,
      type,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to save pomodoro session:', error)
    return null
  }
  return data
}

export async function getTodayStats(userId) {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from(TABLE)
    .select('duration')
    .eq('user_id', userId)
    .eq('type', 'focus')
    .gte('completed_at', today)

  if (error) {
    console.error('Failed to get today stats:', error)
    return { count: 0, totalFocusSeconds: 0 }
  }

  return {
    count: data.length,
    totalFocusSeconds: data.reduce((sum, s) => sum + s.duration, 0),
  }
}

export async function getWeekStats(userId) {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoStr = weekAgo.toISOString()

  const { data, error } = await supabase
    .from(TABLE)
    .select('duration, completed_at')
    .eq('user_id', userId)
    .eq('type', 'focus')
    .gte('completed_at', weekAgoStr)

  if (error) {
    console.error('Failed to get week stats:', error)
    return []
  }

  const byDay = {}
  for (const s of data) {
    const day = s.completed_at.slice(0, 10)
    byDay[day] = (byDay[day] || 0) + 1
  }

  return Object.entries(byDay).map(([date, count]) => ({ date, count }))
}
