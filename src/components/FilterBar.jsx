import { useMemo, useState, useRef, useEffect } from 'react'
import { FILTERS } from '../utils/constants'
import {
  ListTodo, Calendar, CalendarDays, AlertTriangle, Bell,
  AlertCircle, CalendarX, Clock, CheckCircle2, ChevronDown,
  Tag, X,
} from 'lucide-react'

const FILTER_ICONS = {
  all: ListTodo,
  today: Calendar,
  week: CalendarDays,
  urgent: AlertTriangle,
  reminders: Bell,
  overdue: AlertCircle,
  'no-date': CalendarX,
  pending: Clock,
  completed: CheckCircle2,
}

const FILTER_LABELS = Object.fromEntries(FILTERS.map((f) => [f.value, f.label]))

export default function FilterBar({ tasks, active, onChange, allTags }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const activeTagId = active?.startsWith('tag:') ? active.slice(4) : null
  const activeTag = activeTagId ? allTags?.find((t) => String(t.id) === activeTagId) : null

  const activeLabel = activeTag ? activeTag.name : (FILTER_LABELS[active] || 'Todas')
  const ActiveIcon = activeTag ? Tag : (FILTER_ICONS[active] || ListTodo)

  const counters = useMemo(() => {
    if (!tasks) return {}
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)
    const weekEnd = new Date(now)
    weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()))

    return {
      all: tasks.length,
      today: tasks.filter((t) => t.dueDate && t.dueDate === todayStr).length,
      week: tasks.filter((t) => {
        if (!t.dueDate) return false
        return t.dueDate >= todayStr && t.dueDate <= weekEnd.toISOString().slice(0, 10)
      }).length,
      urgent: tasks.filter((t) => {
        if (t.completed) return false
        return t.priority === 'alta'
      }).length,
      reminders: tasks.filter((t) => t.remindMe && !t.completed).length,
      overdue: tasks.filter((t) => {
        if (t.completed || !t.dueDate) return false
        return t.dueDate < todayStr
      }).length,
      'no-date': tasks.filter((t) => !t.dueDate).length,
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }
  }, [tasks])

  const activeCount = activeTag ? null : counters[active] ?? tasks.length

  function select(value) {
    onChange(value)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
      >
        <ActiveIcon className="w-4 h-4" />
        <span>{activeLabel}</span>
        {activeCount !== null && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            {activeCount}
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 ml-auto" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg py-1 z-50 max-h-80 overflow-y-auto">
          {FILTERS.map(({ value, label }) => {
            const Icon = FILTER_ICONS[value]
            const count = counters[value]
            const isActive = active === value && !activeTag
            return (
              <button
                key={value}
                onClick={() => select(value)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}

          {allTags?.length > 0 && (
            <>
              <div className="mx-3 my-1 border-t border-slate-100 dark:border-gray-700" />
              {allTags.map((tag) => {
                const isActive = activeTagId === String(tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => select(isActive ? 'all' : `tag:${tag.id}`)}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                    <span className="flex-1">{tag.name}</span>
                    {isActive && <X className="w-3.5 h-3.5" />}
                  </button>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}
