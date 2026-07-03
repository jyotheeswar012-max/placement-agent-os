import React, { useState } from 'react'
import { MessageSquare, ChevronRight, CheckCircle } from 'lucide-react'

const QUESTIONS = {
  Python: [
    'What are Python decorators and give a real-world use case?',
    'Explain the difference between list and tuple.',
    'How does Python\'s GIL affect multithreading?'
  ],
  'Machine Learning': [
    'Explain overfitting and how to prevent it.',
    'What is the bias-variance tradeoff?',
    'When would you use Random Forest over Logistic Regression?'
  ],
  SQL: [
    'What is the difference between INNER JOIN and LEFT JOIN?',
    'How do you optimize a slow SQL query?',
    'Explain window functions with an example.'
  ],
  'System Design': [
    'Design a URL shortener like bit.ly.',
    'How would you design a job portal with millions of users?',
    'Explain how you\'d design a notification system.'
  ]
}

export default function InterviewPrep() {
  const [selectedSkill, setSelectedSkill] = useState('Python')
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState({})

  const submit = (q, idx) => {
    if (answers[`${selectedSkill}-${idx}`]?.trim())
      setSubmitted(s => ({ ...s, [`${selectedSkill}-${idx}`]: true }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Interview Prep Agent</h2>
        <p className="text-gray-500 text-sm mt-1">Practice role-specific questions generated from your skill set</p>
      </div>

      {/* Skill selector */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(QUESTIONS).map(skill => (
          <button key={skill} onClick={() => setSelectedSkill(skill)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              selectedSkill === skill ? 'bg-green-500 text-white' : 'glass border border-[#2e2e3e] text-gray-400 hover:text-white'
            }`}>
            {skill}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS[selectedSkill].map((q, idx) => {
          const key = `${selectedSkill}-${idx}`
          const done = submitted[key]
          return (
            <div key={idx} className={`glass rounded-xl p-5 border transition-all ${
              done ? 'border-green-500/30' : 'border-[#2e2e3e]'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  done ? 'bg-green-500 text-white' : 'bg-[#2e2e3e] text-gray-400'
                }`}>
                  {done ? <CheckCircle size={12} /> : idx + 1}
                </div>
                <p className="text-sm text-gray-200">{q}</p>
              </div>
              <textarea
                value={answers[key] || ''}
                onChange={e => setAnswers(a => ({ ...a, [key]: e.target.value }))}
                disabled={done}
                placeholder="Type your answer here..."
                rows={3}
                className="w-full bg-[#1a1a24] border border-[#2e2e3e] rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-green-500/50 resize-none disabled:opacity-50"
              />
              {!done && (
                <button onClick={() => submit(q, idx)}
                  className="mt-2 flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors font-medium">
                  Submit Answer <ChevronRight size={12} />
                </button>
              )}
              {done && <p className="mt-2 text-xs text-green-400">✓ Answer submitted — great work!</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
