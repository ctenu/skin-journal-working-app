'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Check your email ✉️</h1>
          <p style={subtitleStyle}>
            We sent a magic link to <strong>{email}</strong>.{' '}
            Click it to sign in — no password needed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Skin Journal</h1>
        <p style={subtitleStyle}>Enter your email to receive a sign-in link.</p>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={inputStyle}
        />
        <button
          onClick={handleLogin}
          disabled={!email || loading}
          style={buttonStyle}
        >
          {loading ? 'Sending...' : 'Send magic link →'}
        </button>
        {error && <p style={{ fontSize: '13px', color: 'red', margin: 0 }}>{error}</p>}
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
}

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 500,
  margin: 0,
}

const subtitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--muted)',
  margin: 0,
  lineHeight: 1.6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '15px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '15px',
  borderRadius: '8px',
  border: 'none',
  background: 'var(--moss)',
  color: 'white',
  cursor: 'pointer',
  opacity: 1,
}