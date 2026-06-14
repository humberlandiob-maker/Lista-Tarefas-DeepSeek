import { useEffect, useState } from 'react'
import { checkStreak } from '../services/gamification'
import { Flame } from 'lucide-react'

export default function StreakBadge() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setStreak(checkStreak())
  }, [])

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-xl border border-orange-200 dark:border-orange-800 p-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-sm">
        <Flame className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{streak}</p>
        <p className="text-xs text-orange-500 dark:text-orange-400">dias consecutivos</p>
      </div>
    </div>
  )
}
