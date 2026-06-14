import { useEffect, useCallback } from 'react'
import { Play, Pause, Square, SkipForward, X } from 'lucide-react'
import { usePomodoro } from '../context/PomodoroContext'

export default function PomodoroFullScreen() {
  const {
    status, mode, timeRemaining, currentCycle, selectedTask, showFullScreen,
    pause, resume, stop, skipBreak, toggleFullScreen,
    formatTime, STATUS, MODE,
  } = usePomodoro()

  const handleKeyDown = useCallback(
    (e) => {
      if (!showFullScreen) return
      if (e.key === 'Escape') toggleFullScreen()
      if (e.key === ' ') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
        e.preventDefault()
        if (status === STATUS.RUNNING || status === STATUS.BREAK) pause()
        else if (status === STATUS.PAUSED) resume()
      }
    },
    [showFullScreen, toggleFullScreen, status, pause, resume, STATUS]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!showFullScreen) return null

  const totalSeconds =
    mode === MODE.FOCUS
      ? 25 * 60
      : mode === MODE.SHORT_BREAK
        ? 5 * 60
        : 15 * 60
  const progress = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0
  const isFocus = mode === MODE.FOCUS
  const isRunning = status === STATUS.RUNNING || status === STATUS.BREAK

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center select-none">
      <button
        onClick={toggleFullScreen}
        className="absolute top-6 right-6 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
        title="Sair da tela cheia (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-sm font-medium uppercase tracking-widest mb-6 text-white/50">
        {isFocus ? 'Foco' : mode === MODE.SHORT_BREAK ? 'Pausa curta' : 'Pausa longa'}
      </div>

      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-72 h-72 -rotate-90 sm:w-80 sm:h-80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={isFocus ? '#3B82F6' : '#F59E0B'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute text-7xl sm:text-8xl font-bold text-white tabular-nums tracking-tight">
          {formatTime(timeRemaining)}
        </span>
      </div>

      {selectedTask && (
        <p className="text-lg text-white/60 mb-8 max-w-md text-center px-4">
          {selectedTask.title}
        </p>
      )}

      <div className="flex items-center gap-4">
        {isRunning ? (
          <button
            onClick={pause}
            className="w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
            title="Pausar (espaço)"
          >
            <Pause className="w-6 h-6" />
          </button>
        ) : status === STATUS.PAUSED ? (
          <button
            onClick={resume}
            className="w-14 h-14 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center justify-center"
            title="Continuar (espaço)"
          >
            <Play className="w-6 h-6" />
          </button>
        ) : null}
        <button
          onClick={stop}
          className="w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
          title="Parar"
        >
          <Square className="w-6 h-6" />
        </button>
        {status === STATUS.BREAK && (
          <button
            onClick={skipBreak}
            className="w-14 h-14 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
            title="Pular pausa"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        )}
      </div>

      {isFocus && (
        <div className="flex items-center gap-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < currentCycle ? 'bg-blue-500' : 'bg-white/20'}`}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-6 text-xs text-white/30">
        Espaço = pausar/continuar · ESC = sair
      </div>
    </div>
  )
}
