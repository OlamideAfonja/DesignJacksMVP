import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODEL } from '@/lib/anthropic'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { description, context } = await req.json()

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Analyze this UI/UX design and provide detailed feedback:

Design Description: ${description}
Context/Purpose: ${context || 'Not specified'}

Return ONLY valid JSON (no markdown) with this structure:
{
  "overallScore": 85,
  "summary": "Brief overall assessment",
  "scores": {
    "usability": 90,
    "accessibility": 75,
    "aesthetics": 88,
    "performance": 82,
    "consistency": 85
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "issues": [
    {
      "severity": "high|medium|low",
      "category": "accessibility|usability|aesthetics|performance",
      "issue": "description",
      "fix": "recommended fix"
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "accessibilityNotes": "WCAG compliance notes",
  "improvementPrompt": "A ready-to-use prompt to regenerate this component with improvements applied"
}`
        }
      ],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const clean = raw.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(clean)

    return NextResponse.json({ analysis })
  } catch (error: unknown) {
    console.error('Analyze error:', error)
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
