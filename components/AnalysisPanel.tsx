'use client'

import { useState } from 'react'
import { Entry } from '@/lib/types'
import { formatEntriesForAI } from '@/lib/format'

interface AnalysisPanelProps {
  entries: Entry[]
  onCleared: () => void
}

export default function AnalysisPanel({ entries, onCleared }: AnalysisPanelProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')

  const n = entries.length

  async function analyze() {
    setAnalyzing(true)
    setResult('')
    setAnalyzeError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAnalyzeError(data.error || `Analysis failed (${res.status}). Please try again.`)
      } else {
        setResult(data.text || 'Unable to generate analysis.')
      }
    } catch {
      setAnalyzeError('Something went wrong. Please check your connection and try again.')
    }
    setAnalyzing(false)
  }

  function copyLogs() {
    const summary =
      'SKIN JOURNAL LOGS\n' +
      '='.repeat(40) +
      '\n\n' +
      formatEntriesForAI(entries) +
      '\n\n' +
      '='.repeat(40) +
      '\n\nPlease analyze these skin health logs and:\n1. Identify key patterns\n2. Highlight the most likely triggers (consider 24-72hr lag effects)\n3. Suggest one specific thing to try or eliminate'

    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 3000)
      })
      .catch(() => {
        alert('Could not copy automatically. Please take a screenshot of your history tab instead.')
      })
  }

  async function clearData() {
    if (confirm('Delete all entries? This cannot be undone.')) {
      try {
        const res = await fetch('/api/entries', { method: 'DELETE' })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          alert(`Could not delete entries: ${data.error || `error ${res.status}`}. Nothing was removed.`)
          return
        }
      } catch {
        alert('Could not delete entries — check your connection. Nothing was removed.')
        return
      }
      setResult('')
      onCleared()
    }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '18px' }}>
        <div className="card-title">🔬 AI Pattern Analysis</div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>
          Once you have a few days of entries, the AI will analyze your logs and surface potential trigger patterns —
          including lag effects that might not be obvious day-to-day.
        </p>
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '9px', fontWeight: 500 }}>
          {n ? `${n} entr${n === 1 ? 'y' : 'ies'} ready for analysis.` : 'No entries yet — log a few days first.'}
        </p>
      </div>

      <div className="card" style={{ marginBottom: '18px', border: '1.5px dashed var(--border)' }}>
        <div className="card-title" style={{ marginBottom: '8px' }}>
          📋 Manual Analysis (Workaround)
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '12px' }}>
          Copy your logs and paste them into{' '}
          <strong>
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--moss)' }}>
              claude.ai
            </a>
          </strong>{' '}
          and ask: <em>&ldquo;Analyze these skin logs and find trigger patterns.&rdquo;</em>
        </p>
        <button className="copybtn" onClick={copyLogs} disabled={!n}>
          📋 Copy All Logs to Clipboard
        </button>
        {copySuccess && (
          <p style={{ fontSize: '11px', color: 'var(--sage)', marginTop: '7px' }}>✓ Copied! Now paste into claude.ai</p>
        )}
      </div>

      <button className="analyzebtn" onClick={analyze} disabled={!n || analyzing}>
        {analyzing ? (
          <>
            Analyzing{' '}
            <span className="dots">
              <span />
              <span />
              <span />
            </span>
          </>
        ) : (
          'Analyze My Patterns →'
        )}
      </button>

      {analyzeError && <p style={{ fontSize: '13px', color: 'red', marginTop: '8px' }}>{analyzeError}</p>}

      {result && (
        <div className="result">
          <h3>✦ Your Pattern Report</h3>
          <div
            className="resulttext"
            dangerouslySetInnerHTML={{
              __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />'),
            }}
          />
        </div>
      )}

      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <button
          onClick={clearData}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            padding: '7px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: '12px',
          }}
        >
          🗑 Clear all data
        </button>
      </div>
    </div>
  )
}
