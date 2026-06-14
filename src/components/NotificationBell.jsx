import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Bell, X } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { isToday, parseISO, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const DISMISSED_KEY = 'todo-dismissed-notifications'

function getDismissed() {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveDismissed(set) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...set]))
}

export default function NotificationBell() {
  const { tasks } = useTasks()
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(getDismissed)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const dismiss = useCallback((key) => {
    setDismissed((prev) => {
      const next = new Set(prev)
      next.add(key)
      saveDismissed(next)
      return next
    })
  }, [])

  const notifications = useMemo(() => {
    const list = []
    const now = new Date()

    tasks.forEach((t) => {
      if (t.completed || !t.dueDate) return
      const due = parseISO(t.dueDate)
      if (isToday(due)) {
        list.push({ id: `${t.id}-today`, type: 'today', text: `"${t.title}" vence hoje`, icon: '⏰' })
      }
      if (due < now) {
        list.push({ id: `${t.id}-overdue`, type: 'overdue', text: `"${t.title}" está atrasada`, icon: '🚨' })
      }
    })

    return list.filter((n) => !dismissed.has(n.id)).slice(0, 5)
  }, [tasks, dismissed])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-72 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg py-2 z-50">
          <p className="px-4 py-1.5 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
            Notificações
          </p>
          {notifications.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400 dark:text-gray-500">Nenhuma notificação</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-700 text-sm text-slate-600 dark:text-gray-400 flex items-start gap-2 group/item">
                  <span>{n.icon}</span>
                  <span className="flex-1">{n.text}</span>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="p-0.5 rounded text-slate-300 dark:text-gray-600 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 opacity-0 group-hover/item:opacity-100 transition-all"
                    title="Dispensar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
