import { useMemo, useState, useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import { CATEGORIES, PRIORITIES } from '../utils/constants'
import { ListTodo, CheckCircle2, Clock, AlertCircle, Timer } from 'lucide-react'
import { usePomodoro } from '../context/PomodoroContext'
import { useAuth } from '../context/AuthContext'
import * as pomodorosService from '../services/pomodoros'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts'
import { format, startOfWeek, addDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const COLORS = ['#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EF4444', '#EC4899']

const RADIAN = Math.PI / 180

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const radius = outerRadius * 1.35
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  )
}

export default function AnalisesPage() {
  const { tasks } = useTasks()
  const { completedToday } = usePomodoro()
  const { user } = useAuth()
  const [pomodoroWeek, setPomodoroWeek] = useState([])

  useEffect(() => {
    if (!user) return
    pomodorosService.getWeekStats(user.id).then(setPomodoroWeek)
  }, [user])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = total - completed
    const overdue = tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false
      return parseISO(t.dueDate) < new Date()
    }).length
    return { total, completed, pending, overdue }
  }, [tasks])

  const weeklyData = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => {
      const day = addDays(start, i)
      const dateStr = format(day, 'yyyy-MM-dd')
      return {
        name: format(day, 'EEE', { locale: ptBR }),
        Criadas: tasks.filter((t) => t.createdAt?.slice(0, 10) === dateStr).length,
        Concluídas: tasks.filter((t) => t.completed && t.dueDate === dateStr).length,
        Atrasadas: tasks.filter((t) => {
          if (t.completed || !t.dueDate) return false
          return t.dueDate === dateStr && parseISO(t.dueDate) < new Date()
        }).length,
      }
    })
  }, [tasks])

  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat.label,
      value: tasks.filter((t) => t.category === cat.value && t.completed).length,
      total: tasks.filter((t) => t.category === cat.value).length,
      color: cat.color,
    }))
  }, [tasks])

  const priorityData = useMemo(() => {
    return PRIORITIES.map((pri) => ({
      name: pri.label,
      value: tasks.filter((t) => t.priority === pri.value).length,
      color: pri.color,
    }))
  }, [tasks])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-gray-100 mb-6">Análises</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <StatCard icon={ListTodo} label="Total" value={stats.total} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard icon={Clock} label="Pendentes" value={stats.pending} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-900/30" />
        <StatCard icon={CheckCircle2} label="Concluídas" value={stats.completed} color="text-green-500" bg="bg-green-50 dark:bg-green-900/30" />
        <StatCard icon={AlertCircle} label="Atrasadas" value={stats.overdue} color="text-red-500" bg="bg-red-50 dark:bg-red-900/30" />
        <StatCard icon={Timer} label="Foco Hoje" value={completedToday} color="text-green-500" bg="bg-green-50 dark:bg-green-900/30" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Semanal</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
            <Tooltip />
            <Bar dataKey="Criadas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Concluídas" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Atrasadas" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {pomodoroWeek.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Pomodoros por Dia</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pomodoroWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94A3B8" tickFormatter={(val) => val?.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" allowDecimals={false} />
              <Tooltip labelFormatter={(val) => val} />
              <Bar dataKey="count" name="Pomodoros" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Produtividade por Categoria</h2>
          <div className="space-y-3">
            {categoryData.map((cat) => {
              const pct = cat.total > 0 ? Math.round((cat.value / cat.total) * 100) : 0
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 dark:text-gray-400">{cat.name}</span>
                    <span className="text-slate-400 dark:text-gray-500">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Tarefas por Prioridade</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={renderPieLabel} labelLine>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4">
      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">{value}</p>
      <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
