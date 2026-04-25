'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, Zap, RefreshCw, Code2, Eye, Download } from 'lucide-react'

const FRAMEWORKS = [
  { id: 'html', label: 'HTML/CSS' },
  { id: 'react', label: 'React' },
  { id: 'tailwind', label: 'Tailwind' },
]

const STYLES = [
  { id: 'modern', label: 'Modern' },
  { id: 'glassmorphism', label: 'Glassmorphism' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'minimal', label: 'Minimal' },
]

const PROMPTS = [
  'a pricing card with highlighted popular tier',
  'a responsive navigation header with mobile menu',
  'a user profile card with avatar and stats',
  'a dark-mode login form with validation states',
  'a notification dropdown with read/unread states',
  'a kanban board column with drag handles',
  'a data table with sorting and pagination',
  'an onboarding progress stepper',
]

function GeneratePageInner() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [prompt, setPrompt] = useState(initialPrompt)
  const [framework, setFramework] = useState('html')
  const [style, setStyle] = useState('modern')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [tokens, setTokens] = useState<{input_tokens: number, output_tokens: number} | null>(null)

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    setCode('')
    try {
      const res = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, framework, style }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCode(data.code)
      setTokens(data.tokens)
      setTab('preview')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const ext = framework === 'react' ? 'jsx' : 'html'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `component.${ext}`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F7F4EF] flex flex-col">
      <header className="border-b border-[#1E1E1E] h-14 flex items-center px-6 gap-4 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 text-[#6B6560] hover:text-[#F7F4EF] transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </Link>
        <div className="w-px h-4 bg-[#1E1E1E]" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#E8A020] rounded flex items-center justify-center">
            <span className="text-[#0D0D0D] font-bold text-[9px] font-mono">DJ</span>
          </div>
          <span className="text-sm font-medium">Component Generator</span>
        </div>
        {tokens && (
          <div className="ml-auto text-xs text-[#6B6560] font-mono">
            {tokens.input_tokens + tokens.output_tokens} tokens used
          </div>
        )}
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-[#1E1E1E] flex flex-col">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div>
              <label className="text-xs font-mono text-[#E8A020] uppercase tracking-widest block mb-2">Describe your component</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && e.metaKey && generate()}
                placeholder="e.g. a dark pricing card with monthly/annual toggle..."
                className="w-full bg-[#111] border border-[#2A2A2A] rounded p-3 text-sm text-[#F7F4EF] placeholder-[#3A3A3A] resize-none h-28 focus:outline-none focus:border-[#E8A020] transition-colors"
              />
              <p className="text-xs text-[#3A3A3A] mt-1">⌘ + Enter to generate</p>
            </div>
            <div>
              <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Framework</label>
              <div className="grid grid-cols-3 gap-2">
                {FRAMEWORKS.map(f => (
                  <button key={f.id} onClick={() => setFramework(f.id)}
                    className={`py-2 px-3 rounded text-xs font-medium border transition-all ${framework === f.id ? 'bg-[#E8A020] text-[#0D0D0D] border-[#E8A020]' : 'border-[#2A2A2A] text-[#6B6560] hover:border-[#E8A020] hover:text-[#F7F4EF]'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)}
                    className={`py-2 px-3 rounded text-xs font-medium border transition-all ${style === s.id ? 'bg-[#E8A020] text-[#0D0D0D] border-[#E8A020]' : 'border-[#2A2A2A] text-[#6B6560] hover:border-[#E8A020] hover:text-[#F7F4EF]'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={loading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#E8A020] text-[#0D0D0D] py-3 rounded font-semibold hover:bg-[#F5C560] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? <><RefreshCw size={16} className="animate-spin" /> Generating...</> : <><Zap size={16} /> Generate Component</>}
            </button>
            {error && <div className="bg-red-950/40 border border-red-900/50 rounded p-3 text-sm text-red-400">{error}</div>}
            <div>
              <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Quick examples</label>
              <div className="space-y-1">
                {PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => setPrompt(p)}
                    className="w-full text-left text-xs text-[#6B6560] py-1.5 px-3 rounded hover:bg-[#111] hover:text-[#F7F4EF] transition-all border border-transparent hover:border-[#1E1E1E]">
                    → {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[#1E1E1E] p-4 grid grid-cols-2 gap-2">
            <Link href="/dashboard" className="text-center text-xs text-[#6B6560] border border-[#1E1E1E] py-2 rounded hover:border-[#E8A020] hover:text-[#E8A020] transition-all">Dashboard</Link>
            <Link href="/analyze" className="text-center text-xs text-[#6B6560] border border-[#1E1E1E] py-2 rounded hover:border-[#E8A020] hover:text-[#E8A020] transition-all">Analyze Design</Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0">
          <div className="border-b border-[#1E1E1E] h-10 flex items-center px-6 gap-4 flex-shrink-0">
            <button onClick={() => setTab('preview')}
              className={`flex items-center gap-1.5 text-xs font-medium pb-0.5 border-b-2 transition-colors ${tab === 'preview' ? 'border-[#E8A020] text-[#F7F4EF]' : 'border-transparent text-[#6B6560] hover:text-[#F7F4EF]'}`}>
              <Eye size={12} /> Preview
            </button>
            <button onClick={() => setTab('code')}
              className={`flex items-center gap-1.5 text-xs font-medium pb-0.5 border-b-2 transition-colors ${tab === 'code' ? 'border-[#E8A020] text-[#F7F4EF]' : 'border-transparent text-[#6B6560] hover:text-[#F7F4EF]'}`}>
              <Code2 size={12} /> Code
            </button>
            {code && (
              <div className="ml-auto flex gap-2">
                <button onClick={copy} className="flex items-center gap-1 text-xs text-[#6B6560] hover:text-[#F7F4EF] border border-[#1E1E1E] px-3 py-1.5 rounded hover:border-[#2A2A2A] transition-all">
                  {copied ? <><Check size={11} className="text-green-400" /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
                <button onClick={download} className="flex items-center gap-1 text-xs text-[#6B6560] hover:text-[#F7F4EF] border border-[#1E1E1E] px-3 py-1.5 rounded hover:border-[#2A2A2A] transition-all">
                  <Download size={11} /> Download
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 relative" style={{ overflow: tab === 'code' ? 'auto' : 'hidden' }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D] z-10">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-[#E8A020] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-[#6B6560]">Generating your component...</p>
                  <p className="text-xs text-[#3A3A3A] mt-1">This takes 5–15 seconds</p>
                </div>
              </div>
            )}
            {!code && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center opacity-40">
                  <Zap size={40} className="text-[#E8A020] mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-[#6B6560]">Your component will appear here</p>
                  <p className="text-xs text-[#3A3A3A] mt-1">Describe it on the left and hit generate</p>
                </div>
              </div>
            )}
            {code && tab === 'preview' && (
              <iframe
                srcDoc={framework === 'react' ? wrapReactPreview(code) : wrapHtmlPreview(code)}
                className="w-full h-full border-0"
                title="Component Preview"
                sandbox="allow-scripts"
              />
            )}
            {code && tab === 'code' && (
              <div className="bg-[#080808] p-6 min-h-full">
                <pre className="text-xs text-[#A0A0A0] font-mono leading-relaxed whitespace-pre-wrap break-words">{code}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function wrapHtmlPreview(code: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px; font-family: system-ui, sans-serif; background: #f8f8f8; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; }
  </style>
</head>
<body>${code}</body>
</html>`
}

function wrapReactPreview(code: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>body { margin: 0; padding: 32px; font-family: system-ui, sans-serif; background: #f8f8f8; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}
    const rootEl = document.getElementById('root');
    const root = ReactDOM.createRoot(rootEl);
    root.render(React.createElement(App || (() => React.createElement('div', null, 'Component loaded'))));
  </script>
</body>
</html>`
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center"><div className="text-[#6B6560]">Loading...</div></div>}>
      <GeneratePageInner />
    </Suspense>
  )
}
