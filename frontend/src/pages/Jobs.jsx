import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import JobCard from '../components/JobCard'
import toast from 'react-hot-toast'

const SAMPLE_JOBS = [
  { id: 1, title: 'Data Scientist', company: 'Google', location: 'Bangalore', job_type: 'Full-time', salary_min: 1200000, salary_max: 2500000, required_skills: ['python', 'machine learning', 'sql', 'pandas', 'tensorflow'], match_score: 92 },
  { id: 2, title: 'Backend Developer', company: 'Razorpay', location: 'Bangalore', job_type: 'Full-time', salary_min: 800000, salary_max: 1600000, required_skills: ['python', 'fastapi', 'postgresql', 'docker', 'redis'], match_score: 78 },
  { id: 3, title: 'ML Engineer Intern', company: 'Swiggy', location: 'Remote', job_type: 'Internship', salary_min: 30000, salary_max: 60000, required_skills: ['python', 'scikit-learn', 'pandas', 'numpy'], match_score: 95 },
  { id: 4, title: 'React Developer', company: 'Zoho', location: 'Chennai', job_type: 'Full-time', salary_min: 600000, salary_max: 1200000, required_skills: ['javascript', 'react', 'typescript', 'node.js'], match_score: 64 },
  { id: 5, title: 'DevOps Engineer', company: 'Amazon', location: 'Hyderabad', job_type: 'Full-time', salary_min: 1000000, salary_max: 2000000, required_skills: ['docker', 'kubernetes', 'aws', 'linux', 'git'], match_score: 55 },
  { id: 6, title: 'Data Analyst', company: 'Flipkart', location: 'Bangalore', job_type: 'Full-time', salary_min: 700000, salary_max: 1400000, required_skills: ['sql', 'python', 'tableau', 'excel', 'pandas'], match_score: 88 },
]

export default function Jobs() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = SAMPLE_JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || j.job_type === filter
    return matchSearch && matchFilter
  })

  const handleApply = (job) => toast.success(`Applied to ${job.title} @ ${job.company}!`)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Job Matches</h2>
        <p className="text-gray-500 text-sm mt-1">AI-ranked jobs based on your skill profile</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs or companies..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#111118] border border-[#2e2e3e] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Full-time', 'Internship'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === f ? 'bg-green-500 text-white' : 'bg-[#111118] border border-[#2e2e3e] text-gray-400 hover:text-white'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(job => <JobCard key={job.id} job={job} onApply={handleApply} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">🔍</p>
            <p>No jobs match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
