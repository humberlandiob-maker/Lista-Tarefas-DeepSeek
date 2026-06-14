import { format, parseISO, isPast, isToday, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

let counter = 0

export function generateId() {
  counter++
  return `${Date.now()}-${counter}`
}

export function formatDate(dateString) {
  if (!dateString) return null
  try {
    const date = parseISO(dateString)
    return format(date, "d 'de' MMM", { locale: ptBR })
  } catch {
    return null
  }
}

export function formatDateFull(dateString) {
  if (!dateString) return null
  try {
    const date = parseISO(dateString)
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return null
  }
}

export function formatDateTime(dateString, timeString) {
  if (!dateString) return null
  try {
    const date = parseISO(dateString)
    const formatted = format(date, "d 'de' MMM", { locale: ptBR })
    if (timeString) {
      return `${formatted} às ${timeString.slice(0, 5)}`
    }
    return formatted
  } catch {
    return null
  }
}

export function formatDateTimeFull(dateString, timeString) {
  if (!dateString) return null
  try {
    const date = parseISO(dateString)
    const formatted = format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    if (timeString) {
      return `${formatted} às ${timeString.slice(0, 5)}`
    }
    return formatted
  } catch {
    return null
  }
}

export function isOverdue(dateString, timeString) {
  if (!dateString) return false
  try {
    const date = parseISO(dateString)
    if (timeString) {
      const [h, m] = timeString.split(':')
      date.setHours(Number(h), Number(m), 0, 0)
      return date < new Date()
    }
    return isPast(date) && !isToday(date)
  } catch {
    return false
  }
}

export function isDueToday(dateString, timeString) {
  if (!dateString) return false
  try {
    const date = parseISO(dateString)
    if (!isToday(date)) return false
    if (!timeString) return true
    const [h, m] = timeString.split(':')
    date.setHours(Number(h), Number(m), 0, 0)
    return date.getTime() <= Date.now()
  } catch {
    return false
  }
}

export function getNextRecurringDate(currentDueDate, rule) {
  if (!currentDueDate || !rule) return null
  const date = parseISO(currentDueDate)
  switch (rule) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      break
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
    default:
      return null
  }
  return format(date, 'yyyy-MM-dd')
}
