const STREAK_KEY = 'todo-gamification'

function getData() {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    return raw ? JSON.parse(raw) : { streak: 0, lastLogin: null, totalPomodoros: 0 }
  } catch {
    return { streak: 0, lastLogin: null, totalPomodoros: 0 }
  }
}

function saveData(data) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

export function checkStreak() {
  const data = getData()
  const today = new Date().toISOString().slice(0, 10)

  if (data.lastLogin === today) {
    return data.streak
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  let newStreak
  if (data.lastLogin === yesterdayStr) {
    newStreak = data.streak + 1
  } else {
    newStreak = 1
  }

  saveData({ streak: newStreak, lastLogin: today })
  return newStreak
}

export function incrementPomodoros() {
  const data = getData()
  saveData({ ...data, totalPomodoros: data.totalPomodoros + 1 })
}

export function getAchievements(tasks, habits = []) {
  const totalCompleted = tasks.filter((t) => t.completed).length
  const data = getData()

  const achievements = []

  const maxHabitStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.todayStreak || 0)) : 0

  if (maxHabitStreak >= 30) {
    achievements.push({ id: 'habit-30', label: '30 dias de hábito', earned: true, icon: '📅' })
  } else {
    achievements.push({ id: 'habit-30', label: '30 dias de hábito', earned: false, icon: '📅', progress: maxHabitStreak, max: 30 })
  }

  if (maxHabitStreak >= 7) {
    achievements.push({ id: 'habit-7', label: '1 semana de hábito', earned: true, icon: '📅' })
  } else {
    achievements.push({ id: 'habit-7', label: '1 semana de hábito', earned: false, icon: '📅', progress: maxHabitStreak, max: 7 })
  }

  const allDoneToday = habits.length > 0 && habits.every((h) => h.todayCount > 0)
  if (allDoneToday) {
    achievements.push({ id: 'habit-all-today', label: 'Todos os hábitos hoje', earned: true, icon: '✅' })
  } else {
    achievements.push({ id: 'habit-all-today', label: 'Todos os hábitos hoje', earned: false, icon: '✅' })
  }

  if (data.totalPomodoros >= 100) {
    achievements.push({ id: 'pomo-100', label: '100 Pomodoros concluídos', earned: true, icon: '🍅' })
  } else {
    achievements.push({ id: 'pomo-100', label: '100 Pomodoros concluídos', earned: false, icon: '🍅', progress: data.totalPomodoros, max: 100 })
  }

  if (totalCompleted >= 100) {
    achievements.push({ id: '100-done', label: '100 tarefas concluídas', earned: true, icon: '🏆' })
  } else {
    achievements.push({ id: '100-done', label: '100 tarefas concluídas', earned: false, icon: '🏆', progress: totalCompleted, max: 100 })
  }

  if (data.streak >= 30) {
    achievements.push({ id: '30-streak', label: '30 dias de uso', earned: true, icon: '🔥' })
  } else {
    achievements.push({ id: '30-streak', label: '30 dias de uso', earned: false, icon: '🔥', progress: data.streak, max: 30 })
  }

  const hasNoOverdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10)).length === 0
  if (hasNoOverdue && totalCompleted > 0) {
    achievements.push({ id: 'no-overdue', label: 'Semana sem atrasos', earned: true, icon: '✅' })
  } else {
    achievements.push({ id: 'no-overdue', label: 'Semana sem atrasos', earned: false, icon: '✅' })
  }

  return achievements
}

export function getProductivity(tasks) {
  if (tasks.length === 0) return 0
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
}
