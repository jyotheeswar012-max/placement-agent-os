import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileText,
  ClipboardList, MessageSquare, TrendingUp, Target
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs',        icon: Briefcase,        label: 'Jobs' },
  { to: '/resume',      icon: FileText,         label: 'Resume' },
  { to: '/applications',icon: ClipboardList,    label: 'Applications' },
  { to: '/interview',   icon: MessageSquare,    label: 'Interview Prep' },
  { to: '/skill-gap',   icon: TrendingUp,       label: 'Skill Gap' },
]

export default function Sidebar({ open }) {
  return (
    <aside className={clsx(
      'flex flex-col bg-[#111118] border-r border-[#2e2e3e] transition-all duration-300 shrink-0',
      open ? 'w-56' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2e2e3e]">
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
          <Target size={16} className="text-white" />
        </div>
        {open && <span className="font-semibold text-white text-sm tracking-wide">Placement OS</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
              isActive
                ? 'bg-green-500/10 text-green-400 font-medium'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            )}
          >
            <Icon size={18} className="shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {open && (
        <div className="px-4 py-4 border-t border-[#2e2e3e]">
          <p className="text-xs text-gray-600 font-mono">v1.0.0 · MUJ 2026</p>
        </div>
      )}
    </aside>
  )
}
