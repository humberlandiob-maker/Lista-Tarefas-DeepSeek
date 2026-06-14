import { FileText, X } from 'lucide-react'
import { CATEGORY_MAP, PRIORITY_MAP } from '../utils/constants'

export default function TemplatePicker({ templates, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 w-full max-w-lg mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Escolher tarefa modelo
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-4">
          {templates.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-gray-500 text-center py-8">
              Nenhuma tarefa modelo criada ainda.
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {templates.map((t) => {
                const cat = CATEGORY_MAP[t.category]
                const pri = PRIORITY_MAP[t.priority]
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left transition-colors group"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-100 truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-gray-500 truncate">
                        {t.title}
                        {t.subtitles.length > 0 && ` • ${t.subtitles.length} subtarefa${t.subtitles.length > 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cat && (
                        <span className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: cat.color }}>
                          {cat.label}
                        </span>
                      )}
                      {pri && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: pri.color + '20', color: pri.color }}>
                          {pri.label}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={() => onSelect(null)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-700 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
          >
            Criar do zero
          </button>
        </div>
      </div>
    </div>
  )
}
