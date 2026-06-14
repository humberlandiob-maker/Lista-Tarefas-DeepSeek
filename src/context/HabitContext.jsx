import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import * as habitsService from '../services/habits'
import { useAuth } from './AuthContext'
import { checkStreak } from '../services/gamification'

const HabitContext = createContext(null)

const ACTIONS = {
  SET_HABITS: 'SET_HABITS',
  ADD_HABIT: 'ADD_HABIT',
  UPDATE_HABIT: 'UPDATE_HABIT',
  DELETE_HABIT: 'DELETE_HABIT',
  LOG_HABIT: 'LOG_HABIT',
}

function habitReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_HABITS:
      return action.payload
    case ACTIONS.ADD_HABIT:
      return [...state, action.payload]
    case ACTIONS.UPDATE_HABIT:
      return state.map((h) =>
        h.id === action.payload.id ? { ...h, ...action.payload.data } : h
      )
    case ACTIONS.DELETE_HABIT:
      return state.filter((h) => h.id !== action.payload)
    case ACTIONS.LOG_HABIT:
      return state.map((h) =>
        h.id === action.payload.habitId
          ? { ...h, todayCount: action.payload.count }
          : h
      )
    default:
      return state
  }
}

export function HabitProvider({ children }) {
  const { user } = useAuth()
  const [habits, dispatch] = useReducer(habitReducer, [])

  useEffect(() => {
    if (!user) return
    checkStreak()
    habitsService.getHabits(user.id).then((data) => {
      dispatch({ type: ACTIONS.SET_HABITS, payload: data })
    })
  }, [user])

  const addHabit = useCallback(
    async (habit) => {
      if (!user) return null
      const data = await habitsService.createHabit(habit, user.id)
      if (data) {
        dispatch({ type: ACTIONS.ADD_HABIT, payload: data })
      }
      return data
    },
    [user]
  )

  const editHabit = useCallback(async (id, updates) => {
    const data = await habitsService.updateHabit(id, updates)
    if (data) {
      dispatch({ type: ACTIONS.UPDATE_HABIT, payload: { id, data: updates } })
    }
    return data
  }, [])

  const removeHabit = useCallback(async (id) => {
    const ok = await habitsService.deleteHabit(id)
    if (ok) {
      dispatch({ type: ACTIONS.DELETE_HABIT, payload: id })
    }
    return ok
  }, [])

  const toggleHabitLog = useCallback(
    async (habitId, date) => {
      if (!user) return
      const habit = habits.find((h) => h.id === habitId)
      if (!habit) return

      const newCount = habit.todayCount > 0 ? 0 : 1
      const log = await habitsService.logHabit(habitId, user.id, date, newCount)
      if (log) {
        dispatch({ type: ACTIONS.LOG_HABIT, payload: { habitId, count: newCount } })
      }
    },
    [user, habits]
  )

  return (
    <HabitContext.Provider
      value={{ habits, addHabit, editHabit, removeHabit, toggleHabitLog }}
    >
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits must be used within HabitProvider')
  return ctx
}
