import { useHabits } from '../context/HabitContext'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flame } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getHabitStreak } from '../services/habits'

export default function HabitWidget() {
  const { habits, toggleHabitLog } = useHabits()

  const today = new Date().toISOString().slice(0, 10)
  const todayHabits = habits.slice(0, 4)
  const doneCount = habits.filter((h) => h.todayCount > 0).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-gray-100 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Hábitos de hoje
        </h3>
        <span className="text-xs text-slate-400 dark:text-gray-500">
          {doneCount}/{habits.length} concluídos
        </span>
      </div>

      {habits.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-gray-500">Nenhum hábito ainda</p>
      ) : (
        <div className="space-y-2">
          {todayHabits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} onToggle={toggleHabitLog} today={today} />
          ))}
        </div>
      )}

      {habits.length > 0 && (
        <Link
          to="/habitos"
          className="mt-3 flex items-center justify-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          Ver todos <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  )
}

function HabitRow({ habit, onToggle, today }) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    getHabitStreak(habit.id).then(setStreak)
  }, [habit.id, habit.todayCount])

  const done = habit.todayCount > 0

  return (
    <div className="flex items-center gap-3 py-1.5">
      <button
        onClick={() => onToggle(habit.id, today)}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          done
            ? 'bg-green-500 border-green-500'
            : 'border-slate-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
        }`}
      >
        {done && <Check className="w-2.5 h-2.5 text-white" />}
      </button>
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
      <span
        className={`flex-1 text-sm ${done ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-700 dark:text-gray-300'}`}
      >
        {habit.title}
      </span>
      {streak > 0 && (
        <span className="text-xs text-orange-500 flex items-center gap-0.5">
          <Flame className="w-3 h-3" />{streak}
        </span>
      )}
    </div>
  )
}
