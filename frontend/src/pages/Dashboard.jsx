import React from 'react'
import { Users, Briefcase, TrendingUp, Award } from 'lucide-react'
import StatCard from '../components/StatCard'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const skillData = [
  { skill: 'Python', score: 90 }, { skill: 'ML', score: 80 }, { skill: 'SQL', score: 75 },
  { skill: 'React', score: 65 }, { skill: 'Docker', score: 50 }, { skill: 'AWS', score: 45 }
]

const radarData = [
  { subject: 'Technical', A: 85 }, { subject: 'Communication', A: 70 }, { subject: 'DSA', A: 65 },
  { subject: 'System Design', A: 55 }, { subject: 'Projects', A: 90 }, { subject: 'Certifications', A: 75 }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Welcome back, Jyotheeswar 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's your career overview for today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Match Score" value="87%" change="+5% this week" icon={Award} color="green" />
        <StatCard label="Jobs Applied" value="12" change="+3 this week" icon={Briefcase} color="blue" />
        <StatCard label="Shortlisted" value="4" change="+1 this week" icon={TrendingUp} color="purple" />
        <StatCard label="Profile Score" value="73/100" change="+8 pts" icon={Users} color="orange" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5 border border-[#2e2e3e]">
          <h3 className="text-sm font-semibold text-white mb-4">Skill Strengths</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 11 }} width={55} />
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2e2e3e', borderRadius: 8, color: '#e2e2e8' }} />
              <Bar dataKey="score" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5 border border-[#2e2e3e]">
          <h3 className="text-sm font-semibold text-white mb-4">Readiness Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2e2e3e" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Radar dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-xl p-5 border border-[#2e2e3e]">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Applied to ML Engineer @ Swiggy', time: '2h ago', status: 'applied', color: 'blue' },
            { action: 'Shortlisted for Data Scientist @ Google', time: '1d ago', status: 'shortlisted', color: 'green' },
            { action: 'Resume scored 87/100 by ATS Checker', time: '2d ago', status: 'scored', color: 'purple' },
            { action: 'Skill Gap: Docker & AWS identified', time: '3d ago', status: 'gap', color: 'orange' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#2e2e3e] last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
                <p className="text-sm text-gray-300">{item.action}</p>
              </div>
              <span className="text-xs text-gray-600">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
