// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import HistoryPanel from '@/components/HistoryPanel'
import { Entry } from '@/lib/types'

afterEach(cleanup)

const entry: Entry = {
  id: 1,
  date: '2026-01-05',
  foods: ['oat milk'],
  stress: 3,
  sleep: 4,
  skincare: [],
  exposures: [],
  exercise: 'shoulder day with cardio',
  meds: ['vitamin D', 'antihistamine'],
  symptoms: [],
  severity: 0,
  notes: '',
  photo: null,
}

// Regression test: exercise and medications were saved but never shown in History
describe('HistoryPanel', () => {
  it('shows exercise and medications', () => {
    render(<HistoryPanel entries={[entry]} />)
    expect(screen.getByText('Exercise')).toBeTruthy()
    expect(screen.getByText('shoulder day with cardio')).toBeTruthy()
    expect(screen.getByText('Medications')).toBeTruthy()
    expect(screen.getByText('vitamin D')).toBeTruthy()
    expect(screen.getByText('antihistamine')).toBeTruthy()
  })

  it('shows a dash when exercise and medications are empty', () => {
    render(<HistoryPanel entries={[{ ...entry, exercise: '', meds: [] }]} />)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
  })
})
