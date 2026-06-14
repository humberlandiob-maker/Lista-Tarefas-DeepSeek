import { Check, Pencil, Trash2, Flame } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getHabitStreak } from '../services/habits'

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    getHabitStreak(habit.id).then(setStreak)
  }, [habit.id, habit.todayCount])

  const done = habit.todayCount > 0
  const progress = habit.goalPerDay > 1 ? habit.todayCount / habit.goalPerDay : (done ? 1 : 0)

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all hover:shadow-md ${
        done
          ? 'border-green-300 dark:border-green-700'
          : 'border-slate-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(habit.id)}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            done
              ? 'bg-green-500 border-green-500 scale-110'
              : 'border-slate-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
          }`}
        >
          {done && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: habit.color }}
            />
            <h3
              className={`font-medium text-sm truncate ${
                done
                  ? 'line-through text-slate-400 dark:text-gray-500'
                  : 'text-slate-800 dark:text-gray-100'
              }`}
            >
              {habit.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-gray-500">
            <span className="capitalize">{habit.frequency === 'daily' ? 'Diário' : habit.frequency === 'weekly' ? 'Semanal' : 'Personalizado'}</span>
            {habit.frequency === 'custom' && habit.daysOfWeek && (
              <span>
                {habit.daysOfWeek
                  .sort()
                  .map((d) => DAY_LABELS[d])
                  .join(', ')}
              </span>
            )}
            {habit.goalPerDay > 1 && (
              <span>
                Meta: {habit.todayCount}/{habit.goalPerDay}
              </span>
            )}
          </div>

          {habit.goalPerDay > 1 && (
            <div className="mt-2 w-full h-1.5 rounded-full bg-slate-100 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(progress * 100, 100)}%`,
                  backgroundColor: habit.color,
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 text-xs font-medium">
              <Flame className="w-3 h-3" />
              {streak}
            </div>
          )}
          <button
            onClick={() => onEdit(habit)}
            className="p-1.5 rounded-lg text-slate-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(habit)}
            className="p-1.5 rounded-lg text-slate-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
