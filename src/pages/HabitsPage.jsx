import { useState, useMemo } from 'react'
import { useHabits } from '../context/HabitContext'
import HabitCard from '../components/HabitCard'
import HabitForm from '../components/HabitForm'
import { Plus } from 'lucide-react'

const FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'today', label: 'Hoje' },
  { value: 'done', label: 'Concluídos hoje' },
]

export default function HabitsPage() {
  const { habits, addHabit, editHabit, removeHabit, toggleHabitLog } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [filter, setFilter] = useState('all')

  const today = new Date().toISOString().slice(0, 10)

  const filteredHabits = useMemo(() => {
    switch (filter) {
      case 'today':
        const dayOfWeek = new Date().getDay()
        return habits.filter((h) => {
          if (h.frequency === 'daily') return true
          if (h.frequency === 'custom' && h.daysOfWeek?.includes(dayOfWeek)) return true
          return false
        })
      case 'done':
        return habits.filter((h) => h.todayCount > 0)
      default:
        return habits
    }
  }, [habits, filter])

  async function handleSubmit(data) {
    if (editingHabit) {
      await editHabit(editingHabit.id, data)
    } else {
      await addHabit(data)
    }
    setEditingHabit(null)
    setShowForm(false)
  }

  function handleEdit(habit) {
    setEditingHabit(habit)
    setShowForm(true)
  }

  function handleDelete(habit) {
    if (window.confirm(`Excluir o hábito "${habit.title}"?`)) {
      removeHabit(habit.id)
    }
  }

  function handleCancel() {
    setEditingHabit(null)
    setShowForm(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-gray-100">Hábitos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Hábito</span>
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : 'text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredHabits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 dark:text-gray-500 text-sm">
            {habits.length === 0
              ? 'Nenhum hábito cadastrado. Crie seu primeiro hábito!'
              : 'Nenhum hábito encontrado para este filtro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={(id) => toggleHabitLog(id, today)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <HabitForm
          initialData={editingHabit}
          onClose={handleCancel}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
