import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import { PomodoroProvider } from './context/PomodoroContext'
import { HabitProvider } from './context/HabitContext'
import { TemplateProvider } from './context/TemplateContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <PomodoroProvider>
            <HabitProvider>
              <TemplateProvider>
                <App />
              </TemplateProvider>
            </HabitProvider>
          </PomodoroProvider>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
