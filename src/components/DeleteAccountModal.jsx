import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import * as accountService from '../services/account'

const STEPS = {
  VERIFY: 0,
  WARNING: 1,
  CONFIRM: 2,
}

export default function DeleteAccountModal({ onClose }) {
  const { user, displayName } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.VERIFY)
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await accountService.deleteAccount(email, password)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {step > STEPS.VERIFY && (
              <button onClick={() => setStep(step - 1)} className="p-1 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">Excluir conta</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {step === STEPS.VERIFY && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-gray-400">Confirme sua identidade informando seus dados de acesso.</p>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" required />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
              <button type="button" onClick={() => setStep(STEPS.WARNING)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors">Continuar</button>
            </div>
          </form>
        )}

        {step === STEPS.WARNING && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-gray-100 mb-2">Isso é irreversível!</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">
                Todos os seus dados serão excluídos permanentemente:
              </p>
              <ul className="text-sm text-slate-500 dark:text-gray-400 mt-3 space-y-1">
                <li>• Todas as suas tarefas</li>
                <li>• Categorias personalizadas</li>
                <li>• Perfil e progresso</li>
                <li>• Dados de gamificação</li>
              </ul>
              <p className="text-sm text-slate-500 dark:text-gray-400 mt-3 font-medium">
                Não será possível restaurar nada.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(STEPS.VERIFY)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">Voltar</button>
              <button onClick={() => setStep(STEPS.CONFIRM)} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors">Entendi, continuar</button>
            </div>
          </div>
        )}

        {step === STEPS.CONFIRM && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-gray-400 text-center py-2">
              Deseja realmente excluir sua conta <strong>{displayName}</strong>?
            </p>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(STEPS.WARNING)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-gray-600 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">Não</button>
              <button onClick={handleVerify} disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60 transition-colors">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sim, excluir
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-1 mt-5">
          {[0, 1, 2].map((s) => (
            <span key={s} className={`w-1.5 h-1.5 rounded-full ${step === s ? 'bg-red-500' : 'bg-slate-300 dark:bg-gray-600'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
