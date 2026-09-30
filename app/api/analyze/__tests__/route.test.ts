import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

// Regression test: creating the OpenAI client at module load crashed `next build`
// on Vercel preview, where OPENAI_API_KEY isn't set
describe('POST /api/analyze', () => {
  it('can be loaded without OPENAI_API_KEY', async () => {
    vi.stubEnv('OPENAI_API_KEY', undefined)
    await expect(import('@/app/api/analyze/route')).resolves.toHaveProperty('POST')
  })

  it('returns 400 when no entries are sent', async () => {
    const { POST } = await import('@/app/api/analyze/route')
    const res = await POST(
      new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({ entries: [] }) })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'No entries provided' })
  })
})
