import { ClipboardList } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-slate-300 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400 mb-1">
        Nenhuma tarefa encontrada
      </h3>
      <p className="text-sm text-slate-400 dark:text-gray-500 max-w-xs">
        Crie uma nova tarefa usando o botão acima para começar a organizar seu dia.
      </p>
    </div>
  )
}
