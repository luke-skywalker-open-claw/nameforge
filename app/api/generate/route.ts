import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json()

    if (!description || typeof description !== 'string' || description.length > 300) {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 })
    }

    const prompt = `You are a creative business naming expert. Given a business/project description, generate exactly 10 unique, creative name suggestions.

For each name, provide:
- name: The business/project name (short, memorable, brandable)
- domain: A suggested .com or .io domain
- domainAvailable: One of "Likely Available", "Likely Taken", or "Check Required" (make educated guesses based on how common/generic the name is)
- rationale: 1-2 sentences explaining the name's meaning, wordplay, or why it works
- vibeScore: 1-10 rating of how catchy/memorable/brandable the name is

Business description: "${description}"

Respond ONLY with valid JSON, no markdown. Format:
{"names": [{"name": "...", "domain": "...", "domainAvailable": "...", "rationale": "...", "vibeScore": 8}, ...]}

Be creative! Mix wordplay, portmanteaus, metaphors, and invented words. Avoid generic names.`

    const { text } = await generateText({
      model: anthropic('claude-3-5-haiku-latest'),
      prompt,
    })

    // Parse JSON from response (handle possible markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Generate error:', err)
    return NextResponse.json(
      { error: 'Failed to generate names. Please try again.' },
      { status: 500 }
    )
  }
}
