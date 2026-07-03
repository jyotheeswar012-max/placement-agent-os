import React, { useState } from 'react'
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react'
import MatchScoreRing from '../components/MatchScoreRing'

const STATUSES = {
  applied:     { label: 'Applied',     color: 'blue',   icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'green',  icon: CheckCircle },
  rejected:    { label: 'Rejected',    color: 'red',    icon: XCircle },
  hired:       { label: 'Hired',       color: 'yellow', icon: Trophy },
}

const APPS = [
  { id: 1, title: 'Data Scientist', company: 'Google', status: 'shortlisted', match_score: 92, ats_score: 85, applied_at: '2026-06-28' },
  { id: 2, title: 'ML Engineer Intern', company: 'Swiggy', status: 'applied', match_score: 95, ats_score: 80, applied_at: '2026-07-01' },
  { id: 3, title: 'Backend Developer', company: 'Razorpay', status: 'rejected', match_score: 78, ats_score: 70, applied_at: '2026-06-20' },
  { id: 4, title: 'Data Analyst', company: 'Flipkart', status: 'applied', match_score: 88, ats_score: 82, applied_at: '2026-07-02' },
]

export default function Applications() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? APPS : APPS.filter(a => a.status === filter)
  const stats = { total: APPS.length, shortlisted: APPS.filter(a => a.status === 'shortlisted').length, rejected: APPS.filter(a => a.status === 'rejected').length, hired: APPS.filter(a => a.status === 'hired').length }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Application Tracker</h2>
        <p className="text-gray-500 text-sm mt-1">Track all your job applications in one place</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[['Total', stats.total, 'gray'], ['Shortlisted', stats.shortlisted, 'green'], ['Rejected', stats.rejected, 'red'], ['Hired', stats.hired, 'yellow']].map(([label, val, color]) => (
          <div key={label} className={`glass rounded-xl p-4 border border-${color}-500/20 text-center`}>
            <p className={`text-2xl font-bold text-${color}-400`}>{val}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', ...Object.keys(STATUSES)].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              filter === s ? 'bg-green-500 text-white' : 'bg-[#111118] border border-[#2e2e3e] text-gray-400 hover:text-white'
            }`}>{s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-xl border border-[#2e2e3e] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2e2e3e]">
              {['Job', 'Company', 'Match', 'ATS', 'Applied', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => {
              const S = STATUSES[app.status]
              return (
                <tr key={app.id} className="border-b border-[#2e2e3e] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{app.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{app.company}</td>
                  <td className="px-4 py-3"><MatchScoreRing score={app.match_score} size={38} /></td>
                  <td className="px-4 py-3"><MatchScoreRing score={app.ats_score} size={38} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{app.applied_at}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${S.color}-500/10 text-${S.color}-400 border border-${S.color}-500/20`}>
                      {S.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
