import { NextRequest, NextResponse } from 'next/server'
import { geminiGenerate } from '@/lib/gemini'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework = 'html', style = 'modern' } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemPrompt = `You are DesignJacks, an expert UI/UX designer and frontend engineer. 
Generate beautiful, production-ready UI components based on user descriptions.

Guidelines:
- Output ONLY valid ${framework === 'react' ? 'React JSX' : framework === 'tailwind' ? 'HTML with Tailwind classes' : 'HTML/CSS'} code
- Make designs visually stunning with attention to detail
- Use ${style} aesthetics: ${style === 'modern' ? 'clean lines, subtle shadows, smooth transitions' : style === 'glassmorphism' ? 'frosted glass, transparency, blur effects' : style === 'brutalist' ? 'raw, bold typography, high contrast' : 'elegant, refined, sophisticated'}
- Include hover states, transitions, and micro-interactions
- Ensure accessibility (proper ARIA labels, color contrast)
- Make it responsive by default
- DO NOT include markdown code fences — output raw code only
- For HTML/CSS: include a <style> block with all styles inline
- For React: use inline styles or a <style> tag, no external dependencies
- Add a brief comment at the top describing the component`

    const userPrompt = `Generate a UI component: ${prompt}\n\nFramework: ${framework}\nStyle: ${style}\n\nReturn only the code, no explanations.`

    const code = await geminiGenerate(userPrompt, systemPrompt)

    return NextResponse.json({ code, framework, style, prompt })
  } catch (error: unknown) {
    console.error('Generate error:', error)
    const message = error instanceof Error ? error.message : 'Generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
