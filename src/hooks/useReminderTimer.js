import { useEffect, useRef } from 'react'
import { useTasks } from '../context/TaskContext'
import { playBeep } from '../context/PomodoroContext'

const FIRED_KEY = 'todo-reminder-fired'

function getFired() {
  try {
    const raw = localStorage.getItem(FIRED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveFired(set) {
  localStorage.setItem(FIRED_KEY, JSON.stringify([...set]))
}

export default function useReminderTimer() {
  const { tasks } = useTasks()
  const intervalRef = useRef(null)

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    function check() {
      const now = new Date()
      const currentMinute = now.getTime()

      const reminderTasks = tasks.filter(
        (t) => t.remindMe && !t.completed && t.dueDate && t.dueTime
      )

      if (reminderTasks.length === 0) return

      const fired = getFired()

      reminderTasks.forEach((t) => {
        const [h, m] = t.dueTime.split(':')
        const due = new Date(t.dueDate + 'T' + t.dueTime)
        const diff = Math.abs(now.getTime() - due.getTime())

        if (diff < 60000) {
          const key = t.id
          if (fired.has(key)) return

          fired.add(key)
          saveFired(fired)

          playBeep()

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🔔 Lembrete de tarefa', {
              body: `"${t.title}" — hora de começar!`,
              tag: key,
            })
          }
        }
      })
    }

    intervalRef.current = setInterval(check, 30000)
    check()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [tasks])
}
