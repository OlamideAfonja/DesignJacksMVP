'use client'
import Link from 'next/link'
import { ArrowLeft, Zap, Palette, Search, Code2, ArrowRight, Clock, Star } from 'lucide-react'

const tools = [
  {
    href: '/generate',
    icon: Zap,
    title: 'Component Generator',
    desc: 'Describe any UI component in English and get production-ready code instantly. Supports HTML/CSS, React, and Tailwind.',
    tag: 'CORE',
    color: '#E8A020',
    cta: 'Start generating',
  },
  {
    href: '/assets',
    icon: Palette,
    title: 'Design System Generator',
    desc: 'Generate complete color palettes, typography scales, spacing systems, and component tokens from a brand description.',
    tag: 'ASSETS',
    color: '#3B9EE8',
    cta: 'Build system',
  },
  {
    href: '/analyze',
    icon: Search,
    title: 'Design Analyzer',
    desc: 'Describe your existing UI and get AI-powered feedback on usability, accessibility, aesthetics, and UX best practices.',
    tag: 'ANALYZE',
    color: '#7C3AED',
    cta: 'Analyze design',
  },
]

const recent = [
  { prompt: 'Dark pricing card with 3 tiers', framework: 'React', time: '2m ago', score: null },
  { prompt: 'Mobile navigation with hamburger menu', framework: 'HTML/CSS', time: '15m ago', score: null },
  { prompt: 'User profile card with stats', framework: 'Tailwind', time: '1h ago', score: null },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F7F4EF]">
      {/* Header */}
      <header className="border-b border-[#1E1E1E] h-14 flex items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 text-[#6B6560] hover:text-[#F7F4EF] transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Home</span>
        </Link>
        <div className="w-px h-4 bg-[#1E1E1E]" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#E8A020] rounded flex items-center justify-center">
            <span className="text-[#0D0D0D] font-bold text-[9px] font-mono">DJ</span>
          </div>
          <span className="text-sm font-medium">Dashboard</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <p className="text-xs font-mono text-[#E8A020] uppercase tracking-widest mb-2">DesignJacks MVP</p>
          <h1 style={{fontFamily: 'Playfair Display, serif'}} className="text-4xl font-bold mb-3">
            What are we building today?
          </h1>
          <p className="text-[#6B6560]">Choose a tool to start designing with AI.</p>
        </div>

        {/* Tool cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-[#111] border border-[#1E1E1E] rounded-lg p-6 hover:border-[#2A2A2A] transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded border flex items-center justify-center transition-colors"
                  style={{ borderColor: tool.color + '33', backgroundColor: tool.color + '11' }}>
                  <tool.icon size={18} style={{ color: tool.color }} />
                </div>
                <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border"
                  style={{ color: tool.color, borderColor: tool.color + '33' }}>
                  {tool.tag}
                </span>
              </div>
              <h2 className="font-semibold text-base mb-2">{tool.title}</h2>
              <p className="text-xs text-[#6B6560] leading-relaxed mb-5">{tool.desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-medium transition-all"
                style={{ color: tool.color }}>
                {tool.cta} <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activity (static placeholder) */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Clock size={14} className="text-[#6B6560]" />
            <span className="text-sm font-medium">Recent Generations</span>
            <span className="text-xs text-[#3A3A3A] font-mono">(session history — resets on refresh)</span>
          </div>
          <div className="border border-[#1E1E1E] rounded-lg overflow-hidden">
            {recent.map((item, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#111] transition-colors ${i > 0 ? 'border-t border-[#1E1E1E]' : ''}`}>
                <div className="w-6 h-6 bg-[#1A1A1A] rounded border border-[#2A2A2A] flex items-center justify-center">
                  <Code2 size={11} className="text-[#6B6560]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.prompt}</p>
                  <p className="text-xs text-[#6B6560]">{item.framework} · {item.time}</p>
                </div>
                <Link href={`/generate?prompt=${encodeURIComponent(item.prompt)}`}
                  className="text-xs text-[#6B6560] hover:text-[#E8A020] transition-colors">
                  Re-run →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-10 bg-[#0E0B00] border border-[#E8A020]/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star size={13} className="text-[#E8A020]" />
            <span className="text-xs font-mono text-[#E8A020] uppercase tracking-widest">Pro Tips</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#6B6560]">
            <li>→ Be specific: "a dark SaaS pricing card with 3 tiers, monthly/annual toggle, and CTA button" gets better results than "pricing card"</li>
            <li>→ Use ⌘+Enter in the generator to quickly re-run with tweaks</li>
            <li>→ Run Design Analyzer on your generated components for instant UX feedback</li>
            <li>→ Start with the Design System Generator to establish brand tokens, then use them in component prompts</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
