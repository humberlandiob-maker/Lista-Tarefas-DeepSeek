import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Bom dia', icon: Sun }
  if (h < 18) return { text: 'Boa tarde', icon: Sun }
  return { text: 'Boa noite', icon: Moon }
}

export default function TodayWidget() {
  const { displayName } = useAuth()

  const greeting = getGreeting()
  const GreetIcon = greeting.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3">
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
    </div>
  )
}
