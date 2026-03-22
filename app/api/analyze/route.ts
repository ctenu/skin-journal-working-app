import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Entry } from '@/lib/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export async function POST(request: Request) {
  const { entries }: { entries: Entry[] } = await request.json()

  if (!entries?.length) {
    return NextResponse.json({ error: 'No entries provided' }, { status: 400 })
  }

  const summary = entries
    .map(
      (e) =>
        `Date: ${fmtDate(e.date)}\nFoods: ${e.foods.join(', ') || 'none'}\nStress: ${e.stress}/5 | Sleep: ${e.sleep}/5\nSkincare: ${e.skincare.join(', ') || 'none'}\nExposures: ${e.exposures.join(', ') || 'none'}\nExercise: ${e.exercise || 'none'}\nMedications: ${e.meds.join(', ') || 'none'}\nSkin: ${e.symptoms.length ? e.symptoms.join(', ') + ' (severity ' + e.severity + '/5)' : 'none'}\nNotes: ${e.notes || '—'}`
    )
    .join('\n---\n')

  try {
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
