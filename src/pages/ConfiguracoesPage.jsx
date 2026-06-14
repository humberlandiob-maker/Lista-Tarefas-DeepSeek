import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import * as settingsService from '../services/settings'
import * as categoriesService from '../services/categories'
import * as tagsService from '../services/tags'
import * as templatesService from '../services/templates'
import { Bell, Timer, Target, Save, Plus, Pencil, Trash2, X, Check, AlertTriangle, Tag, FileText } from 'lucide-react'
import DeleteAccountModal from '../components/DeleteAccountModal'

const PRESET_COLORS = ['#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16']

export default function ConfiguracoesPage() {
  const { user, displayName } = useAuth()
  const [settings, setSettings] = useState(settingsService.getSettings())
  const [saved, setSaved] = useState(false)

  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [showNew, setShowNew] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [tags, setTags] = useState([])
  const [templates, setTemplates] = useState([])
  const [templateEditingId, setTemplateEditingId] = useState(null)
  const [templateEditName, setTemplateEditName] = useState('')
  const [templateEditTitle, setTemplateEditTitle] = useState('')
  const [templateEditCategory, setTemplateEditCategory] = useState('')
  const [templateEditPriority, setTemplateEditPriority] = useState('')
  const [templateNewName, setTemplateNewName] = useState('')
  const [templateNewTitle, setTemplateNewTitle] = useState('')
  const [templateNewCategory, setTemplateNewCategory] = useState('trabalho')
  const [templateNewPriority, setTemplateNewPriority] = useState('media')
  const [showTemplateNew, setShowTemplateNew] = useState(false)
  const [tagEditingId, setTagEditingId] = useState(null)
  const [tagEditName, setTagEditName] = useState('')
  const [tagEditColor, setTagEditColor] = useState('')
  const [tagNewName, setTagNewName] = useState('')
  const [tagNewColor, setTagNewColor] = useState(PRESET_COLORS[0])
  const [showTagNew, setShowTagNew] = useState(false)

  async function loadCategories() {
    if (!user) return
    const data = await categoriesService.getCategories(user.id)
    setCategories(data)
  }

  async function loadTags() {
    if (!user) return
    const data = await tagsService.getTags(user.id)
    setTags(data)
  }

  async function loadTemplates() {
    if (!user) return
    const data = await templatesService.getTemplates(user.id)
    setTemplates(data)
  }

  useEffect(() => { loadCategories(); loadTags(); loadTemplates() }, [user])

  async function handleCreate() {
    if (!newName.trim() || !user) return
    const cat = await categoriesService.createCategory({ name: newName.trim(), color: newColor }, user.id)
    if (cat) {
      setCategories((prev) => [...prev, cat])
      setNewName('')
      setNewColor(PRESET_COLORS[0])
      setShowNew(false)
    }
  }

  async function handleEdit(id) {
    if (!editName.trim()) return
    const updated = await categoriesService.updateCategory(id, { name: editName.trim(), color: editColor })
    if (updated) {
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
      setEditingId(null)
    }
  }

  async function handleDelete(id) {
    const ok = await categoriesService.deleteCategory(id)
    if (ok) setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  async function handleTagCreate() {
    if (!tagNewName.trim() || !user) return
    const tag = await tagsService.createTag({ name: tagNewName.trim(), color: tagNewColor }, user.id)
    if (tag) {
      setTags((prev) => [...prev, tag])
      setTagNewName('')
      setTagNewColor(PRESET_COLORS[0])
      setShowTagNew(false)
    }
  }

  async function handleTagEdit(id) {
    if (!tagEditName.trim()) return
    const updated = await tagsService.updateTag(id, { name: tagEditName.trim(), color: tagEditColor })
    if (updated) {
      setTags((prev) => prev.map((t) => (t.id === id ? updated : t)))
      setTagEditingId(null)
    }
  }

  async function handleTagDelete(id) {
    const ok = await tagsService.deleteTag(id)
    if (ok) setTags((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleTemplateCreate() {
    if (!templateNewName.trim() || !templateNewTitle.trim() || !user) return
    const t = await templatesService.createTemplate({
      name: templateNewName.trim(),
      title: templateNewTitle.trim(),
      category: templateNewCategory,
      priority: templateNewPriority,
    }, user.id)
    if (t) {
      setTemplates((prev) => [...prev, t])
      setTemplateNewName('')
      setTemplateNewTitle('')
      setTemplateNewCategory('trabalho')
      setTemplateNewPriority('media')
      setShowTemplateNew(false)
    }
  }

  async function handleTemplateEdit(id) {
    if (!templateEditName.trim() || !templateEditTitle.trim()) return
    const updated = await templatesService.updateTemplate(id, {
      name: templateEditName.trim(),
      title: templateEditTitle.trim(),
      category: templateEditCategory,
      priority: templateEditPriority,
    })
    if (updated) {
      setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, name: templateEditName.trim(), title: templateEditTitle.trim(), category: templateEditCategory, priority: templateEditPriority } : t)))
      setTemplateEditingId(null)
    }
  }

  async function handleTemplateDelete(id) {
    const ok = await templatesService.deleteTemplate(id)
    if (ok) setTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  function handleSave() {
    settingsService.saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-gray-100">Configurações</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Perfil</h2>
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">{displayName?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-gray-100">{displayName}</p>
              <p className="text-xs text-slate-400 dark:text-gray-500">Nome vinculado ao seu perfil</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Metas</h2>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <label className="text-sm text-slate-700 dark:text-gray-300">Meta diária de tarefas</label>
              <input
                type="number"
                min={1}
                max={50}
                value={settings.dailyGoal}
                onChange={(e) => setSettings({ ...settings, dailyGoal: Number(e.target.value) })}
                className="w-24 ml-3 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Notificações</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-700 dark:text-gray-300">Notificações do sistema</span>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-blue-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.notifications ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Pomodoro</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-green-500" />
              <div className="flex-1 flex items-center gap-2">
                <label className="text-sm text-slate-700 dark:text-gray-300 w-32">Foco (min)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={settings.pomodoroFocus}
                  onChange={(e) => setSettings({ ...settings, pomodoroFocus: Number(e.target.value) })}
                  className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-amber-500" />
              <div className="flex-1 flex items-center gap-2">
                <label className="text-sm text-slate-700 dark:text-gray-300 w-32">Pausa curta (min)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.pomodoroShortBreak}
                  onChange={(e) => setSettings({ ...settings, pomodoroShortBreak: Number(e.target.value) })}
                  className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-purple-500" />
              <div className="flex-1 flex items-center gap-2">
                <label className="text-sm text-slate-700 dark:text-gray-300 w-32">Pausa longa (min)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={settings.pomodoroLongBreak}
                  onChange={(e) => setSettings({ ...settings, pomodoroLongBreak: Number(e.target.value) })}
                  className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400 dark:text-gray-500 border border-slate-300 dark:border-gray-600 rounded">#</div>
              <div className="flex-1 flex items-center gap-2">
                <label className="text-sm text-slate-700 dark:text-gray-300 w-32">Ciclos</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={settings.pomodoroCycles}
                  onChange={(e) => setSettings({ ...settings, pomodoroCycles: Number(e.target.value) })}
                  className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Salvo!' : 'Salvar configurações'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Categorias</h2>
          <button
            onClick={() => setShowNew(!showNew)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Nova
          </button>
        </div>

        {showNew && (
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome da categoria"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex items-center gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${newColor === color ? 'border-slate-800 dark:border-gray-200 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">Salvar</button>
              <button onClick={() => setShowNew(false)} className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-600">Cancelar</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {categories.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-gray-500 text-center py-4">Nenhuma categoria criada</p>
          )}
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-700 rounded-xl">
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex items-center gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-5 h-5 rounded-full border-2 ${editColor === color ? 'border-slate-800 dark:border-gray-200' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button onClick={() => handleEdit(cat.id)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-gray-600"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-gray-300">{cat.name}</span>
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditColor(cat.color) }} className="p-1.5 rounded-lg text-slate-300 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg text-slate-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Tags</h2>
          <button
            onClick={() => setShowTagNew(!showTagNew)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Nova
          </button>
        </div>

        {showTagNew && (
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
            <input
              type="text"
              value={tagNewName}
              onChange={(e) => setTagNewName(e.target.value)}
              placeholder="Nome da tag"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex items-center gap-2 mb-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setTagNewColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${tagNewColor === color ? 'border-slate-800 dark:border-gray-200 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleTagCreate} className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">Salvar</button>
              <button onClick={() => setShowTagNew(false)} className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-600">Cancelar</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {tags.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-gray-500 text-center py-4">Nenhuma tag criada</p>
          )}
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-700 rounded-xl">
              {tagEditingId === tag.id ? (
                <>
                  <input
                    type="text"
                    value={tagEditName}
                    onChange={(e) => setTagEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex items-center gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTagEditColor(color)}
                        className={`w-5 h-5 rounded-full border-2 ${tagEditColor === color ? 'border-slate-800 dark:border-gray-200' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button onClick={() => handleTagEdit(tag.id)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setTagEditingId(null)} className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-gray-600"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                  <span className="flex-1 text-sm font-medium text-slate-700 dark:text-gray-300">{tag.name}</span>
                  <button onClick={() => { setTagEditingId(tag.id); setTagEditName(tag.name); setTagEditColor(tag.color) }} className="p-1.5 rounded-lg text-slate-300 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleTagDelete(tag.id)} className="p-1.5 rounded-lg text-slate-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Tarefas Modelo</h2>
          <button
            onClick={() => setShowTemplateNew(!showTemplateNew)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Novo
          </button>
        </div>

        {showTemplateNew && (
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-4 mb-4 space-y-3">
            <input
              type="text"
              value={templateNewName}
              onChange={(e) => setTemplateNewName(e.target.value)}
              placeholder="Nome da tarefa modelo"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <input
              type="text"
              value={templateNewTitle}
              onChange={(e) => setTemplateNewTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex gap-2">
              <select
                value={templateNewCategory}
                onChange={(e) => setTemplateNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm"
              >
                <option value="trabalho">Trabalho</option>
                <option value="pessoal">Pessoal</option>
                <option value="estudos">Estudos</option>
              </select>
              <select
                value={templateNewPriority}
                onChange={(e) => setTemplateNewPriority(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleTemplateCreate} className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">Salvar</button>
              <button onClick={() => setShowTemplateNew(false)} className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-600">Cancelar</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {templates.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-gray-500 text-center py-4">Nenhuma tarefa modelo criada</p>
          )}
          {templates.map((t) => {
            const cat = t.category
            const pri = t.priority
            return (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-700 rounded-xl">
                {templateEditingId === t.id ? (
                  <>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={templateEditName}
                        onChange={(e) => setTemplateEditName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <input
                        type="text"
                        value={templateEditTitle}
                        onChange={(e) => setTemplateEditTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <div className="flex gap-2">
                        <select value={templateEditCategory} onChange={(e) => setTemplateEditCategory(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm">
                          <option value="trabalho">Trabalho</option>
                          <option value="pessoal">Pessoal</option>
                          <option value="estudos">Estudos</option>
                        </select>
                        <select value={templateEditPriority} onChange={(e) => setTemplateEditPriority(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm">
                          <option value="alta">Alta</option>
                          <option value="media">Média</option>
                          <option value="baixa">Baixa</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={() => handleTemplateEdit(t.id)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setTemplateEditingId(null)} className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-gray-600"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-gray-300 truncate">{t.name}</p>
                      <p className="text-xs text-slate-400 dark:text-gray-500 truncate">{t.title} {cat && `• ${cat}`} {pri && `• ${pri}`}</p>
                    </div>
                    <button onClick={() => { setTemplateEditingId(t.id); setTemplateEditName(t.name); setTemplateEditTitle(t.title); setTemplateEditCategory(t.category); setTemplateEditPriority(t.priority) }} className="p-1.5 rounded-lg text-slate-300 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleTemplateDelete(t.id)} className="p-1.5 rounded-lg text-slate-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">Zona de perigo</h2>
        <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">
          Excluir sua conta removerá permanentemente todos os seus dados, incluindo tarefas, categorias e perfil.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          Excluir conta
        </button>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  )
}
