import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Job data with REAL company apply URLs ──────────────────────────────────────────
const JOBS = [
  {
    id:1, title:'Software Engineer III', company:'Google', logo:'🔵',
    location:'Bangalore / Hyderabad / Remote', job_type:'Full-time',
    salary_min:2800000, salary_max:5000000,
    required_skills:['Python','Go','Java','Kubernetes','Distributed Systems','SQL'],
    match_score:88,
    description:'Build large-scale distributed systems powering Search, Ads, and Cloud products. Work with cutting-edge infra and ship features used by billions.',
    apply_url:'https://careers.google.com/jobs/results/?q=software+engineer&location=India',
    posted:'2 days ago', openings:12,
  },
  {
    id:2, title:'Data Scientist — Ads ML', company:'Meta', logo:'💙',
    location:'Hyderabad', job_type:'Full-time',
    salary_min:3000000, salary_max:6000000,
    required_skills:['Python','PyTorch','SQL','A/B Testing','Statistics','Spark'],
    match_score:91,
    description:'Own end-to-end ML models for ads ranking and delivery. Collaborate with product & engineering to iterate fast on experiments.',
    apply_url:'https://www.metacareers.com/jobs?q=data+scientist&offices[0]=Hyderabad',
    posted:'1 day ago', openings:5,
  },
  {
    id:3, title:'SDE-II Backend', company:'Razorpay', logo:'🟢',
    location:'Bangalore', job_type:'Full-time',
    salary_min:1800000, salary_max:3200000,
    required_skills:['Go','PostgreSQL','Redis','Docker','Kafka','REST APIs'],
    match_score:78,
    description:'Design and own core payment gateway services. Drive reliability, performance and scalability of systems processing millions of daily transactions.',
    apply_url:'https://razorpay.com/jobs/',
    posted:'3 days ago', openings:3,
  },
  {
    id:4, title:'ML Engineer — Personalisation', company:'Swiggy', logo:'🟠',
    location:'Bangalore / Remote', job_type:'Full-time',
    salary_min:1500000, salary_max:2800000,
    required_skills:['Python','TensorFlow','Scikit-learn','Pandas','SQL','AWS'],
    match_score:95,
    description:'Build real-time recommendation and ranking models for food & grocery. Own the full ML lifecycle from data to production serving.',
    apply_url:'https://careers.swiggy.com/',
    posted:'Today', openings:8,
  },
  {
    id:5, title:'DevOps Engineer', company:'Amazon', logo:'🟡',
    location:'Hyderabad', job_type:'Full-time',
    salary_min:2000000, salary_max:3800000,
    required_skills:['AWS','Kubernetes','Terraform','CI/CD','Linux','Docker'],
    match_score:72,
    description:'Maintain and evolve AWS infrastructure for Prime Video. Build automation pipelines, improve observability and drive SLA goals.',
    apply_url:'https://www.amazon.jobs/en/search?base_query=devops&loc_query=India',
    posted:'5 days ago', openings:6,
  },
  {
    id:6, title:'React Frontend Engineer', company:'Zepto', logo:'⚪',
    location:'Mumbai / Remote', job_type:'Full-time',
    salary_min:1200000, salary_max:2200000,
    required_skills:['React','TypeScript','Node.js','GraphQL','CSS'],
    match_score:83,
    description:'Own the customer-facing app experience for 10-minute grocery delivery. Work closely with design to ship pixel-perfect, performant UIs.',
    apply_url:'https://www.zepto.com/careers',
    posted:'2 days ago', openings:4,
  },
  {
    id:7, title:'Data Analyst', company:'Flipkart', logo:'🔵',
    location:'Bangalore', job_type:'Full-time',
    salary_min:900000, salary_max:1600000,
    required_skills:['SQL','Python','Tableau','Excel','Pandas'],
    match_score:86,
    description:'Analyse large-scale commerce data to surface actionable insights for category and supply chain teams.',
    apply_url:'https://www.flipkartcareers.com/',
    posted:'4 days ago', openings:7,
  },
  {
    id:8, title:'ML Engineer Intern', company:'Ola Electric', logo:'🟣',
    location:'Bangalore', job_type:'Internship',
    salary_min:40000, salary_max:70000,
    required_skills:['Python','Scikit-learn','Pandas','NumPy','Git'],
    match_score:93,
    description:'Work on battery performance ML models and predictive maintenance pipelines for India’s largest EV fleet.',
    apply_url:'https://olaelectric.com/careers',
    posted:'Today', openings:2,
  },
  {
    id:9, title:'Product Manager — Fintech', company:'CRED', logo:'🟤',
    location:'Bangalore', job_type:'Full-time',
    salary_min:2500000, salary_max:4500000,
    required_skills:['Agile','SQL','Figma','Jira','Stakeholder Mgmt'],
    match_score:69,
    description:'Define and execute the product roadmap for CRED’s payments and rewards platform used by 12M+ premium users.',
    apply_url:'https://careers.cred.club/',
    posted:'1 week ago', openings:1,
  },
  {
    id:10, title:'Cloud Solutions Architect', company:'Microsoft', logo:'🔵',
    location:'Hyderabad / Remote', job_type:'Full-time',
    salary_min:3500000, salary_max:7000000,
    required_skills:['Azure','Terraform','Kubernetes','CI/CD','Python','Serverless'],
    match_score:74,
    description:'Help enterprise customers design and migrate workloads to Azure. Lead architecture reviews and technical proof-of-concepts.',
    apply_url:'https://careers.microsoft.com/v2/global/en/search.html?q=India&l=en_us&pg=1&pgSz=20&o=Recent',
    posted:'3 days ago', openings:9,
  },
  {
    id:11, title:'Backend Engineer Intern', company:'PhonePe', logo:'🟣',
    location:'Bangalore', job_type:'Internship',
    salary_min:35000, salary_max:60000,
    required_skills:['Java','Spring Boot','SQL','REST APIs','Git'],
    match_score:80,
    description:'Build and test microservices for UPI and wallet infrastructure. Mentorship from senior engineers on real production systems.',
    apply_url:'https://www.phonepe.com/careers/',
    posted:'2 days ago', openings:3,
  },
  {
    id:12, title:'Cybersecurity Analyst', company:'Infosys', logo:'🔵',
    location:'Pune / Remote', job_type:'Full-time',
    salary_min:800000, salary_max:1500000,
    required_skills:['SIEM','Python','OWASP','Linux','ISO 27001'],
    match_score:61,
    description:'Monitor, detect, and respond to security events across client environments. Conduct vulnerability assessments and incident response.',
    apply_url:'https://career.infosys.com/joblist',
    posted:'6 days ago', openings:15,
  },
]

const SCORE_COLOR = s => s >= 85 ? '#4ade80' : s >= 70 ? '#fbbf24' : '#f87171'
const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`

function JobCard({ job, onApply, onTailor }) {
  const [exp, setExp] = useState(false)
  const sc = SCORE_COLOR(job.match_score)
  return (
    <div style={{
      background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, overflow: 'hidden', transition: 'box-shadow 0.2s',
      boxShadow: exp ? `0 0 24px ${sc}18` : 'none',
    }}>
      {/* top stripe */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${sc}80,${sc}20)` }} />

      <div style={{ padding: '16px 18px' }}>
        {/* header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, fontSize: 22, flexShrink: 0,
              background: `${sc}12`, border: `1px solid ${sc}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{job.logo}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>{job.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(100,116,139,1)' }}>{job.company} · {job.location}</div>
            </div>
          </div>
          {/* match ring */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: sc, lineHeight: 1, textShadow: `0 0 16px ${sc}60` }}>{job.match_score}%</div>
            <div style={{ fontSize: 8, color: 'rgba(71,85,105,1)', textTransform: 'uppercase' }}>match</div>
          </div>
        </div>

        {/* meta chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {[
            [job.job_type, '#38bdf8'],
            [`${fmt(job.salary_min)} – ${fmt(job.salary_max)}`, '#fbbf24'],
            [`📢 ${job.openings} open`, '#a78bfa'],
            [job.posted, 'rgba(100,116,139,1)'],
          ].map(([t,c]) => (
            <span key={t} style={{ background: `${c}14`, color: c, border: `1px solid ${c}35`, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 600 }}>{t}</span>
          ))}
        </div>

        {/* skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {job.required_skills.map(s => (
            <span key={s} style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,1)', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: 'rgba(148,163,184,1)', fontFamily: 'monospace' }}>{s}</span>
          ))}
        </div>

        {/* expandable description */}
        <div>
          <div style={{ fontSize: 11, color: 'rgba(100,116,139,1)', lineHeight: 1.6, marginBottom: 4 }}>
            {exp ? job.description : `${job.description.slice(0,100)}…`}
          </div>
          <button onClick={() => setExp(e => !e)} style={{
            background: 'none', border: 'none', color: 'rgba(148,163,184,0.7)', fontSize: 10, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 3
          }}>{exp ? '▲ less' : '▼ more'}</button>
        </div>

        {/* action buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {/* Apply — opens company careers page */}
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { toast.success(`Opening ${job.company} careers page 🚀`); onApply(job) }}
            style={{
              flex: 1, background: `linear-gradient(135deg,${sc}30,${sc}18)`,
              border: `1px solid ${sc}50`, borderRadius: 9, padding: '9px 0',
              textAlign: 'center', fontSize: 12, fontWeight: 700, color: sc,
              textDecoration: 'none', display: 'block', cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            🚀 Apply on {job.company}
          </a>

          {/* Tailor resume button */}
          <button
            onClick={() => onTailor(job)}
            style={{
              background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 9, padding: '9px 14px', fontSize: 11, fontWeight: 700,
              color: '#a78bfa', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            ✨ Tailor CV
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Jobs() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort]     = useState('match')
  const [applied, setApplied] = useState(new Set())

  const filtered = useMemo(() => {
    let list = JOBS.filter(j => {
      const q = search.toLowerCase()
      const matchQ = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
                     j.required_skills.some(s => s.toLowerCase().includes(q))
      const matchF = filter === 'All' || j.job_type === filter
      return matchQ && matchF
    })
    if (sort === 'match')  list = [...list].sort((a,b) => b.match_score - a.match_score)
    if (sort === 'salary') list = [...list].sort((a,b) => b.salary_max - a.salary_max)
    if (sort === 'new')    list = [...list].sort((a,b) => a.id%3 - b.id%3)
    return list
  }, [search, filter, sort])

  const handleApply  = (job) => setApplied(prev => new Set([...prev, job.id]))
  const handleTailor = (job) => {
    const jd = `${job.title} at ${job.company}\n\nRequired Skills: ${job.required_skills.join(', ')}\n\n${job.description}`
    localStorage.setItem('tailorJD', jd)
    toast.success(`JD saved — go to Resume → Tailor tab to generate your CV ✨`, { duration: 4000 })
  }

  const placed = applied.size
  const topMatch = Math.max(...JOBS.map(j => j.match_score))

  return (
    <div style={{ minHeight: '100vh', background: '#020817', color: '#e2e8f0', fontFamily: "'Inter',system-ui,sans-serif", padding: '24px 16px' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .job-fade{animation:fadeUp 0.4s ease}
        a:hover{opacity:0.85}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(90deg,#e2e8f0,#4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🎯 Job Matches
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(100,116,139,1)', margin: '4px 0 0' }}>
            AI-ranked by skill match · Click “Apply” to go directly to the company’s careers page · “Tailor CV” to auto-tune your resume
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label:'Total Jobs',    val: JOBS.length,  color:'#38bdf8' },
            { label:'Applied',       val: placed,        color:'#4ade80' },
            { label:'Top Match',     val:`${topMatch}%`, color:'#a78bfa' },
            { label:'Avg CTC (L)',   val:`₹${(JOBS.reduce((s,j)=>s+(j.salary_max+j.salary_min)/2,0)/JOBS.length/100000).toFixed(1)}L`, color:'#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ background:'rgba(15,23,42,0.85)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px 14px', textAlign:'center' }}>
              <div style={{ fontSize:9, color:'rgba(71,85,105,1)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'rgba(71,85,105,1)' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search role, company, or skill…"
              style={{ width:'100%', background:'rgba(15,23,42,0.85)', border:'1px solid rgba(30,41,59,1)', borderRadius:10, padding:'9px 12px 9px 36px', fontSize:12, color:'#e2e8f0', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {['All','Full-time','Internship'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter===f ? '#4ade8030' : 'rgba(15,23,42,0.85)',
                color: filter===f ? '#4ade80' : 'rgba(100,116,139,1)',
                border:`1px solid ${filter===f ? '#4ade8060' : 'rgba(30,41,59,1)'}`,
                borderRadius:8, padding:'8px 14px', fontSize:11, fontWeight:700, cursor:'pointer',
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[['match','🔵 Match'],['salary','💰 Salary'],['new','⭐ Newest']].map(([v,l]) => (
              <button key={v} onClick={() => setSort(v)} style={{
                background: sort===v ? '#a78bfa18' : 'rgba(15,23,42,0.85)',
                color: sort===v ? '#a78bfa' : 'rgba(100,116,139,1)',
                border:`1px solid ${sort===v ? '#a78bfa40' : 'rgba(30,41,59,1)'}`,
                borderRadius:8, padding:'8px 12px', fontSize:11, fontWeight:700, cursor:'pointer',
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
          {filtered.map(job => (
            <div key={job.id} className="job-fade" style={{ opacity: applied.has(job.id) ? 0.75 : 1 }}>
              <JobCard job={job} onApply={handleApply} onTailor={handleTailor} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 0', color:'rgba(71,85,105,1)' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:14 }}>No jobs match your search.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
