'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.signOut()
  }, [])

  async function handleSendOtp() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (error) {
      setError(error.message)
    } else {
      setStep('otp')
    }
    setLoading(false)
  }

  async function handleVerifyOtp() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  if (step === 'otp') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Check your email</h1>
          <p style={subtitleStyle}>
            Enter the 6-digit code sent to <strong>{email}</strong>.
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={(e) => e.key === 'Enter' && otp.length === 6 && handleVerifyOtp()}
            style={inputStyle}
            autoFocus
          />
          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            style={buttonStyle}
          >
            {loading ? 'Verifying...' : 'Verify code →'}
          </button>
          <button onClick={() => { setStep('email'); setOtp(''); setError('') }} style={linkButtonStyle}>
            Use a different email
          </button>
          {error && <p style={{ fontSize: '13px', color: 'red', margin: 0 }}>{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Skin Journal</h1>
        <p style={subtitleStyle}>Enter your email to receive a sign-in code.</p>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
          style={inputStyle}
        />
        <button
          onClick={handleSendOtp}
          disabled={!email || loading}
          style={buttonStyle}
        >
          {loading ? 'Sending...' : 'Send code →'}
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

const linkButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--muted)',
  fontSize: '13px',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
}