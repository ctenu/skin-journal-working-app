import { afterEach, describe, expect, it } from 'vitest'
import { fmtDate, toLocalDateString } from '@/lib/format'

const originalTZ = process.env.TZ

afterEach(() => {
  process.env.TZ = originalTZ
})

// Regression tests: dates were saved as the UTC day and displayed as midnight UTC,
// so in the US a morning entry showed under the previous day and an evening entry
// was stored with tomorrow's date
describe.each(['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Pacific/Auckland'])(
  'in %s',
  (tz) => {
    it('displays a stored date as that same calendar day', () => {
      process.env.TZ = tz
      expect(fmtDate('2026-09-30')).toBe('Wednesday, September 30')
      expect(fmtDate('2026-01-01')).toBe('Thursday, January 1')
    })

    it('saves the day shown on the device clock, early morning and late evening', () => {
      process.env.TZ = tz
      expect(toLocalDateString(new Date(2026, 8, 30, 0, 5))).toBe('2026-09-30')
      expect(toLocalDateString(new Date(2026, 8, 30, 23, 55))).toBe('2026-09-30')
    })

    it('round-trips: what is saved is what is displayed', () => {
      process.env.TZ = tz
      const lateEvening = new Date(2026, 11, 31, 22, 30)
      expect(fmtDate(toLocalDateString(lateEvening))).toBe('Thursday, December 31')
    })
  }
)

describe('toLocalDateString', () => {
  it('uses local time, not UTC, near midnight', () => {
    process.env.TZ = 'America/New_York'
    // 01:30 UTC on Oct 1 is 21:30 on Sep 30 in New York
    expect(toLocalDateString(new Date('2026-10-01T01:30:00Z'))).toBe('2026-09-30')
  })

  it('zero-pads month and day', () => {
    expect(toLocalDateString(new Date(2026, 0, 5, 12))).toBe('2026-01-05')
  })
})
