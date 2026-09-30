import { Entry } from '@/lib/types'

// Fields a client may set; id, user_id and created_at are assigned by the server/database
export type NewEntry = Omit<Entry, 'id' | 'user_id' | 'created_at'>

export type ValidationResult = { ok: true; entry: NewEntry } | { ok: false; error: string }

function isIntInRange(v: unknown, min: number, max: number): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

export function validateEntry(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, error: 'Entry must be an object' }
  }
  const b = body as Record<string, unknown>

  if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) {
    return { ok: false, error: 'date is required (YYYY-MM-DD)' }
  }
  if (!isIntInRange(b.stress, 1, 5)) return { ok: false, error: 'stress must be a whole number from 1 to 5' }
  if (!isIntInRange(b.sleep, 1, 5)) return { ok: false, error: 'sleep must be a whole number from 1 to 5' }
  if (!isIntInRange(b.severity ?? 0, 0, 5)) return { ok: false, error: 'severity must be a whole number from 0 to 5' }

  const lists = ['foods', 'skincare', 'exposures', 'meds', 'symptoms'] as const
  for (const key of lists) {
    if (b[key] !== undefined && !isStringArray(b[key])) {
      return { ok: false, error: `${key} must be a list of text items` }
    }
  }
  for (const key of ['exercise', 'notes'] as const) {
    if (b[key] !== undefined && b[key] !== null && typeof b[key] !== 'string') {
      return { ok: false, error: `${key} must be text` }
    }
  }
  if (b.photo !== undefined && b.photo !== null && typeof b.photo !== 'string') {
    return { ok: false, error: 'photo must be an image data URL' }
  }

  // Build the entry from known fields only, so unexpected keys never reach the database
  const entry: NewEntry = {
    date: b.date,
    stress: b.stress,
    sleep: b.sleep,
    severity: (b.severity as number | undefined) ?? 0,
    foods: (b.foods as string[] | undefined) ?? [],
    skincare: (b.skincare as string[] | undefined) ?? [],
    exposures: (b.exposures as string[] | undefined) ?? [],
    meds: (b.meds as string[] | undefined) ?? [],
    symptoms: (b.symptoms as string[] | undefined) ?? [],
    exercise: (b.exercise as string | null | undefined) ?? '',
    notes: (b.notes as string | null | undefined) ?? '',
    photo: (b.photo as string | null | undefined) ?? null,
  }
  return { ok: true, entry }
}
