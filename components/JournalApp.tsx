'use client'

import { useState, useEffect, useCallback } from 'react'
import { NotebookPen, BookOpen, Microscope } from 'lucide-react'
import LogPanel from './LogPanel'
import HistoryPanel from './HistoryPanel'
import AnalysisPanel from './AnalysisPanel'
import { Entry } from '@/lib/types'

type Tab = 'log' | 'history' | 'analysis'

export default function JournalApp() {
  const [tab, setTab] = useState<Tab>('log')
  const [entries, setEntries] = useState<Entry[]>([])
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [loadError, setLoadError] = useState('')

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/entries')
      const data = await res.json().catch(() => null)
      if (res.ok && Array.isArray(data)) {
        setEntries(data)
        setLoadError('')
      } else {
        setLoadError(`Couldn't load your entries${data?.error ? `: ${data.error}` : ''}. Try refreshing the page.`)
      }
    } catch {
      setLoadError("Couldn't load your entries — check your connection and refresh.")
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const isStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    const dismissed = localStorage.getItem('skinjournal-install-dismissed')
    if (isIos && !isStandalone && !dismissed) {
      setTimeout(() => setShowInstallBanner(true), 1500)
    }
  }, [])

  function dismissInstall() {
    setShowInstallBanner(false)
    localStorage.setItem('skinjournal-install-dismissed', '1')
  }

  const n = entries.length

  return (
    <div id="app">
      {showInstallBanner && (
        <div className="installbanner on">
          <span>📲 Add to home screen for the best experience</span>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              className="installbtn"
              onClick={() => {
                alert('In Safari: tap the Share button (box with arrow) → scroll down → tap "Add to Home Screen"')
                dismissInstall()
              }}
            >
              How?
            </button>
            <button className="dismissbtn" onClick={dismissInstall}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="header">
        <div>
          <div className="header-title">Skin Journal</div>
          <div className="header-sub">
            Daily Trigger Tracker · <span>{n} {n === 1 ? 'entry' : 'entries'}</span>
          </div>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === 'log' ? 'on' : 'off'}`} onClick={() => setTab('log')}>
            <NotebookPen size={13} strokeWidth={1.5} /> Log
          </button>
          <button className={`tab ${tab === 'history' ? 'on' : 'off'}`} onClick={() => setTab('history')}>
            <BookOpen size={13} strokeWidth={1.5} /> History
          </button>
          <button className={`tab ${tab === 'analysis' ? 'on' : 'off'}`} onClick={() => setTab('analysis')}>
            <Microscope size={13} strokeWidth={1.5} /> Analysis
          </button>
        </div>
      </div>

      <div className="content">
        {loadError && <p style={{ fontSize: '13px', color: 'red', marginBottom: '12px' }}>{loadError}</p>}
        {tab === 'log' && <LogPanel onSaved={fetchEntries} />}
        {tab === 'history' && <HistoryPanel entries={entries} />}
        {tab === 'analysis' && <AnalysisPanel entries={entries} onCleared={() => { setEntries([]); fetchEntries() }} />}
      </div>

      <nav className="botnav">
        <button className={`navbtn ${tab === 'log' ? 'on' : ''}`} onClick={() => setTab('log')}>
          <span className="ni"><NotebookPen size={20} strokeWidth={1.5} /></span>Log
        </button>
        <button className={`navbtn ${tab === 'history' ? 'on' : ''}`} onClick={() => setTab('history')}>
          <span className="ni"><BookOpen size={20} strokeWidth={1.5} /></span>History
        </button>
        <button className={`navbtn ${tab === 'analysis' ? 'on' : ''}`} onClick={() => setTab('analysis')}>
          <span className="ni"><Microscope size={20} strokeWidth={1.5} /></span>Analysis
        </button>
      </nav>
    </div>
  )
}
