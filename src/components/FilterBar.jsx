import { useMemo, useState, useRef, useEffect } from 'react'
import { FILTERS } from '../utils/constants'
import { X, Tag } from 'lucide-react'

export default function FilterBar({ tasks, active, onChange, allTags }) {
  const [tagOpen, setTagOpen] = useState(false)
  const tagRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (tagRef.current && !tagRef.current.contains(e.target)) setTagOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const activeTagId = active?.startsWith('tag:') ? active.slice(4) : null
  const activeTag = activeTagId ? allTags?.find((t) => String(t.id) === activeTagId) : null

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
      pending: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }
  }, [tasks])

  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTERS.map(({ value, label }) => {
        const count = counters[value]
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isActive
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                isActive ? 'bg-blue-400 text-white' : 'bg-slate-200 dark:bg-gray-600 text-slate-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            )}
          </button>
        )
      })}

      {allTags?.length > 0 && (
        <div ref={tagRef} className="relative">
          <button
            onClick={() => setTagOpen(!tagOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTag
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>{activeTag ? activeTag.name : 'Tags'}</span>
            {activeTag && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange('all'); setTagOpen(false) }}
                className="ml-0.5 hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </button>

          {tagOpen && !activeTag && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg py-1 z-50 max-h-60 overflow-y-auto">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => { onChange(`tag:${tag.id}`); setTagOpen(false) }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                  <span className="flex-1">{tag.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
