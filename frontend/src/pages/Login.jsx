import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Target, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', university: 'Manipal University Jaipur', department: 'Data Science' })
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Demo login — replace with real API call
    login({ name: form.name || 'Jyotheeswar', email: form.email, id: 1 }, 'demo_token')
    toast.success('Welcome to Placement Agent OS!')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">Placement Agent OS</h1>
            <p className="text-gray-500 text-xs">Career Navigation Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 border border-[#2e2e3e]">
          {/* Tabs */}
          <div className="flex rounded-lg bg-[#1a1a24] p-1 mb-6">
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                  tab === t ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                }`}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {tab === 'register' && (
              <input name="name" placeholder="Full Name" value={form.name} onChange={handle}
                className="w-full bg-[#1a1a24] border border-[#2e2e3e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50" />
            )}
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} required
              className="w-full bg-[#1a1a24] border border-[#2e2e3e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50" />
            <div className="relative">
              <input name="password" type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handle} required
                className="w-full bg-[#1a1a24] border border-[#2e2e3e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 pr-10" />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button type="submit"
              className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors">
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-600 mt-4">Manipal University Jaipur · B.Tech Data Science 2026</p>
      </div>
    </div>
  )
}
