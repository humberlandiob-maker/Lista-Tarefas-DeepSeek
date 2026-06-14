import { useState } from 'react'
import { X } from 'lucide-react'

const COLORS = [
  '#3B82F6', '#22C55E', '#A855F7', '#F59E0B',
  '#EF4444', '#EC4899', '#14B8A6', '#6366F1',
]

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'custom', label: 'Personalizado' },
]

const DAYS = [
  { index: 0, label: 'Dom' },
  { index: 1, label: 'Seg' },
  { index: 2, label: 'Ter' },
  { index: 3, label: 'Qua' },
  { index: 4, label: 'Qui' },
  { index: 5, label: 'Sex' },
  { index: 6, label: 'Sáb' },
]

export default function HabitForm({ onClose, onSubmit, initialData }) {
  const isEditing = !!initialData

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [frequency, setFrequency] = useState(initialData?.frequency || 'daily')
  const [daysOfWeek, setDaysOfWeek] = useState(initialData?.daysOfWeek || [])
  const [goalPerDay, setGoalPerDay] = useState(initialData?.goalPerDay || 1)
  const [color, setColor] = useState(initialData?.color || COLORS[0])

  function handleDayToggle(index) {
    setDaysOfWeek((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index].sort()
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      frequency,
      daysOfWeek: frequency === 'custom' ? daysOfWeek : null,
      goalPerDay: Math.max(1, goalPerDay),
      color,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 w-full max-w-lg mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
            {isEditing ? 'Editar hábito' : 'Novo hábito'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <input
            type="text"
            placeholder="Título do hábito"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">Frequência</label>
            <div className="flex gap-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrequency(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    frequency === opt.value
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">Dias da semana</label>
              <div className="flex gap-1.5">
                {DAYS.map((day) => (
                  <button
                    key={day.index}
                    type="button"
                    onClick={() => handleDayToggle(day.index)}
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors ${
                      daysOfWeek.includes(day.index)
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">
              Meta por dia
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={goalPerDay}
              onChange={(e) => setGoalPerDay(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">Cor</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              {isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
