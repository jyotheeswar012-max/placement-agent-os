import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import ResumeUpload from './pages/ResumeUpload'
import Applications from './pages/Applications'
import InterviewPrep from './pages/InterviewPrep'
import SkillGap from './pages/SkillGap'
import AgentQuorum from './pages/AgentQuorum'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './context/AuthContext'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a24', color: '#e2e2e8', border: '1px solid #2e2e3e' }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="resume" element={<ResumeUpload />} />
            <Route path="applications" element={<Applications />} />
            <Route path="interview" element={<InterviewPrep />} />
            <Route path="skill-gap" element={<SkillGap />} />
            <Route path="agent-quorum" element={<AgentQuorum />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
