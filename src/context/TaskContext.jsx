import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'
import { getNextRecurringDate } from '../utils/helpers'
import { useAuth } from './AuthContext'

const TaskContext = createContext(null)

const ACTIONS = {
  SET: 'SET',
  ADD: 'ADD',
  ADD_MANY: 'ADD_MANY',
  TOGGLE: 'TOGGLE',
  TOGGLE_REMIND: 'TOGGLE_REMIND',
  DELETE: 'DELETE',
  DELETE_MANY: 'DELETE_MANY',
  EDIT: 'EDIT',
  REORDER: 'REORDER',
}

function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload
    case ACTIONS.ADD:
      return [action.payload, ...state]
    case ACTIONS.ADD_MANY:
      return [...action.payload, ...state]
    case ACTIONS.TOGGLE:
      return state.map((t) =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      )
    case ACTIONS.TOGGLE_REMIND:
      return state.map((t) =>
        t.id === action.payload ? { ...t, remindMe: !t.remindMe } : t
      )
    case ACTIONS.EDIT:
      return state.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload.data } : t
      )
    case ACTIONS.DELETE:
      return state.filter((t) => t.id !== action.payload)
    case ACTIONS.DELETE_MANY:
      return state.filter((t) => !action.payload.includes(t.id))
    case ACTIONS.REORDER:
      return action.payload
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const { user } = useAuth()
  const [tasks, dispatch] = useReducer(taskReducer, [])

  useEffect(() => {
    if (user) {
      storage.getTasks(user.id).then((data) => {
        dispatch({ type: ACTIONS.SET, payload: data })
      })
    } else {
      dispatch({ type: ACTIONS.SET, payload: [] })
    }
  }, [user])

  const addTask = useCallback(async (data, subtaskTitles = [], startFocusFlag = false, tagIds = []) => {
    if (!user) return null
    const task = await storage.createTask(data, user.id, tagIds)
    if (task) {
      dispatch({ type: ACTIONS.ADD, payload: task })

      if (subtaskTitles.length > 0) {
        const subtasks = await storage.createSubtasks(subtaskTitles, task.id, user.id)
        if (subtasks.length > 0) {
          dispatch({ type: ACTIONS.ADD_MANY, payload: subtasks })
        }
      }

      return task
    }
    return null
  }, [user])

  const toggleTask = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    if (task.completed) {
      const updated = await storage.updateTask(id, { completed: false })
      if (updated) dispatch({ type: ACTIONS.TOGGLE, payload: id })
      return
    }

    const updated = await storage.updateTask(id, { completed: true })
    if (updated) {
      dispatch({ type: ACTIONS.TOGGLE, payload: id })

      if (task.repeatRule) {
        const nextDate = getNextRecurringDate(task.dueDate, task.repeatRule)
        if (nextDate) {
          const newTask = await storage.createTask({
            title: task.title,
            description: task.description,
            category: task.category,
            priority: task.priority,
            dueDate: nextDate,
            remindMe: task.remindMe,
            repeatRule: task.repeatRule,
            parentId: task.parentId,
          }, user.id, (task.tags || []).map((t) => t.id))
          if (newTask) {
            dispatch({ type: ACTIONS.ADD, payload: newTask })
          }
        }
      }
    }
  }, [tasks, user])

  const editTask = useCallback(async (id, data, tagIds) => {
    const updated = await storage.updateTask(id, {
      title: data.title,
      description: data.description || null,
      category: data.category,
      priority: data.priority,
      due_date: data.dueDate || null,
      due_time: data.dueTime || null,
      repeat_rule: data.repeatRule || null,
    }, tagIds)
    if (updated) {
      dispatch({ type: ACTIONS.EDIT, payload: { id, data: { ...data, tags: updated.tags || data.tags } } })
    }
  }, [])

  const toggleRemind = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const updated = await storage.updateTask(id, { remind_me: !task.remindMe })
    if (updated) {
      dispatch({ type: ACTIONS.TOGGLE_REMIND, payload: id })
    }
  }, [tasks])

  const deleteTask = useCallback(async (id) => {
    const childIds = tasks.filter((t) => t.parentId === id).map((t) => t.id)
    const ok = await storage.deleteTask(id)
    if (ok) {
      if (childIds.length > 0) {
        dispatch({ type: ACTIONS.DELETE_MANY, payload: [id, ...childIds] })
      } else {
        dispatch({ type: ACTIONS.DELETE, payload: id })
      }
    }
  }, [tasks])

  const reorderTasks = useCallback(async (reordered) => {
    dispatch({ type: ACTIONS.REORDER, payload: reordered })
    const ids = reordered.map((t) => t.id)
    await storage.reorderTasks(ids)
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, toggleRemind, editTask, deleteTask, reorderTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
