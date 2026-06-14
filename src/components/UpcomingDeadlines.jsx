import { useMemo } from 'react'
import { format, parseISO, isFuture, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, AlertCircle } from 'lucide-react'
import { CATEGORY_MAP } from '../utils/constants'
import { formatDateTime } from '../utils/helpers'

export default function UpcomingDeadlines({ tasks }) {
  const deadlines = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6)
  }, [tasks])

  if (deadlines.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
          Próximos vencimentos
        </h3>
      </div>
      <div className="space-y-2">
        {deadlines.map((task) => {
          const date = parseISO(task.dueDate)
          const cat = CATEGORY_MAP[task.category]
          const dueToday = isToday(date)
          const future = isFuture(date) && !dueToday

          return (
            <div key={task.id} className="flex items-center gap-3 text-sm py-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat?.color || '#94A3B8' }}
              />
              <span className="flex-1 text-slate-700 dark:text-gray-300 truncate">{task.title}</span>
              <span className={`flex items-center gap-1 text-xs whitespace-nowrap ${
                dueToday ? 'text-amber-600 font-medium' : 'text-slate-400 dark:text-gray-500'
              }`}>
                <Calendar className="w-3 h-3" />
                {dueToday ? 'Hoje' : formatDateTime(task.dueDate, task.dueTime)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
