import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: {
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    // Dates are stored as YYYY-MM-DD and parsed as UTC; pin the zone so formatted dates are stable
    env: { TZ: 'UTC' },
  },
})
