'use client'

import { useState } from 'react'
import TagInput from './TagInput'
import SliderField from './SliderField'

const SYMPTOMS = ['Redness', 'Itching', 'Swelling', 'Hives', 'Dry patches', 'Burning', 'Peeling', 'Rash']

interface LogPanelProps {
  onSaved?: () => void
}

export default function LogPanel({ onSaved }: LogPanelProps) {
  const today = new Date()
  const [foods, setFoods] = useState<string[]>([])
  const [stress, setStress] = useState(3)
  const [sleep, setSleep] = useState(3)
  const [skincare, setSkincare] = useState<string[]>([])
  const [exposures, setExposures] = useState<string[]>([])
  const [exercise, setExercise] = useState('')
  const [meds, setMeds] = useState<string[]>([])
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [severity, setSeverity] = useState(1)
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedVisible, setSavedVisible] = useState(false)

  function toggleSymptom(s: string) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setSaving(true)
    const entry = {
      date: today.toISOString().split('T')[0],
      foods,
      stress,
      sleep,
      skincare,
      exposures,
      exercise,
      meds,
      symptoms,
      severity: symptoms.length > 0 ? severity : 0,
      notes,
      photo,
    }
    await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    setSaving(false)
    resetForm()
    setSavedVisible(true)
    setTimeout(() => setSavedVisible(false), 2500)
    onSaved?.()
  }

  function resetForm() {
    setFoods([])
    setStress(3)
    setSleep(3)
    setSkincare([])
    setExposures([])
    setExercise('')
    setMeds([])
    setSymptoms([])
    setSeverity(1)
    setNotes('')
    setPhoto(null)
  }

  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>
      <div className="datestrip">
        <div>
          <div className="datetext">{dateStr}</div>
          <div className="datesub">How are you doing today?</div>
        </div>
        <span className={`saved${savedVisible ? ' on' : ''}`}>✓ Saved!</span>
      </div>

      <div className="card">
        <div className="card-title">🥗 Food &amp; Drinks</div>
        <label>What did you eat and drink today?</label>
        <TagInput tags={foods} onChange={setFoods} placeholder="Type and press Enter — e.g. oat milk, sushi…" />
        <p className="hint">Add each item separately so patterns can be detected</p>
      </div>

      <div className="twocol">
        <div className="card">
          <div className="card-title">🧠 Stress Level</div>
          <SliderField id="stress" value={stress} onChange={setStress} lowLabel="Calm" highLabel="Stressed" />
        </div>
        <div className="card">
          <div className="card-title">🌙 Sleep Quality</div>
          <SliderField id="sleep" value={sleep} onChange={setSleep} lowLabel="Poor" highLabel="Great" />
        </div>
      </div>

      <div className="card">
        <div className="card-title">✨ Skincare Products</div>
        <label>Products applied today</label>
        <TagInput tags={skincare} onChange={setSkincare} placeholder="e.g. CeraVe, SPF 50, new toner…" />
      </div>

      <div className="twocol">
        <div className="card">
          <div className="card-title">🌿 Exposures</div>
          <label>Environmental contacts</label>
          <TagInput tags={exposures} onChange={setExposures} placeholder="e.g. cat, pollen, detergent…" />
        </div>
        <div className="card">
          <div className="card-title">🏃 Exercise</div>
          <label>Activity today</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g. 30min run, yoga, rest day"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-title">💊 Medications &amp; Supplements</div>
        <label>Anything taken today</label>
        <TagInput tags={meds} onChange={setMeds} placeholder="e.g. vitamin D, antihistamine, fish oil…" />
      </div>

      <div className="card">
        <div className="card-title">🪞 Skin Today</div>
        <label style={{ marginBottom: '10px' }}>Any symptoms? (select all that apply)</label>
        <div className="chips">
          {SYMPTOMS.map((s) => (
            <div
              key={s}
              className={`chip${symptoms.includes(s) ? ' on' : ''}`}
              onClick={() => toggleSymptom(s)}
            >
              {s}
            </div>
          ))}
        </div>

        {symptoms.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <label>Severity today</label>
            <SliderField id="severity" value={severity} onChange={setSeverity} lowLabel="Mild" highLabel="Severe" />
            <div style={{ marginBottom: '14px' }} />
          </div>
        )}

        <label>Photo (optional)</label>
        {!photo ? (
          <label className="photolabel">
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            <div style={{ fontSize: '30px', marginBottom: '7px' }}>📷</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Tap to add a photo of your skin today</div>
          </label>
        ) : (
          <div className="photopreview">
            <img
              src={photo}
              alt="skin"
              style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '10px', display: 'block' }}
            />
            <button className="photorm" type="button" onClick={() => setPhoto(null)}>
              ×
            </button>
          </div>
        )}

        <div style={{ marginTop: '14px' }}>
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else worth noting — new environment, period, mood, travel, new product…"
          />
        </div>
      </div>

      <button className="savebtn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Today\'s Entry →'}
      </button>
    </div>
  )
}
