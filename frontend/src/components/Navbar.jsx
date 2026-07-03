import React from 'react'
import { Menu, Bell, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#111118] border-b border-[#2e2e3e] shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="text-gray-400 hover:text-white transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="text-white font-semibold text-sm hidden md:block">Placement Agent OS</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-[#2e2e3e]">
          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
            <User size={14} className="text-green-400" />
          </div>
          <span className="text-sm text-gray-300 hidden md:block">{user?.name || 'Student'}</span>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors ml-1">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
