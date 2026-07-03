import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import MatchScoreRing from '../components/MatchScoreRing'
import toast from 'react-hot-toast'

const MOCK_RESULT = {
  score: 87,
  extracted_skills: ['python', 'machine learning', 'sql', 'pandas', 'fastapi', 'git'],
  feedback: 'Strong resume. Highlight quantified achievements like model accuracy improvements.',
  ats_score: 79,
  missing_keywords: ['docker', 'aws', 'kubernetes'],
  suggestions: ['Add Docker containerization experience', 'Mention any cloud deployments (AWS/GCP)', 'Add GitHub project links']
}

export default function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(files => {
    if (files[0]) setFile(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }, maxFiles: 1
  })

  const analyze = () => {
    if (!file) return
    setLoading(true)
    setTimeout(() => { setResult(MOCK_RESULT); setLoading(false); toast.success('Resume analyzed!') }, 1800)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Resume Analyzer</h2>
        <p className="text-gray-500 text-sm mt-1">Upload your resume to get AI-powered scoring and ATS analysis</p>
      </div>

      {/* Dropzone */}
      <div {...getRootProps()} className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-green-500 bg-green-500/5' : 'border-[#2e2e3e] hover:border-green-500/50 bg-[#111118]'
      }`}>
        <input {...getInputProps()} />
        <Upload size={32} className="mx-auto text-gray-600 mb-3" />
        <p className="text-gray-300 text-sm">{isDragActive ? 'Drop it here!' : 'Drag & drop your resume or click to browse'}</p>
        <p className="text-gray-600 text-xs mt-1">PDF or DOCX • Max 5MB</p>
      </div>

      {file && (
        <div className="flex items-center justify-between glass rounded-xl p-4 border border-[#2e2e3e]">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-green-400" />
            <div>
              <p className="text-sm text-white font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={analyze} disabled={loading}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors">
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-5 border border-green-500/20 flex items-center gap-4">
              <MatchScoreRing score={result.score} size={72} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Resume Score</p>
                <p className="text-white font-semibold mt-1">{result.feedback.split('.')[0]}</p>
              </div>
            </div>
            <div className="glass rounded-xl p-5 border border-blue-500/20 flex items-center gap-4">
              <MatchScoreRing score={result.ats_score} size={72} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">ATS Score</p>
                <p className="text-white font-semibold mt-1">Keyword Match</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass rounded-xl p-5 border border-[#2e2e3e]">
            <h4 className="text-sm font-semibold text-white mb-3">Extracted Skills</h4>
            <div className="flex flex-wrap gap-2">
              {result.extracted_skills.map(s => (
                <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                  <CheckCircle size={10} />{s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="glass rounded-xl p-5 border border-orange-500/20">
            <h4 className="text-sm font-semibold text-white mb-3">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {result.missing_keywords.map(s => (
                <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs border border-orange-500/20">
                  <AlertCircle size={10} />{s}
                </span>
              ))}
            </div>
            <ul className="space-y-1">
              {result.suggestions.map((s, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-2"><span className="text-green-500 mt-0.5">→</span>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
