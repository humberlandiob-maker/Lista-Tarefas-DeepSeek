import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import PomodoroWidget from './components/PomodoroWidget'
import PomodoroFullScreen from './components/PomodoroFullScreen'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TarefasPage from './pages/TarefasPage'
import AnalisesPage from './pages/AnalisesPage'
import CalendarioPage from './pages/CalendarioPage'
import ConfiguracoesPage from './pages/ConfiguracoesPage'
import HabitsPage from './pages/HabitsPage'
import { useTheme } from './hooks/useTheme'

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
      <PomodoroWidget />
      <PomodoroFullScreen />
    </ProtectedRoute>
  )
}

export default function App() {
  useTheme()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/tarefas" element={<ProtectedLayout><TarefasPage /></ProtectedLayout>} />
        <Route path="/analises" element={<ProtectedLayout><AnalisesPage /></ProtectedLayout>} />
        <Route path="/calendario" element={<ProtectedLayout><CalendarioPage /></ProtectedLayout>} />
        <Route path="/habitos" element={<ProtectedLayout><HabitsPage /></ProtectedLayout>} />
        <Route path="/configuracoes" element={<ProtectedLayout><ConfiguracoesPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
