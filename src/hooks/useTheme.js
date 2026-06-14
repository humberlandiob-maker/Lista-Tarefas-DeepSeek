import { useState, useEffect, useCallback } from 'react'
import { getSettings, saveSettings } from '../services/settings'

export function useTheme() {
  const [theme, setTheme] = useState(() => getSettings().theme || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      const current = getSettings()
      saveSettings({ ...current, theme: next })
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
