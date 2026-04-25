'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, RefreshCw, ArrowRight, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface Issue {
  severity: 'high' | 'medium' | 'low'
  category: string
  issue: string
  fix: string
}

interface Analysis {
  overallScore: number
  summary: string
  scores: Record<string, number>
  strengths: string[]
  issues: Issue[]
  recommendations: string[]
  accessibilityNotes: string
  improvementPrompt: string
}

const SCORE_COLORS: Record<number, string> = {}

function getScoreColor(score: number) {
  if (score >= 80) return '#4ADE80'
  if (score >= 60) return '#E8A020'
  return '#F87171'
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[#6B6560] capitalize">{label}</span>
        <span className="text-xs font-mono" style={{ color: getScoreColor(value) }}>{value}</span>
      </div>
      <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }} />
      </div>
    </div>
  )
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === 'high') return <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
  if (severity === 'medium') return <AlertTriangle size={13} className="text-[#E8A020] flex-shrink-0" />
  return <AlertCircle size={13} className="text-blue-400 flex-shrink-0" />
}

const EXAMPLES = [
  { desc: 'A SaaS landing page with hero, features grid, and pricing section', context: 'B2B software product for project management' },
  { desc: 'An e-commerce product page with image gallery, description, and add-to-cart', context: 'Fashion retail website targeting millennials' },
  { desc: 'A mobile banking dashboard showing account balance, transactions, and quick actions', context: 'Fintech app for Gen Z users' },
]

export default function AnalyzePage() {
  const [description, setDescription] = useState('')
  const [context, setContext] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!description.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/analyze-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, context }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data.analysis)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F7F4EF]">
      <header className="border-b border-[#1E1E1E] h-14 flex items-center px-6 gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#6B6560] hover:text-[#F7F4EF] transition-colors">
          <ArrowLeft size={16} /><span className="text-sm">Dashboard</span>
        </Link>
        <div className="w-px h-4 bg-[#1E1E1E]" />
        <Search size={14} className="text-[#7C3AED]" />
        <span className="text-sm font-medium">Design Analyzer</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-mono text-[#7C3AED] uppercase tracking-widest mb-2">ANALYZE</p>
          <h1 style={{fontFamily: 'Playfair Display, serif'}} className="text-3xl font-bold">AI Design Feedback</h1>
          <p className="text-[#6B6560] mt-2 text-sm">Describe your UI and get detailed usability, accessibility, and aesthetic analysis.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Describe the design</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the layout, components, colors, typography, and interactions of your design..."
              className="w-full bg-[#111] border border-[#2A2A2A] rounded p-3 text-sm text-[#F7F4EF] placeholder-[#3A3A3A] resize-none h-28 focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Context / Audience (optional)</label>
            <input
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. B2B SaaS dashboard for enterprise customers, desktop-first"
              className="w-full bg-[#111] border border-[#2A2A2A] rounded p-3 text-sm text-[#F7F4EF] placeholder-[#3A3A3A] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
        </div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-xs text-[#3A3A3A] mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setDescription(ex.desc); setContext(ex.context) }}
                className="text-xs text-[#6B6560] border border-[#1E1E1E] rounded px-3 py-1.5 hover:border-[#7C3AED] hover:text-[#F7F4EF] transition-all">
                Example {i + 1}
              </button>
            ))}
          </div>
        </div>

        <button onClick={analyze} disabled={loading || !description.trim()}
          className="flex items-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded font-semibold hover:bg-[#9B59F0] transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-10">
          {loading ? <><RefreshCw size={15} className="animate-spin" /> Analyzing...</> : <><Search size={15} /> Analyze Design</>}
        </button>

        {error && <div className="bg-red-950/40 border border-red-900/50 rounded p-3 text-sm text-red-400 mb-6">{error}</div>}

        {analysis && (
          <div className="space-y-8">
            {/* Overall score */}
            <div className="bg-[#0F0B18] border border-[#7C3AED]/30 rounded-xl p-6">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold font-mono" style={{ color: getScoreColor(analysis.overallScore) }}>
                    {analysis.overallScore}
                  </div>
                  <div className="text-xs text-[#6B6560] mt-1">Overall Score</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-[#A0A0A0]">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div>
              <h2 className="font-semibold mb-4">Score Breakdown</h2>
              <div className="bg-[#111] border border-[#1E1E1E] rounded-lg p-5 space-y-4">
                {Object.entries(analysis.scores).map(([label, val]) => (
                  <ScoreBar key={label} label={label} value={val} />
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle size={15} className="text-green-400" /> Strengths
              </h2>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                    <span className="text-green-400 mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div>
                <h2 className="font-semibold mb-4">Issues Found</h2>
                <div className="space-y-3">
                  {analysis.issues.map((issue, i) => (
                    <div key={i} className="bg-[#111] border border-[#1E1E1E] rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <SeverityIcon severity={issue.severity} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-[#6B6560] uppercase">{issue.category}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                              issue.severity === 'high' ? 'bg-red-950 text-red-400' :
                              issue.severity === 'medium' ? 'bg-amber-950 text-amber-400' : 'bg-blue-950 text-blue-400'
                            }`}>{issue.severity}</span>
                          </div>
                          <p className="text-sm text-[#F7F4EF] mb-1">{issue.issue}</p>
                          <p className="text-xs text-[#6B6560]">Fix: {issue.fix}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h2 className="font-semibold mb-4">Recommendations</h2>
              <ul className="space-y-2">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                    <span className="text-[#7C3AED] mt-0.5">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accessibility */}
            <div className="bg-[#111] border border-[#1E1E1E] rounded-lg p-5">
              <p className="text-xs font-mono text-[#6B6560] uppercase tracking-widest mb-2">Accessibility Notes</p>
              <p className="text-sm text-[#A0A0A0]">{analysis.accessibilityNotes}</p>
            </div>

            {/* CTA to regenerate improved */}
            <div className="bg-[#0E0B00] border border-[#E8A020]/20 rounded-lg p-5">
              <p className="text-xs font-mono text-[#E8A020] uppercase tracking-widest mb-2">Ready to Improve?</p>
              <p className="text-sm text-[#6B6560] mb-4">Use this AI-generated prompt to build an improved version in the Component Generator.</p>
              <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded p-3 text-xs font-mono text-[#A0A0A0] mb-4 leading-relaxed">
                {analysis.improvementPrompt}
              </div>
              <Link
                href={`/generate?prompt=${encodeURIComponent(analysis.improvementPrompt)}`}
                className="inline-flex items-center gap-2 bg-[#E8A020] text-[#0D0D0D] px-4 py-2.5 rounded font-semibold text-sm hover:bg-[#F5C560] transition-all"
              >
                Generate Improved Component <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
