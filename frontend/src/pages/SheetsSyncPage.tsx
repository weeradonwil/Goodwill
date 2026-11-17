import { useState } from 'react'
import { AlertTriangle, Check, Clock3, Database, FileSpreadsheet, RefreshCw, RotateCcw } from 'lucide-react'
import { mockSyncHistory } from '../data/mock'
import { Badge, Button, Card, EmptyState } from '../components/ui/Primitives'

export function SheetsSyncPage() {
  const [syncing, setSyncing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState(mockSyncHistory)
  const [error, setError] = useState(false)
  function startSync() {
    if (syncing) return
    setSyncing(true); setError(false); setProgress(0)
    const started = Date.now()
    const timer = window.setInterval(() => {
      const next = Math.min(100, Math.round(((Date.now() - started) / 2600) * 100))
      setProgress(next)
      if (next >= 100) {
        window.clearInterval(timer); setSyncing(false); setError(true)
        setHistory((items) => [{ id: `s-${Date.now()}`, date: 'Just now', status: 'Demo error', records: '—', detail: 'No API is connected' }, ...items].slice(0, 5))
      }
    }, 100)
  }
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">DATA CONNECTION</div><h1>Google Sheets Sync</h1><p>สถานะต้นแบบการเชื่อมต่อและประวัติการ Sync</p></div><Button onClick={startSync} disabled={syncing}><RefreshCw size={16} className={syncing ? 'spin-icon' : ''} />{syncing ? 'Syncing…' : 'Sync Now'}</Button></div>
    <div className="demo-banner"><AlertTriangle size={16} /><span><b>Demo Simulation:</b> ไม่ได้เรียก Google Sheets API หรือเปลี่ยนแปลงข้อมูลต้นฉบับ การกด Sync จะแสดง progress และสถานะจำลองเท่านั้น</span></div>
    <Card className="sync-overview"><div className="sync-status-large"><span className="status-check"><Check size={26} /></span><div><small>Connection status</small><h2>Demo mode</h2><p>Backend connection is not configured</p></div></div><div className="sync-metric"><small>Last attempt</small><strong>Today · 10:42</strong><span>Mock timestamp</span></div><div className="sync-metric"><small>Worksheets</small><strong>464</strong><span>From analysis scope</span></div><div className="sync-metric"><small>Records synced</small><strong>—</strong><span>Unknown until connected</span></div></Card>
    {syncing && <Card className="progress-card" title="Sync simulation in progress"><div className="progress-meta"><span>Running local UI simulation</span><b>{progress}%</b></div><div className="progress-track"><div style={{ width: `${progress}%` }} /></div><p>ไม่มีการติดต่อ API หรือเขียนกลับ Google Sheets</p></Card>}
    {error && <div className="error-callout"><AlertTriangle size={18} /><div><b>Simulation finished · connection unavailable</b><p>ยังไม่มี Backend/API เชื่อมต่อ แสดงสถานะนี้เพื่อทดสอบ Error state เท่านั้น</p></div><Button variant="ghost" onClick={() => setError(false)} aria-label="Dismiss error">Dismiss</Button></div>}
    <div className="sync-grid"><Card title="Sync history" action={<Badge tone="info">Sample history</Badge>}>{history.length === 0 ? <EmptyState title="No sync attempts" description="Sync history will appear here." /> : <div className="table-scroll"><table><thead><tr><th>Attempt</th><th>Status</th><th>Records</th><th>Details</th></tr></thead><tbody>{history.map((item) => <tr key={item.id}><td>{item.date}</td><td><Badge tone={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</Badge></td><td>{item.records}</td><td>{item.detail}</td></tr>)}</tbody></table></div>}</Card><Card title="Sync details"><div className="sync-detail-list"><div><span><Database size={16} />Direction</span><b>Read-only (planned)</b></div><div><span><Clock3 size={16} />Frequency</span><b>Pending decision</b></div><div><span><FileSpreadsheet size={16} />Source of truth</span><b>Google Sheets (existing transactions)</b></div></div><div className="pending-note"><AlertTriangle size={15} />Sync schedule and retry policy require owner confirmation.</div></Card></div>
    <div className="sync-footer"><RotateCcw size={14} />This is a frontend-only simulation. No credential or sheet identifier is used.</div>
  </div>
}
