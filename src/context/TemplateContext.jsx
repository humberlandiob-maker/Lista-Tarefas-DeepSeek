import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import * as templatesService from '../services/templates'
import { useAuth } from './AuthContext'

const TemplateContext = createContext(null)

const ACTIONS = {
  SET: 'SET',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
}

function templateReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload
    case ACTIONS.ADD:
      return [...state, action.payload]
    case ACTIONS.UPDATE:
      return state.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload.data } : t
      )
    case ACTIONS.DELETE:
      return state.filter((t) => t.id !== action.payload)
    default:
      return state
  }
}

export function TemplateProvider({ children }) {
  const { user } = useAuth()
  const [templates, dispatch] = useReducer(templateReducer, [])

  useEffect(() => {
    if (!user) return
    templatesService.getTemplates(user.id).then((data) => {
      dispatch({ type: ACTIONS.SET, payload: data })
    })
  }, [user])

  const addTemplate = useCallback(
    async (data) => {
      if (!user) return null
      const t = await templatesService.createTemplate(data, user.id)
      if (t) {
        dispatch({ type: ACTIONS.ADD, payload: t })
      }
      return t
    },
    [user]
  )

  const editTemplate = useCallback(async (id, updates) => {
    const t = await templatesService.updateTemplate(id, updates)
    if (t) {
      dispatch({ type: ACTIONS.UPDATE, payload: { id, data: updates } })
    }
    return t
  }, [])

  const removeTemplate = useCallback(async (id) => {
    const ok = await templatesService.deleteTemplate(id)
    if (ok) {
      dispatch({ type: ACTIONS.DELETE, payload: id })
    }
    return ok
  }, [])

  return (
    <TemplateContext.Provider
      value={{ templates, addTemplate, editTemplate, removeTemplate }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplates() {
  const ctx = useContext(TemplateContext)
  if (!ctx) throw new Error('useTemplates must be used within TemplateProvider')
  return ctx
}
