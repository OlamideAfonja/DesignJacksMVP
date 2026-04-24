'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Palette, RefreshCw, Copy, Check } from 'lucide-react'

interface DesignAssets {
  colors: Record<string, string>
  typography: { displayFont: string; bodyFont: string; monoFont: string; scale: Record<string, string> }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  rationale: string
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button onClick={copy} className="group flex items-center gap-3 p-2 rounded hover:bg-[#111] transition-all w-full text-left">
      <div className="w-8 h-8 rounded border border-white/10 flex-shrink-0" style={{ backgroundColor: hex }} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium capitalize">{name}</p>
        <p className="text-[10px] font-mono text-[#6B6560]">{hex}</p>
      </div>
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} className="text-[#3A3A3A] group-hover:text-[#6B6560]" />}
    </button>
  )
}

const INDUSTRIES = ['SaaS', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Media', 'Gaming', 'Real Estate']
const MOODS = ['Professional & trustworthy', 'Playful & energetic', 'Minimal & refined', 'Bold & expressive', 'Warm & friendly', 'Dark & sophisticated']

export default function AssetsPage() {
  const [brand, setBrand] = useState('')
  const [industry, setIndustry] = useState('SaaS')
  const [mood, setMood] = useState('Professional & trustworthy')
  const [assets, setAssets] = useState<DesignAssets | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!brand.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, industry, mood }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAssets(data.assets)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const exportCSS = () => {
    if (!assets) return
    const css = `:root {
${Object.entries(assets.colors).map(([k, v]) => `  --color-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`).join('\n')}

${Object.entries(assets.typography.scale).map(([k, v]) => `  --text-${k}: ${v};`).join('\n')}

  --font-display: '${assets.typography.displayFont}', serif;
  --font-body: '${assets.typography.bodyFont}', sans-serif;
  --font-mono: '${assets.typography.monoFont}', monospace;

${Object.entries(assets.spacing).map(([k, v]) => `  --space-${k}: ${v};`).join('\n')}

${Object.entries(assets.borderRadius).map(([k, v]) => `  --radius-${k}: ${v};`).join('\n')}
}`
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'design-tokens.css'; a.click()
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F7F4EF]">
      <header className="border-b border-[#1E1E1E] h-14 flex items-center px-6 gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#6B6560] hover:text-[#F7F4EF] transition-colors">
          <ArrowLeft size={16} /><span className="text-sm">Dashboard</span>
        </Link>
        <div className="w-px h-4 bg-[#1E1E1E]" />
        <Palette size={14} className="text-[#3B9EE8]" />
        <span className="text-sm font-medium">Design System Generator</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-mono text-[#3B9EE8] uppercase tracking-widest mb-2">ASSETS</p>
          <h1 style={{fontFamily: 'Playfair Display, serif'}} className="text-3xl font-bold">Generate your design system</h1>
          <p className="text-[#6B6560] mt-2 text-sm">Get colors, typography, and spacing tokens tailored to your brand.</p>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-3">
            <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Brand / Product Name</label>
            <input
              value={brand}
              onChange={e => setBrand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. Beacon Analytics — an enterprise data visualization platform"
              className="w-full bg-[#111] border border-[#2A2A2A] rounded p-3 text-sm text-[#F7F4EF] placeholder-[#3A3A3A] focus:outline-none focus:border-[#3B9EE8] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Industry</label>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="w-full bg-[#111] border border-[#2A2A2A] rounded p-3 text-sm text-[#F7F4EF] focus:outline-none focus:border-[#3B9EE8] transition-colors"
            >
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-[#6B6560] uppercase tracking-widest block mb-2">Mood / Personality</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button key={m} onClick={() => setMood(m)}
                  className={`text-xs px-3 py-1.5 rounded border transition-all ${mood === m ? 'bg-[#3B9EE8] text-white border-[#3B9EE8]' : 'border-[#2A2A2A] text-[#6B6560] hover:border-[#3B9EE8]'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={generate} disabled={loading || !brand.trim()}
          className="flex items-center gap-2 bg-[#3B9EE8] text-white px-6 py-3 rounded font-semibold hover:bg-[#5AB0F0] transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-10">
          {loading ? <><RefreshCw size={15} className="animate-spin" /> Generating...</> : <><Palette size={15} /> Generate Design System</>}
        </button>

        {error && <div className="bg-red-950/40 border border-red-900/50 rounded p-3 text-sm text-red-400 mb-6">{error}</div>}

        {assets && (
          <div className="space-y-8">
            {/* Rationale */}
            <div className="bg-[#0A0E14] border border-[#3B9EE8]/20 rounded-lg p-5">
              <p className="text-xs font-mono text-[#3B9EE8] uppercase tracking-widest mb-2">Design Rationale</p>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">{assets.rationale}</p>
            </div>

            {/* Colors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Color Palette</h2>
                {/* Swatch row */}
                <div className="flex gap-1">
                  {Object.values(assets.colors).slice(0, 8).map((hex, i) => (
                    <div key={i} className="w-6 h-6 rounded border border-white/10" style={{ backgroundColor: hex }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 bg-[#111] border border-[#1E1E1E] rounded-lg p-3">
                {Object.entries(assets.colors).map(([name, hex]) => (
                  <ColorSwatch key={name} name={name} hex={hex} />
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h2 className="font-semibold mb-4">Typography</h2>
              <div className="bg-[#111] border border-[#1E1E1E] rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {[['Display', assets.typography.displayFont], ['Body', assets.typography.bodyFont], ['Mono', assets.typography.monoFont]].map(([type, font]) => (
                    <div key={type}>
                      <p className="text-xs text-[#6B6560] mb-1">{type}</p>
                      <p className="font-medium text-sm">{font}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#1E1E1E] pt-4">
                  <p className="text-xs text-[#6B6560] mb-3">Type Scale</p>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(assets.typography.scale).map(([size, val]) => (
                      <div key={size} className="text-center">
                        <p className="text-[10px] font-mono text-[#6B6560]">{size}</p>
                        <p className="text-[10px] text-[#3A3A3A]">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Spacing & Radius */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-4">Spacing Scale</h2>
                <div className="bg-[#111] border border-[#1E1E1E] rounded-lg p-5 space-y-2">
                  {Object.entries(assets.spacing).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#6B6560] w-6">{k}</span>
                      <div className="h-3 bg-[#E8A020]/60 rounded" style={{ width: v }} />
                      <span className="text-xs font-mono text-[#3A3A3A]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-semibold mb-4">Border Radius</h2>
                <div className="bg-[#111] border border-[#1E1E1E] rounded-lg p-5 space-y-3">
                  {Object.entries(assets.borderRadius).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#6B6560] w-10">{k}</span>
                      <div className="w-10 h-6 bg-[#3B9EE8]/30 border border-[#3B9EE8]/40" style={{ borderRadius: v }} />
                      <span className="text-xs font-mono text-[#3A3A3A]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export */}
            <div className="flex gap-3">
              <button onClick={exportCSS}
                className="flex items-center gap-2 bg-[#3B9EE8] text-white px-5 py-2.5 rounded font-medium text-sm hover:bg-[#5AB0F0] transition-all">
                Export CSS Variables
              </button>
              <Link href={`/generate?prompt=Use these brand colors: primary ${assets.colors.primary}, secondary ${assets.colors.secondary}. Generate a hero section component`}
                className="flex items-center gap-2 border border-[#2A2A2A] text-[#6B6560] px-5 py-2.5 rounded font-medium text-sm hover:border-[#E8A020] hover:text-[#E8A020] transition-all">
                Use in Generator →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
