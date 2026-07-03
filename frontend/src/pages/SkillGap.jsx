import React from 'react'
import { TrendingUp, BookOpen, ExternalLink } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

const GAP_DATA = [
  { skill: 'Docker',      current: 20, required: 80, course: 'Docker Mastery', url: 'https://udemy.com' },
  { skill: 'AWS',         current: 15, required: 75, course: 'AWS Cloud Practitioner', url: 'https://aws.amazon.com/training' },
  { skill: 'Kubernetes',  current: 0,  required: 60, course: 'Kubernetes for Beginners', url: 'https://udemy.com' },
  { skill: 'TypeScript',  current: 30, required: 70, course: 'TypeScript Handbook', url: 'https://typescriptlang.org' },
  { skill: 'System Design', current: 25, required: 85, course: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
]

const STRONG = [
  { skill: 'Python', score: 90 }, { skill: 'ML', score: 85 }, { skill: 'SQL', score: 80 },
  { skill: 'Pandas', score: 88 }, { skill: 'FastAPI', score: 75 }, { skill: 'Git', score: 82 }
]

export default function SkillGap() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Skill Gap Analyzer</h2>
        <p className="text-gray-500 text-sm mt-1">Compare your skills against top job requirements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strong Skills */}
        <div className="glass rounded-xl p-5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-400" />
            <h3 className="text-sm font-semibold text-white">Your Strong Skills</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={STRONG} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 10 }} width={60} />
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2e2e3e', color: '#e2e2e8', borderRadius: 8 }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {STRONG.map((_, i) => <Cell key={i} fill="#22c55e" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gap Chart */}
        <div className="glass rounded-xl p-5 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Skills to Learn</h3>
          </div>
          <div className="space-y-3">
            {GAP_DATA.map(item => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{item.skill}</span>
                  <span className="text-gray-500">{item.current}% / {item.required}% needed</span>
                </div>
                <div className="h-2 bg-[#2e2e3e] rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500/70 rounded-full" style={{ width: `${item.current}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Roadmap */}
      <div className="glass rounded-xl p-5 border border-[#2e2e3e]">
        <h3 className="text-sm font-semibold text-white mb-4">📚 Recommended Learning Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GAP_DATA.map(item => (
            <a key={item.skill} href={item.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-[#1a1a24] border border-[#2e2e3e] hover:border-green-500/30 transition-all group">
              <div>
                <p className="text-sm text-white font-medium">{item.course}</p>
                <p className="text-xs text-gray-500 mt-0.5">Fill gap for: {item.skill}</p>
              </div>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-green-400 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
