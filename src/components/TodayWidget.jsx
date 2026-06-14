import { useMemo } from 'react'
import { format, isToday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, Clock, AlertCircle, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
import { isOverdue } from '../utils/helpers'
import ProgressBar from './ProgressBar'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Bom dia', icon: Sun }
  if (h < 18) return { text: 'Boa tarde', icon: Sun }
  return { text: 'Boa noite', icon: Moon }
}

export default function TodayWidget() {
  const { displayName } = useAuth()
  const { tasks } = useTasks()

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false
      return isToday(parseISO(t.dueDate))
    })
  }, [tasks])

  const todayCompleted = todayTasks.filter((t) => t.completed).length
  const todayPending = todayTasks.filter((t) => !t.completed).length
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.dueTime)).length

  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
          <GreetIcon className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
            {greeting.text}, {displayName}
          </h2>
          <p className="text-sm text-slate-400 dark:text-gray-500">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-slate-600 dark:text-gray-400">{todayCompleted} concluídas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-slate-600 dark:text-gray-400">{todayPending} pendentes</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-slate-600 dark:text-gray-400">{overdueCount} atrasadas</span>
        </div>
      </div>

      {todayTasks.length > 0 && (
        <ProgressBar
          value={todayCompleted}
          max={todayTasks.length}
          label="Progresso do dia"
        />
      )}
    </div>
  )
}
