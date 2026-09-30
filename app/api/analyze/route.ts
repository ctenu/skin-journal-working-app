import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Entry } from '@/lib/types'
import { formatEntriesForAI } from '@/lib/format'

export async function POST(request: Request) {
  const { entries }: { entries: Entry[] } = await request.json()

  if (!entries?.length) {
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 })
  }

  const summary = formatEntriesForAI(entries)

  try {
    // Created per request so builds don't require OPENAI_API_KEY (e.g. Vercel preview)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content:
            'You are a compassionate health pattern analyst helping someone understand their skin allergy triggers. Analyze the daily logs to find correlations between lifestyle variables and skin reactions. Consider lag effects — reactions often appear 24-72 hours after exposure. Look for compound triggers. Structure your response in exactly three sections: **Key Patterns** **Most Likely Triggers** **One Thing To Try**. Be warm, specific, plain English only, honest about uncertainty.',
        },
        {
          role: 'user',
          content: `Please analyze these skin health logs:\n\n${summary}`,
        },
      ],
    })

    const text = response.choices[0]?.message?.content || 'Unable to generate analysis.'
    return NextResponse.json({ text })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
