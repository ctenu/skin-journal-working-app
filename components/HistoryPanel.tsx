import { Entry } from '@/lib/types'
import { fmtDate } from '@/lib/format'

function TagList({ arr }: { arr: string[] }) {
  if (!arr?.length) return <p>—</p>
  return (
    <div className="logtags">
      {arr.map((t) => (
        <span key={t} className="logtag">
          {t}
        </span>
      ))}
    </div>
  )
}

export default function HistoryPanel({ entries }: { entries: Entry[] }) {
  if (!entries.length) {
    return (
      <div className="empty">
        <div className="emptyicon">📖</div>
        <div className="emptytitle">No entries yet</div>
        <p>Log your first day to start building your history</p>
      </div>
    )
  }

  return (
    <div>
      {entries.map((e) => {
        const hasSym = e.symptoms?.length > 0
        return (
          <div key={e.id} className="entry">
            <div className="entryhead">
              <div className="entrydate">{fmtDate(e.date)}</div>
              <span className={`badge s${hasSym ? e.severity : 0}`}>
                {hasSym ? `Severity ${e.severity}/5` : 'Clear skin ✓'}
              </span>
            </div>
            <div className="entgrid">
              <div className="entfield">
                <label>Food &amp; drinks</label>
                <TagList arr={e.foods} />
              </div>
              <div className="entfield">
                <label>Stress / Sleep</label>
                <p>Stress {e.stress}/5 · Sleep {e.sleep}/5</p>
              </div>
              <div className="entfield">
                <label>Skincare</label>
                <TagList arr={e.skincare} />
              </div>
              <div className="entfield">
                <label>Exposures</label>
                <TagList arr={e.exposures} />
              </div>
              <div className="entfield">
                <label>Exercise</label>
                <p>{e.exercise || '—'}</p>
              </div>
              <div className="entfield">
                <label>Medications</label>
                <TagList arr={e.meds} />
              </div>
              {hasSym && (
                <div className="entfield" style={{ gridColumn: '1 / -1' }}>
                  <label>Symptoms</label>
                  <div className="logtags">
                    {e.symptoms.map((t) => (
                      <span key={t} className="logtag sym">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {e.notes && (
                <div className="entfield" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <p>{e.notes}</p>
                </div>
              )}
            </div>
            {e.photo && (
              // eslint-disable-next-line @next/next/no-img-element -- photo is a base64 data URL; next/image can't optimize it
              <img
                src={e.photo}
                alt="skin"
                style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
