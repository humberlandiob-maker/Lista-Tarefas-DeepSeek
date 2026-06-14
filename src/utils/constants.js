export const CATEGORIES = [
  { value: 'trabalho', label: 'Trabalho', color: '#3B82F6' },
  { value: 'pessoal', label: 'Pessoal', color: '#22C55E' },
  { value: 'estudos', label: 'Estudos', color: '#A855F7' },
]

export const PRIORITIES = [
  { value: 'alta', label: 'Alta', color: '#EF4444' },
  { value: 'media', label: 'Média', color: '#F59E0B' },
  { value: 'baixa', label: 'Baixa', color: '#22C55E' },
]

export const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'urgent', label: 'Urgentes' },
  { value: 'reminders', label: 'Lembretes' },
  { value: 'overdue', label: 'Atrasadas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c])
)

export const PRIORITY_MAP = Object.fromEntries(
  PRIORITIES.map((p) => [p.value, p])
)

export const REPEAT_OPTIONS = [
  { value: null, label: 'Não repetir' },
  { value: 'daily', label: 'Diariamente' },
  { value: 'weekly', label: 'Semanalmente' },
  { value: 'monthly', label: 'Mensalmente' },
  { value: 'yearly', label: 'Anualmente' },
]
