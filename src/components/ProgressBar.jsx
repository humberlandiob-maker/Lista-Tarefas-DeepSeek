export default function ProgressBar({ value, max, label }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-slate-400 dark:text-gray-500">{value} de {max}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 dark:text-gray-500 mt-1 block text-right">{pct}%</span>
    </div>
  )
}
