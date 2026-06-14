import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { useTemplates } from '../context/TemplateContext'
import { usePomodoro } from '../context/PomodoroContext'
import { ListTodo, CheckCircle2, Clock, AlertCircle, Timer, ArrowRight, Plus, Pencil, FileText } from 'lucide-react'
import TodayWidget from '../components/TodayWidget'
import WeekCalendar from '../components/WeekCalendar'
import UpcomingDeadlines from '../components/UpcomingDeadlines'
import Achievements from '../components/Achievements'
import TaskForm from '../components/TaskForm'
import TaskDetailModal from '../components/TaskDetailModal'
import HabitWidget from '../components/HabitWidget'
import { formatDateTime, isOverdue, isDueToday } from '../utils/helpers'
import { CATEGORY_MAP, PRIORITY_MAP } from '../utils/constants'

export default function DashboardPage() {
  const { tasks, toggleTask, addTask, editTask, deleteTask } = useTasks()
  const { addTemplate } = useTemplates()
  const { startFocus, completedToday } = usePomodoro()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [detailTask, setDetailTask] = useState(null)

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

  function handleCancel() {
    setEditingTask(null)
    setShowForm(false)
  }

  async function saveTaskAsTemplate(task) {
    const name = prompt('Nome do template:')
    if (!name?.trim()) return
    await addTemplate({
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
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = total - completed
    const overdue = tasks.filter((t) => {
      if (t.completed) return false
      return isOverdue(t.dueDate, t.dueTime)
    }).length
    return { total, completed, pending, overdue }
  }, [tasks])

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isDueToday(t.dueDate, t.dueTime))
  }, [tasks])

  const overdueList = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && isOverdue(t.dueDate, t.dueTime))
      .sort((a, b) => {
        const dateCmp = new Date(a.dueDate) - new Date(b.dueDate)
        if (dateCmp !== 0) return dateCmp
        return (a.dueTime || '').localeCompare(b.dueTime || '')
      })
      .slice(0, 3)
  }, [tasks])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <TodayWidget />

      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm my-6"
      >
        <Plus className="w-4 h-4" />
        <span>Nova Tarefa</span>
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={ListTodo}
          label="Total"
          value={stats.total}
          color="text-blue-500"
          bg="bg-blue-50 dark:bg-blue-900/30"
          to="/tarefas?filter=all"
        />
        <StatCard
          icon={Clock}
          label="Pendentes"
          value={stats.pending}
          color="text-amber-500"
          bg="bg-amber-50 dark:bg-amber-900/30"
          to="/tarefas?filter=pending"
        />
        <StatCard
          icon={CheckCircle2}
          label="Concluídas"
          value={stats.completed}
          color="text-green-500"
          bg="bg-green-50 dark:bg-green-900/30"
          to="/tarefas?filter=completed"
        />
        <StatCard
          icon={AlertCircle}
          label="Atrasadas"
          value={stats.overdue}
          color="text-red-500"
          bg="bg-red-50 dark:bg-red-900/30"
          to="/tarefas?filter=overdue"
        />
        <StatCard
          icon={Timer}
          label="Foco Hoje"
          value={completedToday}
          color="text-green-500"
          bg="bg-green-50 dark:bg-green-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-gray-100">Tarefas de hoje</h3>
            <Link to="/tarefas" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-gray-500">Nenhuma tarefa para hoje</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={handleEditClick} onViewDetail={setDetailTask} onSaveTemplate={saveTaskAsTemplate} />
              ))}
            </div>
          )}
        </div>

        <WeekCalendar tasks={tasks} />
      </div>

      <div className="mt-6">
        <UpcomingDeadlines tasks={tasks} />
      </div>

      <div className="mt-6">
        <HabitWidget />
      </div>

      <div className="mt-6">
        <Achievements />
      </div>

      {showForm && (
        <TaskForm
          initialData={editingTask}
          onClose={handleCancel}
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
          onSaveTemplate={saveTaskAsTemplate}
        />
      )}

      {overdueList.length > 0 && (
        <div className="mt-6 bg-red-50 dark:bg-red-950 rounded-xl border border-red-200 dark:border-red-900 p-5">
          <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Tarefas atrasadas
          </h3>
          <div className="space-y-2">
            {overdueList.map((task) => (
              <div key={task.id} className="flex items-center gap-3 text-sm py-1">
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <span className="flex-1 text-red-700 dark:text-red-400 line-through opacity-70">{task.title}</span>
                <span className="text-xs text-red-400 dark:text-red-500">
                    {formatDateTime(task.dueDate, task.dueTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg, to }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => to && navigate(to)}
      className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4 text-left w-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">{value}</p>
      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{label}</p>
    </button>
  )
}

function TaskRow({ task, onToggle, onEdit, onViewDetail, onSaveTemplate }) {
  const priority = PRIORITY_MAP[task.priority]
  return (
    <div className="flex items-center gap-3 py-1.5 group">
      <button
        onClick={() => onToggle(task.id)}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
        }`}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <span
        className={`flex-1 text-sm cursor-pointer hover:text-blue-600 transition-colors ${task.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-700 dark:text-gray-300'}`}
        onClick={() => onViewDetail && onViewDetail(task)}
      >
        {task.title}
      </span>
      {onSaveTemplate && (
        <button
          onClick={() => onSaveTemplate(task)}
          className="p-1 rounded text-slate-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 opacity-0 group-hover:opacity-100 transition-all"
          title="Salvar como template"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded text-slate-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      {priority && (
        <span className="text-[10px] font-semibold uppercase" style={{ color: priority.color }}>
          {priority.label}
        </span>
      )}
    </div>
  )
}
