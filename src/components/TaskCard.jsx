import { useState } from 'react'
import { Trash2, Pencil, Calendar as CalendarIcon, Bell, BellOff, ChevronDown, ChevronUp, GripVertical, RefreshCw, Timer } from 'lucide-react'
import { CATEGORY_MAP, PRIORITY_MAP } from '../utils/constants'
import { formatDate, formatDateTime, isOverdue, isDueToday } from '../utils/helpers'
import { usePomodoro } from '../context/PomodoroContext'

export default function TaskCard({ task, onToggle, onDelete, onToggleRemind, onEdit, onViewDetail, dragHandleProps, subtasks, onToggleSubtask }) {
  const category = CATEGORY_MAP[task.category]
  const priority = PRIORITY_MAP[task.priority]
  const overdue = !task.completed && isOverdue(task.dueDate, task.dueTime)
  const dueToday = !task.completed && isDueToday(task.dueDate, task.dueTime)
  const [showDesc, setShowDesc] = useState(false)

  const { startFocus, stop: stopFocus, selectedTask } = usePomodoro()
  const subtaskTotal = subtasks ? subtasks.length : 0
  const subtaskDone = subtasks ? subtasks.filter((s) => s.completed).length : 0
  const hasChildren = subtaskTotal > 0

  const borderClass = overdue
    ? 'border-red-300 dark:border-red-800 bg-red-50/40 dark:bg-red-950/40'
    : task.remindMe && !task.completed
    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/40'
    : 'border-slate-200 dark:border-gray-700'

  return (
    <div
      className={`task-card-enter bg-white dark:bg-gray-800 rounded-xl border p-4 flex items-start gap-2 group transition-all hover:shadow-sm ${
        task.completed ? 'opacity-55 border-slate-200 dark:border-gray-700' : borderClass
      }`}
    >
      {dragHandleProps && (
        <button
          {...dragHandleProps}
          className="mt-0.5 p-0.5 rounded text-slate-300 dark:text-gray-600 hover:text-slate-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={() => onToggle(task.id)}
        className={`custom-checkbox mt-0.5 ${task.completed ? 'checked' : ''}`}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={`font-medium text-base cursor-pointer hover:text-blue-600 transition-colors ${
            task.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-800 dark:text-gray-100'
          }`}
          onClick={() => onViewDetail && onViewDetail(task)}
        >
          {task.title}
        </h3>

        {(task.description || hasChildren) && (
          <div className="mt-1">
            <button
              onClick={() => setShowDesc(!showDesc)}
              className="flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors"
            >
              {showDesc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {showDesc ? 'Ocultar' : 'Ver detalhes'}
            </button>
            {showDesc && (
              <div className="mt-2 space-y-3">
                {task.description && (
                  <p className="text-sm text-slate-500 dark:text-gray-400 whitespace-pre-wrap">{task.description}</p>
                )}
                {hasChildren && (
                  <div className="ml-3 space-y-1.5 border-l-2 border-slate-100 dark:border-gray-700 pl-3">
                    {subtasks.map((st) => (
                      <div key={st.id} className="flex items-center gap-2 py-0.5 group">
                        <button
                          onClick={() => onToggleSubtask ? onToggleSubtask(st.id) : null}
                          className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            st.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
                          }`}
                        >
                          {st.completed && (
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 text-sm ${st.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-600 dark:text-gray-400'}`}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {task.repeatRule && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-gray-500">
              <RefreshCw className="w-3 h-3" />
              {task.repeatRule === 'daily' ? 'Diária' : task.repeatRule === 'weekly' ? 'Semanal' : task.repeatRule === 'weekdays' ? 'Dias úteis' : task.repeatRule === 'monthly' ? 'Mensal' : 'Anual'}
            </span>
          )}
          {hasChildren && (
            <span className="inline-flex items-center text-xs text-slate-400 dark:text-gray-500">
              {subtaskDone}/{subtaskTotal} concluídas
            </span>
          )}
          {task.tags?.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          {category && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.label.toUpperCase()}
            </span>
          )}

          {priority && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
              style={{
                backgroundColor: priority.color + '20',
                color: priority.color,
              }}
            >
              {priority.label.toUpperCase()}
            </span>
          )}

          {task.dueDate ? (
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                overdue ? 'text-red-500 font-medium' : dueToday ? 'text-amber-500 font-medium' : 'text-slate-400 dark:text-gray-500'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              {formatDateTime(task.dueDate, task.dueTime)}
              {overdue && ' (Atrasada)'}
              {dueToday && ' (Hoje)'}
            </span>
          ) : !task.completed && (
            <span className="inline-flex items-center text-xs text-slate-400 dark:text-gray-500">
              Sem prazo
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {onToggleRemind && (
          <button
            onClick={() => onToggleRemind(task.id)}
            className={`p-1.5 rounded-lg transition-all ${
              task.remindMe
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                : 'text-slate-300 dark:text-gray-600 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 opacity-0 group-hover:opacity-100'
            }`}
          >
            {task.remindMe ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        )}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {!task.completed && (
            <button
              onClick={() => startFocus(task)}
              className="p-1.5 rounded-lg text-slate-300 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 opacity-0 group-hover:opacity-100 transition-all"
              title="Focar nesta tarefa"
            >
              <Timer className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => { if (selectedTask?.id === task.id) stopFocus(); onDelete(task.id) }}
            className="p-1.5 rounded-lg text-slate-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
      </div>
    </div>
  )
}
