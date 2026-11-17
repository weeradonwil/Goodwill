import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ClipboardList, Search } from 'lucide-react'
import { auditRecords } from '../data/mock'
import type { AuditRecord } from '../types'
import { Badge, Card, EmptyState, Modal } from '../components/ui/Primitives'

export function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState('All users')
  const [event, setEvent] = useState('All events')
  const [status, setStatus] = useState('All statuses')
  const [dateRange, setDateRange] = useState('All time')
  const [selected, setSelected] = useState<AuditRecord | null>(null)
  const [page, setPage] = useState(1)
  const events = [...new Set(auditRecords.map((item) => item.event))]
  const filtered = useMemo(() => auditRecords.filter((item) => `${item.user} ${item.event} ${item.detail}`.toLowerCase().includes(search.toLowerCase()) && (user === 'All users' || item.user === user) && (event === 'All events' || item.event === event) && (status === 'All statuses' || item.status === status) && (dateRange !== 'Today' || item.date.startsWith('Today'))), [search, user, event, status, dateRange])
  const perPage = 3
  const items = filtered.slice((page - 1) * perPage, page * perPage)
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">SYSTEM ACTIVITY</div><h1>Audit Logs</h1><p>บันทึกกิจกรรมตัวอย่างที่เกิดขึ้นใน Frontend prototype</p></div><span className="demo-pill large">SAMPLE LOGS</span></div>
    <div className="demo-banner"><ClipboardList size={16} /><span>Audit log จริงต้องบันทึกจาก Backend · ตารางนี้เป็นตัวอย่างเพื่อแสดงรูปแบบเท่านั้น</span></div>
    <Card className="audit-card"><div className="filter-row audit-filters"><label className="table-search"><Search size={16} /><input aria-label="Search audit logs" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search actor or event…" /></label><label>User<select value={user} onChange={(e) => { setUser(e.target.value); setPage(1) }}><option>All users</option>{[...new Set(auditRecords.map((item) => item.user))].map((name) => <option key={name}>{name}</option>)}</select></label><label>Event<select value={event} onChange={(e) => { setEvent(e.target.value); setPage(1) }}><option>All events</option>{events.map((name) => <option key={name}>{name}</option>)}</select></label><label>Date range<select aria-label="Date range filter" value={dateRange} onChange={(e) => { setDateRange(e.target.value); setPage(1) }}><option>All time</option><option>Today</option><option>Last 7 days</option><option>Last 30 days</option></select></label><label>Status<select aria-label="Status filter" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}><option>All statuses</option><option>Success</option><option>Info</option><option>Warning</option></select></label></div>
      {items.length === 0 ? <EmptyState title="No matching activity" description="Try another event, user, or search term." /> : <><div className="table-scroll"><table><thead><tr><th>Date & time</th><th>User</th><th>Event</th><th>Details</th><th>Status</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.date}</td><td><b>{item.user}</b></td><td>{item.event}</td><td className="truncate-cell">{item.detail}</td><td><Badge tone={item.status === 'Success' ? 'success' : item.status === 'Warning' ? 'warning' : 'info'}>{item.status}</Badge></td><td><button className="text-link" onClick={() => setSelected(item)}>Details</button></td></tr>)}</tbody></table></div><div className="pagination"><span>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} sample events</span><div><button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button><span>{page} / {Math.max(1, Math.ceil(filtered.length / perPage))}</span><button aria-label="Next page" disabled={page >= Math.ceil(filtered.length / perPage)} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button></div></div></>}
    </Card>
    {selected && <Modal title="Activity details" onClose={() => setSelected(null)}><div className="detail-list">{[['Timestamp', selected.date], ['User', selected.user], ['Event', selected.event], ['Details', selected.detail], ['Status', selected.status]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></Modal>}
  </div>
}
