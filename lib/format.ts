import { Entry } from '@/lib/types'

// Entry dates are calendar days ("YYYY-MM-DD") in the user's own timezone, not instants.
// `new Date('2026-09-30')` would mean midnight UTC, which is the previous evening in the Americas,
// so dates are built from their parts instead.

export function toLocalDateString(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseLocalDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function fmtDate(date: string) {
  return parseLocalDate(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function list(items: string[] | null | undefined) {
  return items?.length ? items.join(', ') : 'none'
}

// Plain-text summary of entries, shared by the AI analysis route and the "copy logs" button
export function formatEntriesForAI(entries: Entry[]): string {
  return entries
    .map((e) =>
      [
        `Date: ${fmtDate(e.date)}`,
        `Foods: ${list(e.foods)}`,
        `Stress: ${e.stress}/5 | Sleep: ${e.sleep}/5`,
        `Skincare: ${list(e.skincare)}`,
        `Exposures: ${list(e.exposures)}`,
        `Exercise: ${e.exercise || 'none'}`,
        `Medications: ${list(e.meds)}`,
        `Skin symptoms: ${e.symptoms?.length ? `${e.symptoms.join(', ')} (severity ${e.severity}/5)` : 'none'}`,
        `Notes: ${e.notes || '—'}`,
      ].join('\n')
    )
    .join('\n\n---\n\n')
}
