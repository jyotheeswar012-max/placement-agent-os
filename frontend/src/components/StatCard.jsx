import React from 'react'
import clsx from 'clsx'

export default function StatCard({ label, value, change, icon: Icon, color = 'green' }) {
  const colors = {
    green:  { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
    blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  }
  const c = colors[color]
  return (
    <div className={clsx('rounded-xl p-5 border glass animate-slide-up', c.border)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', c.bg)}>
            <Icon size={16} className={c.text} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change && <p className={clsx('text-xs mt-1', change.startsWith('+') ? 'text-green-400' : 'text-red-400')}>{change}</p>}
    </div>
  )
}
