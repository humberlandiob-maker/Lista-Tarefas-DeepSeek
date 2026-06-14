import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

const DAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

export default function WeekCalendar({ tasks }) {
  const navigate = useNavigate()
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [])

  const counts = useMemo(() => {
    return weekDays.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const count = tasks.filter((t) => t.dueDate && t.dueDate === dateStr).length
      return { day, dateStr, count }
    })
  }, [tasks, weekDays])

  const today = new Date()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4">
      <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Calendário da semana
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {counts.map(({ day, count }) => {
          const isToday = isSameDay(day, today)
          return (
            <button
            key={format(day, 'yyyy-MM-dd')}
            onClick={() => navigate(`/tarefas?filter=day&date=${format(day, 'yyyy-MM-dd')}`)}
            className="text-center hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
          >
            <span className={`text-[10px] font-medium ${isToday ? 'text-blue-600' : 'text-slate-400 dark:text-gray-500'}`}>
              {DAYS[day.getDay()]}
            </span>
            <div
              className={`mt-1 w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm font-semibold ${
                isToday
                  ? 'bg-blue-500 text-white'
                  : count > 0
                  ? 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                  : 'text-slate-300 dark:text-gray-600'
              }`}
            >
              {format(day, 'd')}
            </div>
            {count > 0 && (
              <span className="text-[9px] text-slate-400 dark:text-gray-500 mt-0.5 block">
                {count} {count === 1 ? 'tarefa' : 'tarefas'}
              </span>
            )}
          </button>
          )
        })}
      </div>
    </div>
  )
}
