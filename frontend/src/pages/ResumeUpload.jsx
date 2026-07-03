import React, { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

const SKILL_POOL = [
  'Python','JavaScript','TypeScript','React','Node.js','FastAPI','Django','Flask',
  'SQL','PostgreSQL','MongoDB','Redis','Docker','Kubernetes','AWS','GCP','Azure',
  'TensorFlow','PyTorch','Scikit-learn','Pandas','NumPy','Tableau','Power BI',
  'Git','Linux','CI/CD','REST APIs','GraphQL','Terraform','Spark','Kafka',
  'Java','C++','Go','Rust','Next.js','Vue.js','Figma','Agile','Jira','OWASP',
]

function extractSkillsFromText(text) {
  const lower = text.toLowerCase()
  return SKILL_POOL.filter(s => lower.includes(s.toLowerCase()))
}

function mockAnalyze(resumeText, jdText) {
  const resumeSkills = extractSkillsFromText(resumeText)
  const jdSkills     = extractSkillsFromText(jdText)
  const matched      = resumeSkills.filter(s => jdSkills.includes(s))
  const missing      = jdSkills.filter(s => !resumeSkills.includes(s))
  const jdWords      = jdText ? jdText.split(/\s+/).length : 0
  const matchPct     = jdSkills.length > 0 ? Math.round((matched.length / jdSkills.length) * 100) : 72
  const atsScore     = Math.min(99, Math.round(matchPct * 0.7 + 30 + Math.random() * 8))
  const resumeScore  = Math.min(99, Math.round(matchPct * 0.5 + 50 + Math.random() * 10))
  const suggestions  = []
  if (missing.length > 0) suggestions.push(`Add missing keywords: ${missing.slice(0,4).join(', ')}`)
  if (!resumeText.match(/\d+%|\d+x|\d+ (users|projects|systems)/i)) suggestions.push('Add quantified achievements (e.g. "improved accuracy by 18%")')
  if (!resumeText.toLowerCase().includes('github')) suggestions.push('Include GitHub profile link')
  if (!resumeText.toLowerCase().includes('bachelor') && !resumeText.toLowerCase().includes('b.tech')) suggestions.push('Add education section with degree and institution')
  if (jdWords > 0 && matched.length < 3) suggestions.push('Rewrite summary to mirror JD language')
  return { resumeScore, atsScore, matchPct, resumeSkills, jdSkills, matched, missing, suggestions }
}

function buildTailoredResume(resumeText, jdText, result) {
  const name    = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m)?.[1] || 'Your Name'
  const email   = resumeText.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] || 'you@email.com'
  const phone   = resumeText.match(/(\+91[\s-]?)?[6-9]\d{9}/)?.[0] || '+91 9XXXXXXXXX'
  const all     = [...new Set([...result.resumeSkills, ...result.missing])].slice(0, 18)
  const role    = jdText.match(/(software engineer|data scientist|ml engineer|product manager|devops|full stack|backend|frontend)/i)?.[1] || 'Software Engineer'
  return `${name}
${email}  |  ${phone}  |  github.com/profile  |  linkedin.com/in/profile

${'─'.repeat(76)}
PROFESSIONAL SUMMARY
${'─'.repeat(76)}
Results-driven ${role} with hands-on experience in ${all.slice(0,4).join(', ')}.
Passionate about building scalable solutions and delivering measurable impact.
Seeking to leverage technical expertise in a high-growth environment.

${'─'.repeat(76)}
SKILLS  [Tailored to JD]
${'─'.repeat(76)}
Languages & Frameworks : ${all.slice(0,6).join(' · ')}
Data & ML              : ${all.slice(6,12).join(' · ')}
Infrastructure         : ${all.slice(12,18).join(' · ')}

${'─'.repeat(76)}
EXPERIENCE
${'─'.repeat(76)}
[Add your experience here]
• Led development of [X] using ${(result.matched.slice(0,2)).join(' and ')} — improved performance by 30%
• Collaborated with cross-functional teams on ${role} initiatives impacting 10,000+ users
• Automated ${result.matched[0] || 'workflow'} pipelines, reducing manual effort by 40%

${'─'.repeat(76)}
EDUCATION
${'─'.repeat(76)}
B.Tech / [Your Degree]  |  [University Name]  |  20XX – 20XX  |  CGPA: X.X/10

${'─'.repeat(76)}
PROJECTS
${'─'.repeat(76)}
• [Project Name] — Built using ${result.matched.slice(0,3).join(', ')} | github.com/your-project
• [Project Name] — ${result.missing.slice(0,2).join(' + ')} integration | Deployed on AWS
`
}

function ScoreRing({ score, label, color }) {
  const r = 30, c = 2 * Math.PI * r
  const [dash, setDash] = useState(0)
  React.useEffect(() => { const t = setTimeout(() => setDash(score / 100 * c), 300); return () => clearTimeout(t) }, [score, c])
  return (
    <div style={{ textAlign: 'center', minWidth: 90 }}>
      <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth={6} />
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)', strokeLinecap: 'round' }} />
      </svg>
      <div style={{ marginTop: -60, paddingBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color }}>{score}%</div>
        <div style={{ fontSize: 9, color: 'rgba(100,116,139,1)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      </div>
    </div>
  )
}

const S = {
  wrap:     { minHeight: '100vh', background: '#020817', color: '#e2e8f0', fontFamily: "'Inter',system-ui,sans-serif", padding: '24px 20px' },
  card:     { background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 16 },
  label:    { fontSize: 9, fontWeight: 800, color: 'rgba(100,116,139,1)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 },
  chip:     (color) => ({ background: `${color}15`, color, border: `1px solid ${color}40`, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, margin: '3px' }),
  btn:      (bg, color='#fff') => ({ background: bg, color, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s' }),
  textarea: { width: '100%', background: 'rgba(3,7,18,0.8)', border: '1px solid rgba(30,41,59,1)', borderRadius: 10, padding: '12px', fontSize: 12, color: '#e2e8f0', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
}

export default function ResumeUpload() {
  const [file, setFile]             = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jdText, setJdText]         = useState('')
  const [result, setResult]         = useState(null)
  const [tailored, setTailored]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [tailoring, setTailoring]   = useState(false)
  const [tab, setTab]               = useState('analyze')
  const [showTailored, setShowTailored] = useState(false)

  const onDrop = useCallback(accepted => {
    if (!accepted[0]) return
    setFile(accepted[0])
    const reader = new FileReader()
    reader.onload = e => setResumeText(e.target.result || '')
    reader.readAsText(accepted[0])
    toast.success(`Loaded: ${accepted[0].name}`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  })

  const analyze = async () => {
    if (!resumeText.trim()) { toast.error('Paste resume text or upload a .txt file'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setResult(mockAnalyze(resumeText, jdText))
    setLoading(false)
    toast.success('Analysis complete!')
  }

  const tailorResume = async () => {
    if (!result) { await analyze(); }
    if (!jdText.trim()) { toast.error('Paste a Job Description first'); return }
    setTailoring(true)
    await new Promise(r => setTimeout(r, 1600))
    const res = result || mockAnalyze(resumeText, jdText)
    setTailored(buildTailoredResume(resumeText, jdText, res))
    setShowTailored(true)
    setTailoring(false)
    toast.success('Resume tailored to JD ✔️')
  }

  const copyTailored = () => { navigator.clipboard.writeText(tailored); toast.success('Copied!') }
  const downloadTailored = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([tailored], { type: 'text/plain' }))
    a.download = 'tailored_resume.txt'; a.click()
    toast.success('Downloaded!')
  }

  return (
    <div style={S.wrap}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.45s ease}
        textarea:focus{border-color:#a78bfa!important;box-shadow:0 0 0 3px rgba(167,139,250,0.12)}
        input:focus{border-color:#a78bfa!important;outline:none}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(90deg,#e2e8f0,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            📄 Resume Analyzer & Tailor
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(100,116,139,1)', margin: '4px 0 0' }}>Analyze your resume · Match against any JD · Get a tailored version in seconds</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[['analyze','🔍 Analyze'],['tailor','✨ Tailor to JD']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              ...S.btn(tab===t ? 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(56,189,248,0.3))' : 'rgba(15,23,42,0.6)'),
              border: `1px solid ${tab===t ? 'rgba(167,139,250,0.5)' : 'rgba(30,41,59,1)'}`,
              color: tab===t ? '#e2e8f0' : 'rgba(100,116,139,1)', fontSize: 12, padding: '8px 16px',
            }}>{l}</button>
          ))}
        </div>

        {tab === 'analyze' && (
          <div className="fade-up">
            <div {...getRootProps()} style={{
              border: `2px dashed ${isDragActive ? '#a78bfa' : 'rgba(30,41,59,1)'}`,
              borderRadius: 14, padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'rgba(124,58,237,0.06)' : 'rgba(15,23,42,0.5)',
              transition: 'all 0.2s', marginBottom: 14,
            }}>
              <input {...getInputProps()} />
              <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
              <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0 }}>{isDragActive ? 'Drop it!' : 'Drag & drop resume (PDF/TXT) or click to browse'}</p>
              <p style={{ fontSize: 10, color: 'rgba(71,85,105,1)', marginTop: 4 }}>PDF, DOCX, TXT · Max 5MB</p>
            </div>

            {file && (
              <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{file.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(71,85,105,1)' }}>{(file.size/1024).toFixed(1)} KB</div>
                </div>
                <span style={{ fontSize: 10, color: '#4ade80' }}>✔ Loaded</span>
              </div>
            )}

            <div style={S.card}>
              <div style={S.label}>Resume Text (paste here or auto-loaded from file)</div>
              <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                rows={7} placeholder="Paste your resume text here..."
                style={S.textarea} />
            </div>

            <div style={S.card}>
              <div style={S.label}>⚡ Job Description (optional — paste for JD-specific scoring)</div>
              <textarea value={jdText} onChange={e => setJdText(e.target.value)}
                rows={5} placeholder="Paste the job description here to get match % against this specific role..."
                style={S.textarea} />
            </div>

            <button onClick={analyze} disabled={loading} style={{
              ...S.btn('linear-gradient(135deg,#4c1d95,#1e40af)'),
              opacity: loading ? 0.6 : 1, marginBottom: 20, width: '100%', justifyContent: 'center',
            }}>{loading ? '🔄 Analyzing…' : '🔍 Analyze Resume'}</button>

            {result && (
              <div className="fade-up">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
                  {[
                    { score: result.resumeScore, label: 'Resume Score', color: '#a78bfa' },
                    { score: result.atsScore,    label: 'ATS Score',    color: '#38bdf8' },
                    { score: result.matchPct,    label: 'JD Match',     color: jdText ? '#4ade80' : '#475569' },
                  ].map(s => (
                    <div key={s.label} style={{ ...S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 10px', margin: 0 }}>
                      <ScoreRing score={s.score} label={s.label} color={s.color} />
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <div style={S.label}>✔ Skills Detected ({result.resumeSkills.length})</div>
                  <div>{result.resumeSkills.map(s => <span key={s} style={S.chip('#4ade80')}>✔ {s}</span>)}</div>
                  {result.missing.length > 0 && (
                    <>
                      <div style={{ ...S.label, marginTop: 14 }}>⚠️ Missing from JD ({result.missing.length})</div>
                      <div>{result.missing.map(s => <span key={s} style={S.chip('#fb923c')}>⚠ {s}</span>)}</div>
                    </>
                  )}
                </div>

                {result.suggestions.length > 0 && (
                  <div style={{ ...S.card, border: '1px solid rgba(251,191,36,0.25)' }}>
                    <div style={S.label}>💡 Improvement Suggestions</div>
                    {result.suggestions.map((s,i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, color: '#e2e8f0', padding: '6px 0', borderBottom: i<result.suggestions.length-1?'1px dashed rgba(30,41,59,1)':'none' }}>
                        <span style={{ color: '#fbbf24', flexShrink: 0 }}>→</span>{s}
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => setTab('tailor')} style={{ ...S.btn('linear-gradient(135deg,rgba(74,222,128,0.3),rgba(56,189,248,0.3))'), border: '1px solid rgba(74,222,128,0.4)', color: '#4ade80', width: '100%', justifyContent: 'center', marginTop: 4 }}>
                  ✨ Tailor resume to this JD →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'tailor' && (
          <div className="fade-up">
            <div style={S.card}>
              <div style={S.label}>Step 1 — paste your resume</div>
              <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                rows={6} placeholder="Paste resume text…" style={S.textarea} />
            </div>
            <div style={S.card}>
              <div style={S.label}>Step 2 — paste the target job description</div>
              <textarea value={jdText} onChange={e => setJdText(e.target.value)}
                rows={6} placeholder="Paste the job description here… The AI will mirror its language and keywords." style={S.textarea} />
            </div>
            <button onClick={tailorResume} disabled={tailoring} style={{
              ...S.btn('linear-gradient(135deg,#581c87,#1e3a8a)'),
              width: '100%', justifyContent: 'center', marginBottom: 20, opacity: tailoring ? 0.6 : 1,
            }}>{tailoring ? '⏳ Tailoring…' : '✨ Generate Tailored Resume'}</button>

            {showTailored && tailored && (
              <div style={{ ...S.card, border: '1px solid rgba(167,139,250,0.3)', animation: 'fadeUp 0.45s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={S.label}>✨ Tailored Resume (edit & send)</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={copyTailored} style={{ ...S.btn('rgba(30,41,59,0.9)'), border: '1px solid rgba(51,65,85,1)', fontSize: 11, padding: '6px 12px' }}>📋 Copy</button>
                    <button onClick={downloadTailored} style={{ ...S.btn('rgba(30,41,59,0.9)'), border: '1px solid rgba(51,65,85,1)', fontSize: 11, padding: '6px 12px' }}>⬇ Download</button>
                  </div>
                </div>
                <textarea value={tailored} onChange={e => setTailored(e.target.value)}
                  rows={24} style={{ ...S.textarea, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.7 }} />
                <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(71,85,105,1)' }}>⚠️ Review and personalise before sending. Fill in the bracketed placeholders.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
