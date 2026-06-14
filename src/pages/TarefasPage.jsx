import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, List, Columns, FileText } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { useTemplates } from '../context/TemplateContext'
import { usePomodoro } from '../context/PomodoroContext'
import { useAuth } from '../context/AuthContext'
import * as tagsService from '../services/tags'
import { isOverdue, isDueToday } from '../utils/helpers'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import TaskList from '../components/TaskList'
import KanbanBoard from '../components/KanbanBoard'
import TaskForm from '../components/TaskForm'
import TaskDetailModal from '../components/TaskDetailModal'
import TemplatePicker from '../components/TemplatePicker'

function applyFilter(tasks, filter, dayDate) {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const weekEnd = new Date(now)
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()))
  const weekEndStr = weekEnd.toISOString().slice(0, 10)

  if (filter?.startsWith('tag:')) {
    const tagId = Number(filter.slice(4))
    return tasks.filter((t) => t.tags?.some((tag) => tag.id === tagId))
  }

  switch (filter) {
    case 'day':
      return tasks.filter((t) => t.dueDate && t.dueDate === dayDate)
    case 'today':
      return tasks.filter((t) => t.dueDate && t.dueDate === todayStr)
    case 'week':
      return tasks.filter((t) => t.dueDate && t.dueDate >= todayStr && t.dueDate <= weekEndStr)
    case 'urgent':
      return tasks.filter((t) => !t.completed && t.priority === 'alta')
    case 'reminders':
      return tasks.filter((t) => !t.completed && t.remindMe)
    case 'overdue':
      return tasks.filter((t) => !t.completed && isOverdue(t.dueDate, t.dueTime))
    case 'pending':
      return tasks.filter((t) => !t.completed)
    case 'completed':
      return tasks.filter((t) => t.completed)
    default:
      return tasks
  }
}

export default function TarefasPage() {
  const { tasks, addTask, toggleTask, toggleRemind, deleteTask, editTask, reorderTasks } = useTasks()
  const { templates, addTemplate } = useTemplates()
  const { startFocus } = usePomodoro()
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'all'
  const dayDate = searchParams.get('date') || null
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    if (user) tagsService.getTags(user.id).then(setAllTags)
  }, [user])

  function setFilter(value) {
    setSearchParams(value === 'all' ? {} : { filter: value }, { replace: true })
  }
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [detailTask, setDetailTask] = useState(null)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)

  const filteredTasks = useMemo(() => {
    let list = applyFilter(tasks, filter, dayDate)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(q))
    }
    return list
  }, [tasks, filter, dayDate, search])

  async function handleSubmit(data, subtaskTitles = [], startFocusFlag = false, tagIds = []) {
    const task = await addTask(data, subtaskTitles, false, tagIds)
    if (task && startFocusFlag) startFocus(task)
    setShowForm(false)
  }

  function handleEditClick(task) {
    setEditingTask(task)
    setShowForm(true)
  }

  async function handleEditSubmit(data, subtaskTitles, startFocusFlag, tagIds) {
    if (!editingTask) return
    await editTask(editingTask.id, data, tagIds)
    setEditingTask(null)
    setShowForm(false)
  }

  function handleCancelEdit() {
    setEditingTask(null)
    setShowForm(false)
  }

  function applyTemplate(template) {
    setShowTemplatePicker(false)
    if (!template) {
      setEditingTask(null)
      setShowForm(true)
      return
    }
    setEditingTask({
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority,
      dueDate: '',
      remindMe: template.remindMe,
      repeatRule: template.repeatRule,
      tags: template.tagIds?.map((id) => ({ id })) || [],
    })
    setShowForm(true)
  }

  function handleReorder(reordered) {
    const reorderedIds = reordered.map((t) => t.id)
    const subtasks = tasks.filter((t) => t.parentId)
    const remainingParents = tasks.filter((t) => !t.parentId && !reorderedIds.includes(t.id))
    reorderTasks([...reordered, ...remainingParents, ...subtasks])
  }

  return (
    <div className={view === 'list' ? 'max-w-2xl mx-auto px-4 py-8' : 'px-4 py-8'}>
      <div className={view === 'list' ? '' : 'max-w-4xl mx-auto'}>
        <FilterBar tasks={tasks} active={filter} onChange={setFilter} allTags={allTags} />

        <div className="flex items-center justify-between gap-3 mt-3 mb-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md text-sm transition-colors ${
                view === 'list' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'
              }`}
              title="Visualização em lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded-md text-sm transition-colors ${
                view === 'kanban' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'
              }`}
              title="Visualização em kanban"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowTemplatePicker(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Tarefa</span>
          </button>
        </div>

        {view === 'kanban' ? (
          <KanbanBoard tasks={filteredTasks} onToggle={toggleTask} />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onToggleRemind={toggleRemind}
            onReorder={handleReorder}
            onEdit={handleEditClick}
            onViewDetail={(task) => setDetailTask(task)}
          />
        )}
      </div>

      {showTemplatePicker && (
        <TemplatePicker
          templates={templates}
          onSelect={applyTemplate}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {showForm && (
        <TaskForm
          initialData={editingTask}
          onClose={handleCancelEdit}
          onSubmit={editingTask ? handleEditSubmit : handleSubmit}
        />
      )}

      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          subtasks={tasks.filter((t) => t.parentId === detailTask.id)}
          onClose={() => setDetailTask(null)}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={(task) => { setDetailTask(null); handleEditClick(task) }}
          onToggleSubtask={toggleTask}
          onSaveTemplate={(task) => {
            const name = prompt('Nome do template:')
            if (name?.trim()) addTemplate({
              name: name.trim(),
              title: task.title,
              description: task.description,
              category: task.category,
              priority: task.priority,
              remind_me: task.remindMe,
              repeat_rule: task.repeatRule,
              subtitles: tasks.filter((t) => t.parentId === task.id).map((t) => t.title),
              tag_ids: task.tags?.map((t) => t.id) || [],
              color: '#3B82F6',
            })
          }}
        />
      )}
    </div>
  )
}
