import { useState } from 'react'
import { Timer, Play, Pause, Square, SkipForward, Maximize2, X, ChevronDown } from 'lucide-react'
import { usePomodoro } from '../context/PomodoroContext'

export default function PomodoroWidget() {
  const {
    status, mode, timeRemaining, currentCycle, selectedTask,
    startFocus, pause, resume, stop, skipBreak,
    toggleFullScreen, formatTime, STATUS, MODE,
  } = usePomodoro()

  const [expanded, setExpanded] = useState(false)

  if (status === STATUS.IDLE && !expanded) return null

  const totalSeconds =
    mode === MODE.FOCUS
      ? 25 * 60
      : mode === MODE.SHORT_BREAK
        ? 5 * 60
        : 15 * 60
  const progress = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0
  const isFocus = mode === MODE.FOCUS
  const label = isFocus ? 'Foco' : mode === MODE.SHORT_BREAK ? 'Pausa' : 'Pausa longa'
  const isRunning = status === STATUS.RUNNING || status === STATUS.BREAK

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center"
          title={formatTime(timeRemaining)}
        >
          <Timer className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-700 p-4 w-64">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isFocus ? 'text-blue-500' : 'text-amber-500'}`}>
              {label}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleFullScreen}
                className="p-1 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                title="Tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="p-1 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center mb-3">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={isFocus ? '#3B82F6' : '#F59E0B'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute text-xl font-bold text-slate-800 dark:text-gray-100">{formatTime(timeRemaining)}</span>
          </div>

          {selectedTask && (
            <p className="text-xs text-slate-500 dark:text-gray-400 text-center truncate mb-3 px-2">
              {selectedTask.title}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mb-2">
            {isRunning ? (
              <button
                onClick={pause}
                className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                title="Pausar"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : status === STATUS.PAUSED ? (
              <button
                onClick={resume}
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                title="Continuar"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={stop}
              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              title="Parar"
            >
              <Square className="w-4 h-4" />
            </button>
            {status === STATUS.BREAK && (
              <button
                onClick={skipBreak}
                className="p-2 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                title="Pular pausa"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}
          </div>

          {isFocus && (
            <div className="flex items-center justify-center gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < currentCycle ? 'bg-blue-500' : 'bg-slate-200 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
