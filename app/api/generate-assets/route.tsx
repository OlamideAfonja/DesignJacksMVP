import { NextRequest, NextResponse } from 'next/server'
import { genAI, MODEL } from '@/lib/gemini'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { brand, industry, mood } = await req.json()

    const model = genAI.getGenerativeModel({ model: MODEL })

    const result = await model.generateContent(`Generate a complete design system for:
Brand: ${brand || 'a modern tech startup'}
Industry: ${industry || 'SaaS'}
Mood: ${mood || 'professional, trustworthy, innovative'}

Return ONLY valid JSON (no markdown) with this structure:
{
  "colors": {
    "primary": "#hex",
    "primaryLight": "#hex",
    "primaryDark": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "text": "#hex",
    "textMuted": "#hex",
    "border": "#hex",
    "success": "#hex",
    "warning": "#hex",
    "error": "#hex"
  },
  "typography": {
    "displayFont": "Google Font name",
    "bodyFont": "Google Font name",
    "monoFont": "Google Font name",
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    }
  },
  "spacing": {
    "1": "4px", "2": "8px", "3": "12px", "4": "16px",
    "5": "20px", "6": "24px", "8": "32px", "10": "40px",
    "12": "48px", "16": "64px"
  },
  "borderRadius": {
    "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px"
  },
  "shadows": {
    "sm": "box-shadow value",
    "md": "box-shadow value",
    "lg": "box-shadow value"
  },
  "rationale": "Brief explanation of the design choices"
}`)

    const raw = result.response.text()
    const clean = raw.replace(/```json|```/g, '').trim()
    const assets = JSON.parse(clean)

    return NextResponse.json({ assets, brand, industry, mood })
  } catch (error: unknown) {
    console.error('Assets error:', error)
    const message = error instanceof Error ? error.message : 'Asset generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
