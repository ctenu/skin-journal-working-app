import { describe, expect, it } from 'vitest'
import { formatEntriesForAI } from '@/lib/format'
import { Entry } from '@/lib/types'

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    date: '2026-01-05',
    foods: [],
    stress: 3,
    sleep: 4,
    skincare: [],
    exposures: [],
    exercise: '',
    meds: [],
    symptoms: [],
    severity: 0,
    notes: '',
    photo: null,
    ...overrides,
  }
}

describe('formatEntriesForAI', () => {
  it('shows "none" for empty lists and fields', () => {
    const text = formatEntriesForAI([entry()])
    expect(text).toContain('Foods: none')
    expect(text).toContain('Skincare: none')
    expect(text).toContain('Exposures: none')
    expect(text).toContain('Exercise: none')
    expect(text).toContain('Medications: none')
    expect(text).toContain('Skin symptoms: none')
    expect(text).toContain('Notes: —')
  })

  it('lists items and includes stress, sleep and date', () => {
    const text = formatEntriesForAI([
      entry({ foods: ['oat milk', 'sushi'], meds: ['vitamin D'], exercise: 'shoulder day with cardio' }),
    ])
    expect(text).toContain('Date: Monday, January 5')
    expect(text).toContain('Foods: oat milk, sushi')
    expect(text).toContain('Medications: vitamin D')
    expect(text).toContain('Exercise: shoulder day with cardio')
    expect(text).toContain('Stress: 3/5 | Sleep: 4/5')
  })

  it('only shows severity when there are symptoms', () => {
    expect(formatEntriesForAI([entry({ severity: 4 })])).not.toContain('severity')
    expect(formatEntriesForAI([entry({ symptoms: ['itching', 'redness'], severity: 4 })])).toContain(
      'Skin symptoms: itching, redness (severity 4/5)'
    )
  })

  it('keeps long free-form text as a single item', () => {
    const text = formatEntriesForAI([entry({ foods: ['oatmeal with berries, then spicy ramen for dinner'] })])
    expect(text).toContain('Foods: oatmeal with berries, then spicy ramen for dinner')
  })

  it('separates multiple entries', () => {
    const text = formatEntriesForAI([entry(), entry({ date: '2026-01-06' })])
    expect(text.split('\n\n---\n\n')).toHaveLength(2)
  })

  it('does not crash on missing lists from older rows', () => {
    const legacy = entry({ foods: null as unknown as string[], symptoms: undefined as unknown as string[] })
    expect(formatEntriesForAI([legacy])).toContain('Foods: none')
  })
})
