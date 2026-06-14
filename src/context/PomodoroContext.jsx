import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getSettings } from '../services/settings'
import * as pomodorosService from '../services/pomodoros'
import { incrementPomodoros } from '../services/gamification'

const PomodoroContext = createContext(null)

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.frequency.value = 660
    osc2.type = 'sine'
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.2)
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)
    osc2.start(ctx.currentTime + 0.2)
    osc2.stop(ctx.currentTime + 0.6)
  } catch {}
}

const STATUS = { IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused', BREAK: 'break' }
const MODE = { FOCUS: 'focus', SHORT_BREAK: 'shortBreak', LONG_BREAK: 'longBreak' }

export function PomodoroProvider({ children }) {
  const { user } = useAuth()
  const settings = getSettings()

  const [status, setStatus] = useState(STATUS.IDLE)
  const [mode, setMode] = useState(MODE.FOCUS)
  const [timeRemaining, setTimeRemaining] = useState(settings.pomodoroFocus * 60)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [selectedTask, setSelectedTask] = useState(null)
  const [completedToday, setCompletedToday] = useState(0)
  const [showFullScreen, setShowFullScreen] = useState(false)

  const intervalRef = useRef(null)

  useEffect(() => {
    if (!user) return
    pomodorosService.getTodayStats(user.id).then((stats) => {
      setCompletedToday(stats.count)
    })
  }, [user])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
  }, [clearTimer])

  const handleCompletion = useCallback(async () => {
    clearTimer()
    playBeep()

    if (mode === MODE.FOCUS) {
      if (user) {
        pomodorosService.saveSession({
          userId: user.id,
          taskId: selectedTask?.id || null,
          duration: settings.pomodoroFocus * 60,
          type: 'focus',
        })
      }
      incrementPomodoros()

      setCompletedToday((prev) => prev + 1)
      const newCycle = currentCycle + 1
      setCurrentCycle(newCycle)

      if (newCycle >= settings.pomodoroCycles) {
        setMode(MODE.LONG_BREAK)
        setTimeRemaining(settings.pomodoroLongBreak * 60)
      } else {
        setMode(MODE.SHORT_BREAK)
        setTimeRemaining(settings.pomodoroShortBreak * 60)
      }
      setStatus(STATUS.BREAK)
      startTimer()
    } else {
      setMode(MODE.FOCUS)
      setTimeRemaining(settings.pomodoroFocus * 60)
      setStatus(STATUS.IDLE)
    }
  }, [mode, currentCycle, selectedTask, user, settings, clearTimer, startTimer])

  useEffect(() => {
    if (timeRemaining > 0) return
    if (status !== STATUS.RUNNING && status !== STATUS.BREAK) return
    handleCompletion()
  }, [timeRemaining, status, handleCompletion])

  const startFocus = useCallback(
    (task = null) => {
      clearTimer()
      setSelectedTask(task)
      setMode(MODE.FOCUS)
      setTimeRemaining(settings.pomodoroFocus * 60)
      setCurrentCycle(0)
      setStatus(STATUS.RUNNING)
      startTimer()
    },
    [settings, clearTimer, startTimer]
  )

  const pause = useCallback(() => {
    clearTimer()
    setStatus(STATUS.PAUSED)
  }, [clearTimer])

  const resume = useCallback(() => {
    if (status === STATUS.PAUSED) {
      setStatus(STATUS.RUNNING)
      startTimer()
    }
  }, [status, startTimer])

  const stop = useCallback(() => {
    clearTimer()
    setStatus(STATUS.IDLE)
    setMode(MODE.FOCUS)
    setTimeRemaining(settings.pomodoroFocus * 60)
    setCurrentCycle(0)
    setSelectedTask(null)
  }, [settings, clearTimer])

  const skipBreak = useCallback(() => {
    clearTimer()
    setMode(MODE.FOCUS)
    setTimeRemaining(settings.pomodoroFocus * 60)
    setStatus(STATUS.IDLE)
  }, [settings, clearTimer])

  const toggleFullScreen = useCallback(() => {
    setShowFullScreen((prev) => !prev)
  }, [])

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [])

  const value = {
    status,
    mode,
    timeRemaining,
    currentCycle,
    selectedTask,
    completedToday,
    showFullScreen,
    STATUS,
    MODE,
    startFocus,
    pause,
    resume,
    stop,
    skipBreak,
    toggleFullScreen,
    setSelectedTask,
    formatTime,
  }

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext)
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider')
  return ctx
}
