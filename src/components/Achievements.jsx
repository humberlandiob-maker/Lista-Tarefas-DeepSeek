import { useMemo } from 'react'
import { useTasks } from '../context/TaskContext'
import { useHabits } from '../context/HabitContext'
import { getAchievements, getProductivity } from '../services/gamification'
import { Award } from 'lucide-react'

export default function Achievements() {
  const { tasks } = useTasks()
  const { habits } = useHabits()

  const { achievements, productivity } = useMemo(() => ({
    achievements: getAchievements(tasks, habits),
    productivity: Math.round(tasks.filter((t) => t.completed).length / (tasks.length || 1) * 100),
  }), [tasks, habits])

  if (tasks.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-amber-500" />
        <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
          Produtividade
        </h3>
        <span className="ml-auto text-sm font-bold text-slate-700 dark:text-gray-300">{productivity}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
          style={{ width: `${productivity}%` }}
        />
      </div>

      <h3 className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        Conquistas
      </h3>
      <div className="space-y-1.5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`flex items-center gap-2 text-sm py-1 px-2 rounded-lg ${
              ach.earned ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'text-slate-400 dark:text-gray-500'
            }`}
          >
            <span>{ach.icon}</span>
            <span className="flex-1">{ach.label}</span>
            {ach.earned ? (
              <span className="text-xs">✅</span>
            ) : ach.progress !== undefined ? (
              <span className="text-xs text-slate-400 dark:text-gray-500">{ach.progress}/{ach.max}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
