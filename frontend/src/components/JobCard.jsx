import React from 'react'
import { MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react'
import MatchScoreRing from './MatchScoreRing'
import clsx from 'clsx'

export default function JobCard({ job, onApply }) {
  const { title, company, location, job_type, salary_min, salary_max, match_score, required_skills = [] } = job
  return (
    <div className="glass rounded-xl p-5 border border-[#2e2e3e] hover:border-green-500/30 transition-all duration-200 animate-slide-up group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm group-hover:text-green-400 transition-colors">{title}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{company}</p>
        </div>
        {match_score !== undefined && <MatchScoreRing score={Math.round(match_score)} size={52} />}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {required_skills.slice(0, 4).map(s => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-xs border border-white/5">{s}</span>
        ))}
        {required_skills.length > 4 && (
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-xs">+{required_skills.length - 4}</span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1"><MapPin size={11} />{location}</span>
        <span className="flex items-center gap-1"><Clock size={11} />{job_type}</span>
        {salary_min && <span className="flex items-center gap-1"><DollarSign size={11} />₹{(salary_min/100000).toFixed(1)}–{(salary_max/100000).toFixed(1)} LPA</span>}
      </div>

      <button
        onClick={() => onApply?.(job)}
        className="w-full py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 hover:bg-green-500/20 transition-all"
      >
        Apply Now
      </button>
    </div>
  )
}
