import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { CATEGORY_MAP } from '../utils/constants'
import { formatDateFull } from '../utils/helpers'

export default function CalendarioPage() {
  const { tasks } = useTasks()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const tasksByDate = useMemo(() => {
    const map = {}
    tasks.forEach((task) => {
      if (!task.dueDate) return
      const key = format(parseISO(task.dueDate), 'yyyy-MM-dd')
      if (!map[key]) map[key] = []
      map[key].push(task)
    })
    return map
  }, [tasks])

  const selectedTasks = tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const result = []
    let day = startDate
    while (day <= endDate) {
      result.push(day)
      day = addDays(day, 1)
    }
    return result
  }, [currentMonth])

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-gray-100 mb-6">Calendário</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-gray-400" />
          </button>
          <h2 className="text-base font-semibold text-slate-700 dark:text-gray-200 capitalize">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-slate-400 dark:text-gray-500 py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const dayTasks = tasksByDate[key] || []
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(day)}
                className={`relative p-2 text-sm transition-colors min-h-[2.5rem] ${
                  !isCurrentMonth
                    ? 'text-slate-300 dark:text-gray-600'
                    : isSelected
                    ? 'bg-blue-500 text-white rounded-full'
                    : isToday
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                }`}
              >
                <span>{format(day, 'd')}</span>
                {dayTasks.length > 0 && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-blue-400'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Tarefas para {formatDateFull(format(selectedDate, 'yyyy-MM-dd'))}
        </h3>
        {selectedTasks.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-gray-500">Nenhuma tarefa para este dia.</p>
        ) : (
          <div className="space-y-2">
            {selectedTasks.map((task) => {
              const cat = CATEGORY_MAP[task.category]
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-3 ${
                    task.completed ? 'opacity-55' : ''
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat?.color }}
                  />
                  <span
                    className={`text-sm flex-1 ${
                      task.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-700 dark:text-gray-300'
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.dueTime && (
                    <span className="text-[10px] font-medium text-slate-400 dark:text-gray-500">
                      {task.dueTime.slice(0, 5)}
                    </span>
                  )}
                  {cat && (
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 uppercase">
                      {cat.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
