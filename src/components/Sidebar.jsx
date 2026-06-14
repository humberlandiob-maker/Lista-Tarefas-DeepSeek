import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListTodo, BarChart3, Calendar, Settings, LogOut, Menu, X, Sun, Moon, RotateCcw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import NotificationBell from './NotificationBell'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tarefas', label: 'Tarefas', icon: ListTodo },
  { to: '/habitos', label: 'Hábitos', icon: RotateCcw },
  { to: '/analises', label: 'Análises', icon: BarChart3 },
  { to: '/calendario', label: 'Calendário', icon: Calendar },
  { to: '/configuracoes', label: 'Configurações', icon: Settings, divider: true },
]

export default function Sidebar() {
  const { displayName, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm"
      >
        <Menu className="w-5 h-5 text-slate-600 dark:text-gray-400" />
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-gray-100">Minhas Tarefas</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map(({ to, label, icon: Icon, divider }) => (
            <div key={to}>
              {divider && <div className="my-2 border-t border-slate-200 dark:border-gray-800" />}
              <NavLink
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2">
            <NotificationBell />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300 truncate">{displayName}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors mt-1"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}
