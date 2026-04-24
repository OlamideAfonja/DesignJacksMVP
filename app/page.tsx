'use client'
import Link from 'next/link'
import { ArrowRight, Zap, Code2, Palette, Layers, Star, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'AI Component Generation',
    desc: 'Describe any UI component in plain English. Get production-ready HTML, CSS, and React code instantly.',
    tag: 'Core',
  },
  {
    icon: Palette,
    title: 'Design System Builder',
    desc: 'Generate complete color palettes, typography scales, and spacing systems tailored to your brand.',
    tag: 'Assets',
  },
  {
    icon: Layers,
    title: 'Design Analysis',
    desc: 'Upload any screenshot or design file. Get detailed UX feedback, accessibility scores, and improvement suggestions.',
    tag: 'Analyze',
  },
  {
    icon: Code2,
    title: 'Code Export',
    desc: 'Export to React, Vue, HTML/CSS, or Tailwind. Framework-agnostic output that integrates into any stack.',
    tag: 'Export',
  },
]

const examples = [
  'a dark-mode SaaS pricing page with 3 tiers',
  'a mobile login form with social auth buttons',
  'a dashboard stat card with sparkline chart',
  'a minimal blog post card with hover effects',
  'a product page hero with glassmorphism',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F7F4EF]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E1E1E] bg-[#0D0D0D]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#E8A020] rounded flex items-center justify-center">
              <span className="text-[#0D0D0D] font-bold text-xs font-mono">DJ</span>
            </div>
            <span style={{fontFamily: 'Playfair Display, serif'}} className="text-lg font-semibold">DesignJacks</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B6560]">
            <Link href="#features" className="hover:text-[#F7F4EF] transition-colors">Features</Link>
            <Link href="#examples" className="hover:text-[#F7F4EF] transition-colors">Examples</Link>
            <Link href="/dashboard" className="hover:text-[#F7F4EF] transition-colors">Dashboard</Link>
          </div>
          <Link href="/generate" className="flex items-center gap-2 bg-[#E8A020] text-[#0D0D0D] px-4 py-2 rounded text-sm font-semibold hover:bg-[#F5C560] transition-colors">
            Start Free <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#F7F4EF 1px, transparent 1px), linear-gradient(90deg, #F7F4EF 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E8A020] opacity-[0.06] blur-[100px] rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 border border-[#2A2A2A] rounded-full px-4 py-1.5 text-xs text-[#6B6560] mb-8">
            <span className="w-1.5 h-1.5 bg-[#E8A020] rounded-full animate-pulse" />
            Powered by Gemini AI
          </div>

          <h1 style={{fontFamily: 'Playfair Display, serif'}} className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
            Design at the<br />
            <span className="text-[#E8A020] italic">speed of thought</span>
          </h1>

          <p className="text-lg text-[#6B6560] max-w-2xl mx-auto mb-10 leading-relaxed">
            DesignJacks turns plain-English descriptions into polished UI components,
            complete design systems, and production-ready code — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/generate" className="flex items-center justify-center gap-2 bg-[#E8A020] text-[#0D0D0D] px-6 py-3.5 rounded font-semibold hover:bg-[#F5C560] transition-all hover:scale-105">
              Generate a Component <ArrowRight size={16} />
            </Link>
            <Link href="/dashboard" className="flex items-center justify-center gap-2 border border-[#2A2A2A] px-6 py-3.5 rounded font-medium text-[#6B6560] hover:border-[#E8A020] hover:text-[#F7F4EF] transition-all">
              Open Dashboard
            </Link>
          </div>

          {/* Example prompts ticker */}
          <div className="mt-14 flex flex-wrap gap-2 justify-center">
            {examples.map((ex, i) => (
              <Link key={i} href={`/generate?prompt=${encodeURIComponent(ex)}`}
                className="text-xs text-[#6B6560] border border-[#1E1E1E] rounded-full px-3 py-1.5 hover:border-[#E8A020] hover:text-[#E8A020] transition-all">
                "{ex}"
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-[#1E1E1E] py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-12">
          {[
            { val: '10x', label: 'Faster design workflow' },
            { val: '4', label: 'Export frameworks' },
            { val: 'WCAG', label: 'Accessibility checks' },
            { val: 'Free', label: 'to start today' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div style={{fontFamily: 'Playfair Display, serif'}} className="text-2xl font-bold text-[#E8A020]">{s.val}</div>
              <div className="text-xs text-[#6B6560] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs text-[#E8A020] font-mono tracking-widest uppercase mb-3">CAPABILITIES</p>
            <h2 style={{fontFamily: 'Playfair Display, serif'}} className="text-4xl md:text-5xl font-bold">
              Everything a designer needs
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[#1E1E1E]">
            {features.map((f, i) => (
              <div key={i} className="bg-[#0D0D0D] p-8 group hover:bg-[#111] transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 border border-[#2A2A2A] rounded flex items-center justify-center group-hover:border-[#E8A020] transition-colors">
                    <f.icon size={18} className="text-[#E8A020]" />
                  </div>
                  <span className="text-xs text-[#6B6560] font-mono border border-[#1E1E1E] px-2 py-0.5 rounded">{f.tag}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-[#6B6560] leading-relaxed text-sm">{f.desc}</p>
                <div className="mt-6">
                  <Link href="/generate" className="inline-flex items-center gap-1 text-xs text-[#E8A020] hover:gap-2 transition-all">
                    Try it <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#1E1E1E]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-[#E8A020] fill-[#E8A020]" />)}
          </div>
          <h2 style={{fontFamily: 'Playfair Display, serif'}} className="text-4xl md:text-5xl font-bold mb-6">
            Start building<br /><span className="italic">beautiful interfaces</span>
          </h2>
          <p className="text-[#6B6560] mb-10">No credit card required. No design skills needed. Just describe what you want.</p>
          <Link href="/generate" className="inline-flex items-center gap-2 bg-[#E8A020] text-[#0D0D0D] px-8 py-4 rounded font-bold text-lg hover:bg-[#F5C560] transition-all hover:scale-105">
            Generate Your First Component <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E1E] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#E8A020] rounded flex items-center justify-center">
              <span className="text-[#0D0D0D] font-bold text-xs font-mono">DJ</span>
            </div>
            <span className="text-sm text-[#6B6560]">DesignJacks MVP</span>
          </div>
          <p className="text-xs text-[#6B6560]">Built with Next.js + Claude AI · Deploy to Vercel</p>
        </div>
      </footer>
    </div>
  )
}
