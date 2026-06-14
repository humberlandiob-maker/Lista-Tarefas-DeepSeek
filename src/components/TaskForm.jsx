import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { CATEGORIES, PRIORITIES, REPEAT_OPTIONS } from '../utils/constants'
import { useAuth } from '../context/AuthContext'
import { useTemplates } from '../context/TemplateContext'
import * as categoriesService from '../services/categories'
import * as tagsService from '../services/tags'
import TagInput from './TagInput'

export default function TaskForm({ onClose, onSubmit, initialData }) {
  const { user } = useAuth()
  const { addTemplate } = useTemplates()
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState(initialData?.category || 'trabalho')
  const [priority, setPriority] = useState(initialData?.priority || 'media')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '')
  const [dueTime, setDueTime] = useState(initialData?.dueTime || '')
  const [remindMe, setRemindMe] = useState(initialData?.remindMe || false)
  const [repeatRule, setRepeatRule] = useState(initialData?.repeatRule || null)
  const [startFocus, setStartFocus] = useState(false)
  const [subtaskTitles, setSubtaskTitles] = useState([])
  const [dynamicCategories, setDynamicCategories] = useState([])
  const [allTags, setAllTags] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState(initialData?.tags?.map((t) => t.id) || [])
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const isEditing = !!initialData
  const isSubtask = !!initialData?.parentId

  useEffect(() => {
    if (user) {
      categoriesService.getCategories(user.id).then(setDynamicCategories)
      tagsService.getTags(user.id).then(setAllTags)
    }
  }, [user])

  const allCategories = [...dynamicCategories, ...CATEGORIES.filter((c) => !dynamicCategories.find((dc) => dc.name.toLowerCase() === c.label.toLowerCase()))]

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    const filteredSubtasks = subtaskTitles.filter((s) => s.trim())
    const data = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      remindMe,
      repeatRule,
    }
    if (saveAsTemplate && templateName.trim()) {
      addTemplate({
        name: templateName.trim(),
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        remind_me: data.remindMe,
        repeat_rule: data.repeatRule,
        subtitles: filteredSubtasks,
        tag_ids: selectedTagIds,
        color: '#3B82F6',
      })
    }
    onSubmit(data, filteredSubtasks, startFocus, selectedTagIds)
  }

  function addSubtaskField() {
    setSubtaskTitles([...subtaskTitles, ''])
  }

  function removeSubtaskField(index) {
    setSubtaskTitles(subtaskTitles.filter((_, i) => i !== index))
  }

  function updateSubtaskTitle(index, value) {
    const updated = [...subtaskTitles]
    updated[index] = value
    setSubtaskTitles(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
            {initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que você precisa fazer?"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes, links ou observações..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                <optgroup label="Minhas categorias">
                  {dynamicCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Padrão">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Repetir</label>
            <select
              value={repeatRule || ''}
              onChange={(e) => setRepeatRule(e.target.value || null)}
              disabled={isSubtask}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all disabled:opacity-50"
            >
              {REPEAT_OPTIONS.map((opt) => (
                <option key={opt.value || ''} value={opt.value || ''}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Data de conclusão</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onFocus={(e) => e.target.showPicker()}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Horário (opcional)</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                onFocus={(e) => e.target.showPicker()}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <button
                type="button"
                onClick={() => setRemindMe(!remindMe)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  remindMe
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                    : 'border-slate-200 dark:border-gray-600 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
                }`}
              >
                <span>{remindMe ? '🔔' : '🔕'}</span>
                Me lembre
              </button>
              {!isEditing && !isSubtask && (
                <button
                  type="button"
                  onClick={() => setStartFocus(!startFocus)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    startFocus
                      ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                      : 'border-slate-200 dark:border-gray-600 text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{startFocus ? '🎯' : '⏱️'}</span>
                  Iniciar foco
                </button>
              )}
            </div>
          </div>

          <TagInput allTags={allTags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} />

          {!isEditing && !isSubtask && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Subtarefas</label>
              <div className="space-y-2">
                {subtaskTitles.map((st, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-gray-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={st}
                      onChange={(e) => updateSubtaskTitle(i, e.target.value)}
                      placeholder={`Subtarefa ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtaskField(i)}
                      className="p-1.5 rounded-lg text-slate-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSubtaskField}
                className="mt-2 flex items-center gap-1.5 text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar subtarefa
              </button>
            </div>
          )}

          <div className="pt-2 space-y-3 border-t border-slate-100 dark:border-gray-700">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={saveAsTemplate}
                onChange={(e) => setSaveAsTemplate(e.target.checked)}
                className="rounded border-slate-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-slate-600 dark:text-gray-400">💾 Salvar como template</span>
            </label>
            {saveAsTemplate && (
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Nome do template"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              {initialData ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
