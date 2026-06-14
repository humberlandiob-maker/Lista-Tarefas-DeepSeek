import { useMemo, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CATEGORY_MAP } from '../utils/constants'
import TaskCard from './TaskCard'
import EmptyState from './EmptyState'

function SortableTaskCard({ task, subtasks, onToggle, onDelete, onToggleRemind, onEdit, onToggleSubtask, onViewDetail }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        subtasks={subtasks}
        onToggle={onToggle}
        onDelete={onDelete}
        onToggleRemind={onToggleRemind}
        onEdit={onEdit}
        onToggleSubtask={onToggleSubtask}
        onViewDetail={onViewDetail}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

function TaskCardSimple({ task, subtasks, onToggle, onDelete, onToggleRemind, onEdit, onToggleSubtask, onViewDetail }) {
  return (
    <TaskCard
      task={task}
      subtasks={subtasks}
      onToggle={onToggle}
      onDelete={onDelete}
      onToggleRemind={onToggleRemind}
      onEdit={onEdit}
      onToggleSubtask={onToggleSubtask}
      onViewDetail={onViewDetail}
    />
  )
}

export default function TaskList({ tasks, onToggle, onDelete, onToggleRemind, onReorder, onEdit, onViewDetail, groupByCategory }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const { parents, subtaskMap } = useMemo(() => {
    const subs = {}
    const pars = []
    for (const t of tasks) {
      if (t.parentId) {
        if (!subs[t.parentId]) subs[t.parentId] = []
        subs[t.parentId].push(t)
      } else {
        pars.push(t)
      }
    }
    return { parents: pars, subtaskMap: subs }
  }, [tasks])

  const groupedParents = useMemo(() => {
    if (!groupByCategory) return null
    const groups = {}
    for (const t of parents) {
      const cat = t.category || 'outros'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(t)
    }
    return groups
  }, [parents, groupByCategory])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = parents.findIndex((t) => String(t.id) === active.id)
    const newIndex = parents.findIndex((t) => String(t.id) === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...parents]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    onReorder(reordered)
  }, [parents, onReorder])

  if (parents.length === 0) {
    return <EmptyState />
  }

  if (groupByCategory && groupedParents) {
    return (
      <div className="space-y-6">
        {Object.entries(groupedParents).map(([category, catTasks]) => {
          const cat = CATEGORY_MAP[category] || { label: category, color: '#6B7280' }
          catTasks.sort((a, b) => a.completed - b.completed)
          return (
            <div key={category}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3" style={{ backgroundColor: cat.color + '15' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
                  {cat.label}
                </span>
                <span className="text-xs ml-auto" style={{ color: cat.color + '99' }}>{catTasks.length} tarefa{catTasks.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-3">
                {catTasks.map((task) => (
                  <TaskCardSimple
                    key={task.id}
                    task={task}
                    subtasks={subtaskMap[task.id] || []}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onToggleRemind={onToggleRemind}
                    onEdit={onEdit}
                    onToggleSubtask={onToggle}
                    onViewDetail={onViewDetail}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={parents.map((t) => String(t.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {parents.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              subtasks={subtaskMap[task.id] || []}
              onToggle={onToggle}
              onDelete={onDelete}
              onToggleRemind={onToggleRemind}
              onEdit={onEdit}
              onToggleSubtask={onToggle}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
