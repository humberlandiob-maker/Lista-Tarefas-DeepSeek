import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, CheckCircle2, Clock } from 'lucide-react'
import { CATEGORY_MAP, PRIORITY_MAP } from '../utils/constants'
import { formatDate } from '../utils/helpers'

const COLUMNS = [
  { id: 'pending', title: 'Pendentes', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-950/30' },
  { id: 'completed', title: 'Concluídas', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50/50 dark:bg-green-950/30' },
]

function SortableCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task.id),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const category = CATEGORY_MAP[task.category]
  const priority = PRIORITY_MAP[task.priority]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 p-3 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-slate-300 dark:text-gray-600 hover:text-slate-500 dark:hover:text-gray-400 flex-shrink-0">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-gray-100">{task.title}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {category && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.label}
              </span>
            )}
            {priority && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold"
                style={{ backgroundColor: priority.color + '20', color: priority.color }}
              >
                {priority.label}
              </span>
            )}
            {task.dueDate && (
              <span className="text-[10px] text-slate-400 dark:text-gray-500">{formatDate(task.dueDate)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Column({ column, tasks, onDrop }) {
  const taskIds = useMemo(() => tasks.map((t) => String(t.id)), [tasks])

  return (
    <div className={`rounded-xl border border-slate-200 dark:border-gray-700 ${column.bg} flex flex-col min-h-[300px]`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-gray-700">
        <column.icon className={`w-4 h-4 ${column.color}`} />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300">{column.title}</h3>
        <span className="ml-auto text-xs text-slate-400 dark:text-gray-500 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-gray-600">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 p-3 space-y-2 min-h-[200px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-slate-400 dark:text-gray-500">
            Arraste tarefas para cá
          </div>
        )}
      </div>
    </div>
  )
}

export default function KanbanBoard({ tasks, onToggle }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const { pendingTasks, completedTasks } = useMemo(() => ({
    pendingTasks: tasks.filter((t) => !t.completed),
    completedTasks: tasks.filter((t) => t.completed),
  }), [tasks])

  function handleDragStart(event) {
    setActiveId(event.active.id)
  }

  function handleDragEnd(event) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const taskId = Number(active.id)
    const activeColumn = tasks.find((t) => t.id === taskId)?.completed ? 'completed' : 'pending'
    const overId = over.id

    let targetColumn
    if (overId === 'pending' || overId === 'completed') {
      targetColumn = overId
    } else {
      const overTask = tasks.find((t) => String(t.id) === overId)
      if (overTask) targetColumn = overTask.completed ? 'completed' : 'pending'
      else return
    }

    if (activeColumn !== targetColumn) {
      onToggle(taskId)
    }
  }

  const activeTask = activeId ? tasks.find((t) => String(t.id) === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Column column={COLUMNS[0]} tasks={pendingTasks} />
        <Column column={COLUMNS[1]} tasks={completedTasks} />
      </div>

      <DragOverlay>
        {activeTask ? <SortableCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
