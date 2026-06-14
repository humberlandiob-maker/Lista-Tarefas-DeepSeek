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

export default function TaskList({ tasks, onToggle, onDelete, onToggleRemind, onReorder, onEdit, onViewDetail }) {
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
