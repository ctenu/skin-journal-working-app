import { describe, expect, it } from 'vitest'
import { validateEntry } from '@/lib/validate'

const valid = {
  date: '2026-01-05',
  foods: ['oat milk'],
  stress: 3,
  sleep: 4,
  skincare: ['CeraVe'],
  exposures: [],
  exercise: 'rest day',
  meds: ['vitamin D'],
  symptoms: ['itching'],
  severity: 2,
  notes: 'felt fine',
  photo: null,
}

describe('validateEntry', () => {
  it('accepts a valid entry', () => {
    const result = validateEntry(valid)
    expect(result).toEqual({ ok: true, entry: valid })
  })

  it('strips fields the client must not set', () => {
    const result = validateEntry({ ...valid, id: 99, user_id: 'someone-else', created_at: '2020-01-01', admin: true })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.entry).not.toHaveProperty('id')
      expect(result.entry).not.toHaveProperty('user_id')
      expect(result.entry).not.toHaveProperty('created_at')
      expect(result.entry).not.toHaveProperty('admin')
    }
  })

  it.each([
    ['stress', 0],
    ['stress', 6],
    ['sleep', 0],
    ['sleep', 6],
    ['severity', -1],
    ['severity', 6],
    ['stress', 2.5],
    ['sleep', '3'],
  ])('rejects %s = %s', (field, value) => {
    const result = validateEntry({ ...valid, [field]: value })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain(field)
  })

  it('accepts the edges of each range', () => {
    expect(validateEntry({ ...valid, stress: 1, sleep: 5, severity: 0 }).ok).toBe(true)
    expect(validateEntry({ ...valid, stress: 5, sleep: 1, severity: 5 }).ok).toBe(true)
  })

  it('requires a date', () => {
    const { date: _date, ...noDate } = valid
    expect(validateEntry(noDate).ok).toBe(false)
    expect(validateEntry({ ...valid, date: 'yesterday' }).ok).toBe(false)
  })

  it('rejects non-objects and malformed lists', () => {
    expect(validateEntry(null).ok).toBe(false)
    expect(validateEntry([valid]).ok).toBe(false)
    expect(validateEntry({ ...valid, foods: 'oat milk' }).ok).toBe(false)
    expect(validateEntry({ ...valid, meds: [1, 2] }).ok).toBe(false)
  })

  it('fills defaults for omitted optional fields', () => {
    const result = validateEntry({ date: '2026-01-05', stress: 3, sleep: 3 })
    expect(result).toEqual({
      ok: true,
      entry: {
        date: '2026-01-05', stress: 3, sleep: 3, severity: 0,
        foods: [], skincare: [], exposures: [], meds: [], symptoms: [],
        exercise: '', notes: '', photo: null,
      },
    })
  })
})
