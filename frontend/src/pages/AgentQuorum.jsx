import React, { useState, useEffect, useCallback, useRef } from 'react'

// ─── constants ────────────────────────────────────────────────────────────────
const ROLES = [
  'Software Engineer', 'Data Scientist', 'Product Manager',
  'DevOps Engineer', 'ML Engineer', 'Full Stack Engineer',
  'Cybersecurity Analyst', 'Cloud Architect', 'UX Designer',
]

const SKILLS_MAP = {
  'Software Engineer':     ['React','Node.js','TypeScript','Python','AWS','REST APIs'],
  'Data Scientist':        ['Python','TensorFlow','SQL','Pandas','Power BI','Statistics'],
  'Product Manager':       ['Agile','Jira','Figma','SQL','Roadmapping','Stakeholder Mgmt'],
  'DevOps Engineer':       ['Docker','Kubernetes','CI/CD','Terraform','AWS','Linux'],
  'ML Engineer':           ['PyTorch','Python','CUDA','MLflow','FastAPI','Transformers'],
  'Full Stack Engineer':   ['React','Node.js','PostgreSQL','Redis','Docker','GraphQL'],
  'Cybersecurity Analyst': ['SIEM','Pen Testing','ISO 27001','SOC','Python','OWASP'],
  'Cloud Architect':       ['AWS','Azure','GCP','Terraform','Serverless','CDK'],
  'UX Designer':           ['Figma','Sketch','User Research','A/B Testing','Prototyping','CSS'],
}

const AGENTS = [
  { id:'skill',    name:'SkillMatchBot',      role:'Technical Screener',    emoji:'🤖', weight:35, color:'#38bdf8', accent:'#0ea5e9' },
  { id:'culture',  name:'CultureFitAgent',    role:'HR & Culture Analyst',  emoji:'🧠', weight:30, color:'#a78bfa', accent:'#7c3aed' },
  { id:'salary',   name:'SalaryOracle',       role:'Compensation Analyst',  emoji:'💰', weight:20, color:'#fbbf24', accent:'#d97706' },
  { id:'bgv',      name:'BackgroundVerify',   role:'Compliance & BGV',      emoji:'🛡️', weight:15, color:'#4ade80', accent:'#16a34a' },
]

const VERDICT_META = {
  APPROVE: { color:'#4ade80', bg:'rgba(74,222,128,0.08)', border:'rgba(74,222,128,0.25)', label:'APPROVE' },
  REVIEW:  { color:'#fbbf24', bg:'rgba(251,191,36,0.08)',  border:'rgba(251,191,36,0.25)',  label:'REVIEW'  },
  REJECT:  { color:'#f87171', bg:'rgba(248,113,113,0.08)', border:'rgba(248,113,113,0.25)', label:'REJECT'  },
}

const STATUS_META = {
  SCREENING:   { color:'#38bdf8', glow:'#38bdf880', emoji:'🔍', label:'Screening'   },
  SHORTLISTED: { color:'#a78bfa', glow:'#a78bfa80', emoji:'⭐', label:'Shortlisted' },
  INTERVIEW:   { color:'#fbbf24', glow:'#fbbf2480', emoji:'🎙️', label:'Interview'   },
  OFFER:       { color:'#fb923c', glow:'#fb923c80', emoji:'📄', label:'Offer'       },
  PLACED:      { color:'#4ade80', glow:'#4ade8080', emoji:'✅', label:'Placed'      },
  REJECTED:    { color:'#f87171', glow:'#f8717180', emoji:'❌', label:'Rejected'    },
}

const FSM_FLOW = [
  { from:'SCREENING', to:'SHORTLISTED', label:'quorum ✅', happy:true  },
  { from:'SCREENING', to:'REJECTED',   label:'quorum ❌', happy:false },
  { from:'SHORTLISTED', to:'INTERVIEW', label:'HR confirm', happy:true },
  { from:'INTERVIEW', to:'OFFER',      label:'panel pass', happy:true  },
  { from:'OFFER', to:'PLACED',         label:'accepted',   happy:true  },
  { from:'OFFER', to:'REJECTED',       label:'declined',   happy:false },
]

// ─── mock compute ─────────────────────────────────────────────────────────────
function mockScore(candidate) {
  const base = candidate.cgpa * 7 + candidate.exp * 0.3
  return {
    skill:   Math.min(98, Math.round(base + 8  + Math.random() * 12)),
    culture: Math.min(98, Math.round(base + 2  + Math.random() * 18)),
    salary:  Math.min(98, Math.round(candidate.salary < 1600000 ? 78 + Math.random() * 16 : 48 + Math.random() * 20)),
    bgv:     Math.min(98, Math.round(76 + Math.random() * 20)),
  }
}

function buildResults(candidate) {
  const s = mockScore(candidate)
  const scores = { skill: s.skill, culture: s.culture, salary: s.salary, bgv: s.bgv }
  const agentResults = AGENTS.map(ag => {
    const conf = scores[ag.id]
    const verdict = conf >= 75 ? 'APPROVE' : conf >= 52 ? 'REVIEW' : 'REJECT'
    return {
      ...ag, confidence: conf, verdict,
      latency: 80 + Math.round(Math.random() * 180),
      reasoning: buildReasoning(ag.id, candidate, conf),
      flags: buildFlags(ag.id, conf),
      metrics: buildMetrics(ag.id, candidate, conf),
    }
  })
  const wConf = Math.round(
    agentResults.reduce((s, a) => s + a.confidence * a.weight, 0) /
    agentResults.reduce((s, a) => s + a.weight, 0)
  )
  const met = wConf >= 72
  return {
    agents: agentResults,
    quorum: { score: wConf, threshold: 72, met,
      approve: agentResults.filter(a => a.verdict === 'APPROVE').length,
      review:  agentResults.filter(a => a.verdict === 'REVIEW').length,
      reject:  agentResults.filter(a => a.verdict === 'REJECT').length,
    },
    status: met ? 'SHORTLISTED' : 'REJECTED',
    offer: met ? Math.round(candidate.salary * 1.06) : null,
    matchScore: wConf,
  }
}

function buildReasoning(id, c, conf) {
  if (id === 'skill') return [
    `CGPA ${c.cgpa} → academic index ${Math.round(c.cgpa * 10)}%`,
    `${c.exp} months XP → band: ${c.exp >= 24 ? 'Mid-level' : 'Junior'}`,
    `Skills overlap with JD: ${c.skills.slice(0,3).join(', ')}`,
    `Technical composite: ${conf}% vs threshold 75%`,
  ]
  if (id === 'culture') return [
    `Location ${c.location} — remote policy ✅ compatible`,
    `Communication proxy (CGPA > 8): ${c.cgpa > 8 ? 'collaborative' : 'needs assessment'}`,
    `Team-fit heuristic score: ${conf}%`,
    `Culture gate: ${conf >= 72 ? 'PASS' : 'FLAG'}`,
  ]
  if (id === 'salary') return [
    `Expected CTC: ₹${(c.salary/100000).toFixed(1)}L`,
    `Market median for ${c.role}: ₹${(c.salary * 0.97/100000).toFixed(1)}L`,
    `Budget headroom: ${conf >= 65 ? 'within band ✅' : 'above ceiling ⚠️'}`,
    `Comp fit score: ${conf}%`,
  ]
  return [
    'Education credentials cross-checked ✅',
    `Employment history: ${conf > 85 ? 'verified' : 'pending manual review'}`,
    `Criminal record: ${conf > 82 ? 'clear' : 'flagged for review'}`,
    `BGV composite: ${conf}%`,
  ]
}

function buildFlags(id, conf) {
  if (id === 'skill')   return conf >= 75 ? ['STRONG_PROFILE'] : conf >= 55 ? ['SKILL_GAP_NOTED'] : ['LOW_SKILL_MATCH']
  if (id === 'culture') return conf >= 72 ? ['CULTURE_FIT_STRONG'] : ['CULTURE_ASSESSMENT_NEEDED']
  if (id === 'salary')  return conf >= 65 ? ['SALARY_IN_RANGE'] : ['SALARY_ABOVE_BAND']
  return conf >= 80 ? ['BGV_CLEAR'] : ['BGV_MANUAL_REVIEW']
}

function buildMetrics(id, c, conf) {
  if (id === 'skill')   return { skill_score: conf, cgpa: c.cgpa, exp_months: c.exp, skills_matched: c.skills.length }
  if (id === 'culture') return { culture_score: conf, location: c.location, adaptability: Math.round(conf * 0.92) }
  if (id === 'salary')  return { salary_fit: conf, expected_lpa: +(c.salary/100000).toFixed(1), market_lpa: +(c.salary*0.97/100000).toFixed(1) }
  return { bgv_score: conf, education: conf > 70 ? 'VERIFIED' : 'PENDING', employment: conf > 75 ? 'VERIFIED' : 'PENDING' }
}

// ─── atoms ────────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <span style={{
      display:'inline-block', width:14, height:14, flexShrink:0,
      border:'2px solid rgba(255,255,255,0.12)',
      borderTop:'2px solid #fff', borderRadius:'50%',
      animation:'spin 0.65s linear infinite',
    }} />
  )
}

function Badge({ label, color='#38bdf8' }) {
  return (
    <span style={{
      background:`${color}15`, color, border:`1px solid ${color}40`,
      borderRadius:6, padding:'2px 9px', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
    }}>{label}</span>
  )
}

function GlassCard({ children, style, glow }) {
  return (
    <div style={{
      background:'rgba(15,23,42,0.85)',
      border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:16,
      padding:'18px 20px',
      backdropFilter:'blur(12px)',
      boxShadow: glow ? `0 0 32px ${glow}` : '0 4px 24px rgba(0,0,0,0.4)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:10, fontWeight:800, color:'rgba(148,163,184,0.7)',
      textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12,
    }}>{children}</div>
  )
}

// ─── animated confidence bar ──────────────────────────────────────────────────
function ConfBar({ value, color, delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <div style={{ background:'rgba(30,41,59,0.8)', borderRadius:6, height:9, overflow:'hidden' }}>
      <div style={{
        width:`${w}%`, height:9, borderRadius:6,
        background:`linear-gradient(90deg,${color}70,${color})`,
        boxShadow:`0 0 10px ${color}60`,
        transition:'width 1.3s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

// ─── Agent Card ───────────────────────────────────────────────────────────────
function AgentCard({ agent, idx, visible }) {
  const [open, setOpen] = useState(false)
  const vm = VERDICT_META[agent.verdict]
  return (
    <div
      role="button" tabIndex={0}
      onClick={() => setOpen(o => !o)}
      onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      style={{
        background: vm.bg,
        border: `1px solid ${vm.border}`,
        borderRadius: 14,
        padding: '16px 18px',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${idx * 0.15}s, transform 0.5s ease ${idx * 0.15}s, box-shadow 0.2s`,
        boxShadow: open ? `0 0 24px ${vm.color}30` : 'none',
      }}
    >
      {/* header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:40, height:40, borderRadius:12,
            background:`linear-gradient(135deg,${agent.color}22,${agent.accent}44)`,
            border:`1px solid ${agent.color}40`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20, flexShrink:0,
          }}>{agent.emoji}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:vm.color }}>{agent.name}</div>
            <div style={{ fontSize:10, color:'rgba(100,116,139,1)' }}>{agent.role}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Badge label={agent.verdict} color={vm.color} />
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:20, fontWeight:900, color:vm.color, lineHeight:1 }}>{agent.confidence}%</div>
            <div style={{ fontSize:8, color:'rgba(71,85,105,1)' }}>w:{agent.weight}%</div>
          </div>
          <span style={{ fontSize:10, color:'rgba(71,85,105,1)', marginLeft:2 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* confidence bar */}
      <ConfBar value={agent.confidence} color={vm.color} delay={idx * 200} />

      {/* metric chips */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:10 }}>
        {Object.entries(agent.metrics).slice(0,4).map(([k,v]) => (
          <span key={k} style={{
            fontSize:9, background:'rgba(30,41,59,0.8)',
            border:'1px solid rgba(51,65,85,0.8)',
            borderRadius:5, padding:'2px 7px',
            color:'rgba(148,163,184,1)', fontFamily:'monospace',
          }}>
            {k}: <b style={{ color:'#e2e8f0' }}>{v}</b>
          </span>
        ))}
        <span style={{
          fontSize:9, background:'rgba(30,41,59,0.8)',
          border:'1px solid rgba(51,65,85,0.8)',
          borderRadius:5, padding:'2px 7px', color:'rgba(100,116,139,1)',
        }}>⏱ {agent.latency}ms</span>
      </div>

      {/* flags */}
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:8 }}>
        {agent.flags.map((f,i) => (
          <span key={i} style={{
            fontSize:9, background:vm.bg, border:`1px solid ${vm.border}`,
            borderRadius:5, padding:'2px 7px', color:vm.color, fontWeight:700,
          }}>{f}</span>
        ))}
      </div>

      {/* deliberation log */}
      {open && (
        <div style={{
          marginTop:14, paddingTop:14,
          borderTop:'1px solid rgba(30,41,59,1)',
          animation:'fadeSlide 0.3s ease',
        }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(71,85,105,1)', marginBottom:8, letterSpacing:'0.08em' }}>DELIBERATION LOG</div>
          {agent.reasoning.map((line, i) => (
            <div key={i} style={{
              display:'flex', gap:10, fontSize:10,
              color:'rgba(148,163,184,0.9)',
              padding:'4px 0',
              borderBottom: i < agent.reasoning.length - 1 ? '1px dashed rgba(30,41,59,1)' : 'none',
            }}>
              <span style={{ color:'rgba(51,65,85,1)', minWidth:18, flexShrink:0 }}>{i+1}.</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Quorum Gauge ─────────────────────────────────────────────────────────────
function QuorumGauge({ quorum, visible }) {
  const [w, setW] = useState(0)
  const [num, setNum] = useState(0)
  useEffect(() => {
    if (!visible) return
    const t1 = setTimeout(() => setW(quorum.score), 500)
    let start = 0
    const step = Math.ceil(quorum.score / 40)
    const t2 = setInterval(() => {
      start = Math.min(start + step, quorum.score)
      setNum(start)
      if (start >= quorum.score) clearInterval(t2)
    }, 30)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [quorum.score, visible])

  const col = quorum.met ? '#4ade80' : quorum.score >= 50 ? '#fbbf24' : '#f87171'
  const glow = quorum.met ? '#4ade8050' : quorum.score >= 50 ? '#fbbf2450' : '#f8717150'

  return (
    <GlassCard glow={glow} style={{ background: quorum.met ? 'rgba(5,46,22,0.6)' : 'rgba(45,10,10,0.6)', border:`1px solid ${col}40` }}>
      <SectionLabel>Quorum Result — Placement Decision</SectionLabel>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:16 }}>
        <div>
          <div style={{
            fontSize:56, fontWeight:900, color:col, lineHeight:1,
            textShadow:`0 0 40px ${col}`,
            animation: visible ? 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
          }}>{num}%</div>
          <div style={{ fontSize:11, color:'rgba(100,116,139,1)', marginTop:4 }}>Weighted confidence — threshold 72%</div>
        </div>
        <Badge label={quorum.met ? '✅ SHORTLISTED' : '❌ REJECTED'} color={col} />
      </div>

      {/* gauge bar with threshold marker */}
      <div style={{ position:'relative', background:'rgba(30,41,59,0.8)', borderRadius:8, height:16, overflow:'visible', marginBottom:14 }}>
        <div style={{
          width:`${w}%`, height:16, borderRadius:8,
          background:`linear-gradient(90deg,${col}60,${col})`,
          boxShadow:`0 0 16px ${col}70`,
          transition:'width 1.6s cubic-bezier(0.4,0,0.2,1)',
        }} />
        {/* threshold line */}
        <div style={{ position:'absolute', left:'72%', top:-6, bottom:-6, width:2, background:'rgba(255,255,255,0.3)', borderRadius:1 }} />
        <div style={{ position:'absolute', left:'72%', top:-20, fontSize:8, color:'rgba(148,163,184,0.7)', transform:'translateX(-50%)' }}>72%</div>
      </div>

      {/* vote tally */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
        {[['APPROVE','#4ade80', quorum.approve],['REVIEW','#fbbf24', quorum.review],['REJECT','#f87171', quorum.reject]].map(([v,c,n]) => (
          <div key={v} style={{
            background:'rgba(15,23,42,0.8)',
            border:`1px solid ${c}25`,
            borderRadius:10, padding:'10px', textAlign:'center',
          }}>
            <div style={{ fontSize:24, fontWeight:900, color:c }}>{n}</div>
            <div style={{ fontSize:9, color:'rgba(100,116,139,1)', marginTop:2 }}>{v}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Pipeline FSM ─────────────────────────────────────────────────────────────
function PipelineFSM({ currentStatus }) {
  const states = ['SCREENING','SHORTLISTED','INTERVIEW','OFFER','PLACED','REJECTED']
  return (
    <GlassCard>
      <SectionLabel>🔄 Placement Pipeline FSM</SectionLabel>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:14 }}>
        {states.map(s => {
          const m = STATUS_META[s]
          const active = s === currentStatus
          return (
            <div key={s} style={{
              flex:'1 1 80px', minWidth:80,
              background: active ? `${m.color}12` : 'rgba(15,23,42,0.6)',
              border:`${active ? 2 : 1}px solid ${active ? m.color : 'rgba(30,41,59,1)'}`,
              borderRadius:12, padding:'10px 8px', textAlign:'center',
              boxShadow: active ? `0 0 20px ${m.glow}` : 'none',
              transition:'all 0.4s',
              animation: active ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}>
              <div style={{ fontSize:18, marginBottom:3 }}>{m.emoji}</div>
              <div style={{ fontSize:9, fontWeight:700, color: active ? m.color : 'rgba(71,85,105,1)' }}>{m.label}</div>
              {active && <div style={{ fontSize:7, color:m.color, marginTop:2 }}>◄ NOW</div>}
            </div>
          )
        })}
      </div>
      {/* transitions */}
      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
        {FSM_FLOW.map((f, i) => {
          const highlight = f.from === currentStatus || f.to === currentStatus
          return (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:8, fontSize:10,
              opacity: highlight ? 1 : 0.3, transition:'opacity 0.4s',
              color: highlight ? '#e2e8f0' : 'rgba(51,65,85,1)',
            }}>
              <span style={{ color: STATUS_META[f.from]?.color, fontWeight:700, minWidth:96 }}>{f.from}</span>
              <span style={{ color: f.happy ? '#4ade80' : '#f87171' }}>{f.happy ? '→' : '⚠'}</span>
              <span style={{ color: STATUS_META[f.to]?.color, fontWeight:700, minWidth:96 }}>{f.to}</span>
              <span style={{ color:'rgba(71,85,105,1)', fontStyle:'italic' }}>[{f.label}]</span>
            </div>
          )
        })}
      </div>
      {currentStatus && (
        <div style={{
          marginTop:12, padding:'10px 14px',
          background:`${STATUS_META[currentStatus].color}10`,
          border:`1px solid ${STATUS_META[currentStatus].color}35`,
          borderRadius:10, fontSize:11,
          color: STATUS_META[currentStatus].color,
          animation:'fadeSlide 0.4s ease',
        }}>
          {STATUS_META[currentStatus].emoji} <b>{STATUS_META[currentStatus].label}:</b> {' '}
          {currentStatus === 'SHORTLISTED' ? 'Quorum met — queued for HR interview round' :
           currentStatus === 'REJECTED'    ? 'Quorum failed — profile archived with feedback' :
           currentStatus === 'SCREENING'   ? 'Agents analysing profile in parallel' : 'Stage active'}
        </div>
      )}
    </GlassCard>
  )
}

// ─── Candidate Row ────────────────────────────────────────────────────────────
function CandidateRow({ c, selected, onClick, result }) {
  const st = result ? STATUS_META[result.status] : STATUS_META['SCREENING']
  return (
    <div
      role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'10px 14px', borderRadius:12, cursor:'pointer',
        background: selected ? `${st.color}10` : 'transparent',
        border:`1px solid ${selected ? st.color + '50' : 'transparent'}`,
        transition:'all 0.2s',
        boxShadow: selected ? `0 0 12px ${st.glow}` : 'none',
      }}
    >
      <div style={{
        width:36, height:36, borderRadius:10, flexShrink:0,
        background:`linear-gradient(135deg,${st.color}30,${st.color}10)`,
        border:`1px solid ${st.color}40`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:16,
      }}>{st.emoji}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, fontWeight:700, color: selected ? st.color : '#e2e8f0', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</div>
        <div style={{ fontSize:10, color:'rgba(100,116,139,1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.role}</div>
      </div>
      {result && (
        <div style={{ fontSize:12, fontWeight:900, color: result.quorum.met ? '#4ade80' : '#f87171', flexShrink:0 }}>
          {result.matchScore}%
        </div>
      )}
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
function ActivityFeed({ events }) {
  return (
    <GlassCard style={{ maxHeight:260, overflowY:'auto' }}>
      <SectionLabel>⚡ Live Activity Feed</SectionLabel>
      {events.length === 0 && (
        <div style={{ fontSize:11, color:'rgba(71,85,105,1)', textAlign:'center', padding:'20px 0' }}>No activity yet — run a screening</div>
      )}
      {events.map((ev, i) => (
        <div key={i} style={{
          display:'flex', alignItems:'flex-start', gap:10,
          padding:'7px 0',
          borderBottom: i < events.length - 1 ? '1px solid rgba(30,41,59,0.6)' : 'none',
          animation:'fadeSlide 0.3s ease',
        }}>
          <span style={{ fontSize:14, flexShrink:0 }}>{ev.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:ev.color, fontWeight:600 }}>{ev.msg}</div>
            <div style={{ fontSize:9, color:'rgba(71,85,105,1)', marginTop:1 }}>{ev.time}</div>
          </div>
        </div>
      ))}
    </GlassCard>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const SEED_CANDIDATES = [
  { id:'C001', name:'Priya Sharma',    role:'Software Engineer',  skills:['React','Node.js','TypeScript'], cgpa:8.7, exp:18, location:'Bangalore', salary:1200000 },
  { id:'C002', name:'Arjun Mehta',     role:'Data Scientist',     skills:['Python','TensorFlow','SQL'],    cgpa:9.1, exp:24, location:'Hyderabad', salary:1500000 },
  { id:'C003', name:'Sneha Rao',       role:'Product Manager',    skills:['Agile','Jira','SQL'],           cgpa:7.9, exp:36, location:'Mumbai',    salary:1800000 },
  { id:'C004', name:'Karan Patel',     role:'ML Engineer',        skills:['PyTorch','Python','CUDA'],      cgpa:8.4, exp:12, location:'Pune',      salary:1100000 },
  { id:'C005', name:'Divya Nair',      role:'DevOps Engineer',    skills:['Docker','Kubernetes','AWS'],    cgpa:8.0, exp:30, location:'Chennai',   salary:1400000 },
]

export default function AgentQuorum() {
  const [candidates, setCandidates]   = useState(SEED_CANDIDATES)
  const [selected, setSelected]       = useState(SEED_CANDIDATES[0])
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)
  const [visible, setVisible]         = useState(false)
  const [results, setResults]         = useState({})
  const [activity, setActivity]       = useState([])
  const [showAdd, setShowAdd]         = useState(false)
  const [addForm, setAddForm]         = useState({ name:'', role:ROLES[0], cgpa:'8.0', exp:'12', location:'Bangalore', salary:'1200000' })
  const feedRef = useRef(null)

  const pushActivity = useCallback((icon, msg, color) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
    setActivity(prev => [{ icon, msg, color, time }, ...prev].slice(0, 20))
  }, [])

  const runScreening = useCallback(async (candidate) => {
    setLoading(true)
    setVisible(false)
    setResult(null)
    pushActivity('🔍', `Screening ${candidate.name} for ${candidate.role}…`, '#38bdf8')
    AGENTS.forEach((ag, i) => {
      setTimeout(() => pushActivity(ag.emoji, `${ag.name} deliberating…`, ag.color), i * 300)
    })
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600))
    const res = buildResults(candidate)
    setResult(res)
    setResults(prev => ({ ...prev, [candidate.id]: res }))
    setVisible(true)
    pushActivity(
      res.quorum.met ? '✅' : '❌',
      `${candidate.name}: ${res.quorum.met ? `SHORTLISTED at ${res.matchScore}%` : `REJECTED at ${res.matchScore}%`}`,
      res.quorum.met ? '#4ade80' : '#f87171',
    )
    setLoading(false)
  }, [pushActivity])

  useEffect(() => { runScreening(selected) }, []) // eslint-disable-line

  const handleSelect = (c) => {
    setSelected(c)
    runScreening(c)
  }

  const handleAdd = () => {
    if (!addForm.name.trim()) return
    const nc = {
      id: `C${String(candidates.length + 1).padStart(3,'0')}`,
      name: addForm.name.trim(), role: addForm.role,
      skills: (SKILLS_MAP[addForm.role] || []).slice(0,3),
      cgpa: parseFloat(addForm.cgpa) || 7.5,
      exp: parseInt(addForm.exp) || 0,
      location: addForm.location,
      salary: parseInt(addForm.salary) || 1000000,
    }
    setCandidates(p => [...p, nc])
    setSelected(nc)
    runScreening(nc)
    setShowAdd(false)
    setAddForm({ name:'', role:ROLES[0], cgpa:'8.0', exp:'12', location:'Bangalore', salary:'1200000' })
  }

  const screened   = Object.values(results).length
  const shortlisted = Object.values(results).filter(r => r.quorum.met).length
  const passRate   = screened > 0 ? Math.round(shortlisted / screened * 100) : 0
  const avgScore   = screened > 0 ? Math.round(Object.values(results).reduce((s,r)=>s+r.matchScore,0)/screened) : 0

  return (
    <div style={{ minHeight:'100vh', background:'#020817', color:'#e2e8f0', fontFamily:"'Inter',system-ui,sans-serif", position:'relative', overflow:'hidden' }}>

      {/* ambient background orbs */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(56,189,248,0.06),transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(167,139,250,0.06),transparent 70%)', pointerEvents:'none', zIndex:0 }} />

      <style>{`
        @keyframes spin      { to { transform:rotate(360deg) } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes popIn     { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes pulseGlow { 0%,100%{opacity:1} 50%{opacity:0.7} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        * { box-sizing:border-box }
        input,select { outline:none; font-family:inherit }
        input:focus,select:focus { border-color:#a78bfa!important; box-shadow:0 0 0 3px rgba(167,139,250,0.15) }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:rgba(15,23,42,0.5) }
        ::-webkit-scrollbar-thumb { background:#334155; border-radius:2px }
        @media(max-width:1024px){ .main-grid{grid-template-columns:1fr!important} }
        @media(max-width:640px){ .agent-grid{grid-template-columns:1fr!important} .stat-grid{grid-template-columns:1fr 1fr!important} }
      `}</style>

      <div style={{ position:'relative', zIndex:1, maxWidth:1380, margin:'0 auto', padding:'24px 16px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:28, animation:'fadeSlide 0.5s ease' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:6 }}>
            <div style={{
              width:48, height:48, borderRadius:14,
              background:'linear-gradient(135deg,rgba(56,189,248,0.2),rgba(167,139,250,0.2))',
              border:'1px solid rgba(167,139,250,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
            }}>🎯</div>
            <div>
              <h1 style={{ fontSize:26, fontWeight:900, margin:0, background:'linear-gradient(90deg,#e2e8f0,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Agent Quorum Engine
              </h1>
              <p style={{ fontSize:12, color:'rgba(100,116,139,1)', margin:0 }}>
                4 AI agents deliberate in parallel · Weighted quorum @ 72% · FSM-driven pipeline · Real-time scoring
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
          {[
            { label:'Screened',    value:screened,    color:'#38bdf8', icon:'🔍' },
            { label:'Shortlisted', value:shortlisted,  color:'#a78bfa', icon:'⭐' },
            { label:'Avg Score',   value:`${avgScore}%`, color:'#fbbf24', icon:'📊' },
            { label:'Pass Rate',   value:`${passRate}%`, color:'#4ade80', icon:'✅' },
          ].map(s => (
            <GlassCard key={s.label} style={{ textAlign:'center', padding:'14px 10px' }}>
              <div style={{ fontSize:9, color:'rgba(71,85,105,1)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>{s.icon} {s.label}</div>
              <div style={{ fontSize:26, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
            </GlassCard>
          ))}
        </div>

        {/* ── Main 3-column grid ── */}
        <div className="main-grid" style={{ display:'grid', gridTemplateColumns:'260px 1fr 280px', gap:18, alignItems:'start' }}>

          {/* ── LEFT: Candidate list ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <GlassCard style={{ padding:'14px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <SectionLabel>👥 Candidates ({candidates.length})</SectionLabel>
                <button
                  onClick={() => setShowAdd(s => !s)}
                  style={{
                    background: showAdd ? 'rgba(30,41,59,0.8)' : 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(56,189,248,0.3))',
                    color: showAdd ? '#94a3b8' : '#e2e8f0',
                    border:`1px solid ${showAdd ? 'rgba(51,65,85,1)' : 'rgba(167,139,250,0.5)'}`,
                    borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:700, cursor:'pointer',
                  }}
                >{showAdd ? '✕ Cancel' : '+ Add'}</button>
              </div>

              {/* Add form */}
              {showAdd && (
                <div style={{ marginBottom:12, padding:'12px', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:12, animation:'fadeSlide 0.3s ease' }}>
                  {[
                    { k:'name',     label:'Full Name',  type:'text',   opts:null  },
                    { k:'role',     label:'Target Role',type:'select', opts:ROLES },
                    { k:'cgpa',     label:'CGPA',       type:'number', opts:null  },
                    { k:'exp',      label:'Exp (mo)',   type:'number', opts:null  },
                    { k:'location', label:'Location',   type:'text',   opts:null  },
                    { k:'salary',   label:'CTC (₹)',    type:'number', opts:null  },
                  ].map(({ k, label, type, opts }) => (
                    <div key={k} style={{ marginBottom:8 }}>
                      <div style={{ fontSize:9, color:'rgba(71,85,105,1)', fontWeight:700, textTransform:'uppercase', marginBottom:3 }}>{label}</div>
                      {opts ? (
                        <select value={addForm[k]} onChange={e => setAddForm(f => ({...f,[k]:e.target.value}))}
                          style={{ width:'100%', background:'rgba(3,7,18,0.8)', border:'1px solid rgba(30,41,59,1)', borderRadius:8, padding:'6px 8px', fontSize:11, color:'#e2e8f0' }}>
                          {opts.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={type} value={addForm[k]} onChange={e => setAddForm(f => ({...f,[k]:e.target.value}))}
                          style={{ width:'100%', background:'rgba(3,7,18,0.8)', border:'1px solid rgba(30,41,59,1)', borderRadius:8, padding:'6px 8px', fontSize:11, color:'#e2e8f0' }} />
                      )}
                    </div>
                  ))}
                  <button onClick={handleAdd}
                    style={{ width:'100%', background:'linear-gradient(135deg,#4c1d95,#1d4ed8)', color:'#e9d5ff', border:'none', borderRadius:9, padding:'9px', fontSize:12, fontWeight:700, cursor:'pointer', marginTop:4 }}>
                    🚀 Screen Candidate
                  </button>
                </div>
              )}

              {/* List */}
              {candidates.map(c => (
                <CandidateRow key={c.id} c={c} selected={selected.id === c.id} onClick={() => handleSelect(c)} result={results[c.id]} />
              ))}
            </GlassCard>
          </div>

          {/* ── CENTRE: Screening results ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Result summary card */}
            {loading && (
              <GlassCard style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, minHeight:90 }}>
                <Spinner />
                <span style={{ color:'rgba(100,116,139,1)', fontSize:13 }}>Agents deliberating on {selected.name}…</span>
              </GlassCard>
            )}

            {result && !loading && (
              <GlassCard
                glow={result.quorum.met ? '#4ade8030' : '#f8717130'}
                style={{
                  background: result.quorum.met ? 'rgba(5,46,22,0.5)' : 'rgba(45,10,10,0.5)',
                  border:`1px solid ${result.quorum.met ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  animation:'fadeSlide 0.5s ease',
                }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontSize:20, fontWeight:900, color: result.quorum.met ? '#4ade80' : '#f87171', marginBottom:4 }}>
                      {result.quorum.met ? '✅' : '❌'} {result.agents[0] && selected.name}
                    </div>
                    <div style={{ fontSize:11, color:'rgba(100,116,139,1)' }}>
                      {selected.role} · {selected.location} · {selected.exp}mo exp · CGPA {selected.cgpa}
                    </div>
                    <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                      {selected.skills.map(sk => <Badge key={sk} label={sk} color='#38bdf8' />)}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:44, fontWeight:900, color: result.quorum.met ? '#4ade80' : '#f87171', lineHeight:1, textShadow:`0 0 30px ${result.quorum.met ? '#4ade80' : '#f87171'}` }}>
                      {result.matchScore}%
                    </div>
                    <div style={{ fontSize:9, color:'rgba(71,85,105,1)', marginTop:2 }}>MATCH SCORE</div>
                    {result.offer && (
                      <div style={{ fontSize:13, fontWeight:800, color:'#fbbf24', marginTop:6 }}>
                        💰 ₹{(result.offer/100000).toFixed(1)}L Offer
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Agent cards */}
            {result && !loading && (
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(148,163,184,0.8)', marginBottom:12 }}>
                  🤖 Agent Deliberations — click any card to expand reasoning log
                </div>
                <div className="agent-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {result.agents.map((a, i) => (
                    <AgentCard key={a.id} agent={a} idx={i} visible={visible} />
                  ))}
                </div>
              </div>
            )}

            {/* Quorum gauge */}
            {result && !loading && <QuorumGauge quorum={result.quorum} visible={visible} />}
          </div>

          {/* ── RIGHT: FSM + Activity ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <PipelineFSM currentStatus={result?.status} />
            <ActivityFeed events={activity} />
          </div>
        </div>
      </div>
    </div>
  )
}
