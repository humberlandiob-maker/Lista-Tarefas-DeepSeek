import { X, Calendar as CalendarIcon, Bell, RefreshCw, Pencil, Trash2, Timer, FileText } from 'lucide-react'
import { usePomodoro } from '../context/PomodoroContext'
import { CATEGORY_MAP, PRIORITY_MAP, REPEAT_OPTIONS } from '../utils/constants'
import { formatDateFull, formatDateTimeFull, isOverdue, isDueToday } from '../utils/helpers'

const REPEAT_LABELS = Object.fromEntries(REPEAT_OPTIONS.map((r) => [r.value, r.label]))

export default function TaskDetailModal({ task, subtasks, onClose, onToggle, onDelete, onEdit, onToggleSubtask, onSaveTemplate }) {
  const category = CATEGORY_MAP[task.category]
  const priority = PRIORITY_MAP[task.priority]
  const overdue = !task.completed && isOverdue(task.dueDate, task.dueTime)
  const dueToday = !task.completed && isDueToday(task.dueDate, task.dueTime)
  const { startFocus, stop: stopFocus, selectedTask } = usePomodoro()
  const subtaskTotal = subtasks.length
  const subtaskDone = subtasks.filter((s) => s.completed).length

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => onToggle(task.id)}
              className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <h2 className={`text-lg font-semibold truncate ${task.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-800 dark:text-gray-100'}`}>
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: category.color }}>
                {category.label}
              </span>
            )}
            {priority && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: priority.color + '20', color: priority.color }}>
                {priority.label}
              </span>
            )}
            {task.tags?.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
            {task.repeatRule && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700">
                <RefreshCw className="w-3 h-3" />
                {REPEAT_LABELS[task.repeatRule]}
              </span>
            )}
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-gray-500" />
              <span className={`${overdue ? 'text-red-500 font-medium' : dueToday ? 'text-amber-500 font-medium' : 'text-slate-600 dark:text-gray-300'}`}>
                {formatDateTimeFull(task.dueDate, task.dueTime)}
                {overdue && ' (Atrasada)'}
                {dueToday && ' (Hoje)'}
              </span>
            </div>
          )}

          {task.remindMe && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Bell className="w-4 h-4" />
              <span>Lembrete ativado</span>
            </div>
          )}

          {task.description && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide mb-1">Descrição</h4>
              <p className="text-sm text-slate-600 dark:text-gray-400 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {subtaskTotal > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Subtarefas ({subtaskDone}/{subtaskTotal})
              </h4>
              <div className="space-y-1.5">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 py-1 group">
                    <button
                      onClick={() => onToggleSubtask(st.id)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        st.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
                      }`}
                    >
                      {st.completed && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className={`flex-1 text-sm ${st.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-700 dark:text-gray-300'}`}>
                      {st.title}
                    </span>
                    <button
                      onClick={() => onDelete(st.id)}
                      className="p-1 rounded text-slate-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-gray-700">
            {!task.completed && (
              <button
                onClick={() => { startFocus(task); onClose() }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-green-50 dark:bg-green-900/30 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <Timer className="w-4 h-4" />
                Foco
              </button>
            )}
            {onSaveTemplate && (
              <button
                onClick={() => { onSaveTemplate(task); onClose() }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-gray-700 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Tarefa Modelo
              </button>
            )}
            <button
              onClick={() => onEdit(task)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => { if (selectedTask?.id === task.id) stopFocus(); onDelete(task.id); onClose() }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
