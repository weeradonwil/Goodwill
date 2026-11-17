import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, FileSearch, Search, X } from 'lucide-react'
import { invRecords } from '../data/mock'
import type { InvRecord } from '../types'
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, Modal } from '../components/ui/Primitives'

export function InvSearchPage() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [status, setStatus] = useState('All statuses')
  const [source, setSource] = useState('All sources')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<InvRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const allSources = [...new Set(invRecords.map((record) => record.source.split(' · ')[0]))]
  const filtered = useMemo(() => {
    if (!searched || !query.trim()) return []
    return invRecords.filter((record) => `${record.inv} ${record.store} ${record.source}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === 'All statuses' || record.status === status) && (source === 'All sources' || record.source.startsWith(source)))
  }, [searched, query, status, source])
  const pageSize = 4
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const results = filtered.slice((page - 1) * pageSize, page * pageSize)
  function search() { setPage(1); setSearched(true); setFailed(false); setLoading(true); window.setTimeout(() => setLoading(false), 380) }
  function clear() { setQuery(''); setSearched(false); setStatus('All statuses'); setSource('All sources'); setPage(1); setFailed(false) }
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">TRANSACTION LOOKUP</div><h1>INV Search</h1><p>ค้นหารายการจากค่าตัวอย่าง โดยคงแต่ละ source record แยกจากกัน</p></div><span className="demo-pill large">DEMO DATA</span></div>
    <div className="demo-banner"><FileSearch size={16} /><span>ข้อมูลจำลองเท่านั้น · INV ไม่ได้ถูกกำหนดเป็น Unique Key · วันที่และจำนวนที่ไม่มีหลักฐานแสดงเป็น Unknown</span></div>
    <Card className="search-card"><form className="search-form" onSubmit={(event) => { event.preventDefault(); search() }}><label className="search-input"><Search size={18} /><input aria-label="Search INV or source" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search INV or source… try DEMO-INV-001" /><button type="button" className="clear-input" aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button></label><Button type="submit"><Search size={16} />Search</Button><Button type="button" variant="secondary" onClick={clear}>Clear</Button></form><div className="filter-row"><label>Status<select aria-label="Status filter" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option>All statuses</option><option>Unverified</option><option>Needs review</option></select></label><label>Source worksheet<select aria-label="Source worksheet filter" value={source} onChange={(event) => { setSource(event.target.value); setPage(1) }}><option>All sources</option>{allSources.map((item) => <option key={item}>{item}</option>)}</select></label><span className="filter-hint">Press Enter to search</span><button className="text-link preview-error" type="button" onClick={() => { setSearched(true); setLoading(false); setFailed(true) }}>Preview error state</button></div></Card>
    <Card className="table-card" title="Search results" action={<span className="result-count">{searched && !loading ? `${filtered.length} demo records` : 'No query'}</span>}>
      {loading ? <LoadingState label="Searching demo records…" /> : failed ? <ErrorState onRetry={search} /> : !searched ? <EmptyState title="Search by an INV value" description="Type DEMO-INV-001 to see duplicate example rows and source provenance." /> : results.length === 0 ? <EmptyState title="No matching demo records" description="Try another fictional value or clear the filters." /> : <><div className="table-scroll"><table><thead><tr><th>Record</th><th>INV value</th><th>Date</th><th>Store</th><th>Quantity</th><th>Review status</th><th /></tr></thead><tbody>{results.map((record) => <tr key={record.recordId}><td><span className="record-id">{record.recordId}</span></td><td><b>{record.inv}</b><small className="table-sub">{record.source}</small></td><td>{record.date}</td><td>{record.store}</td><td>{record.quantity}</td><td><Badge tone={record.status === 'Needs review' ? 'warning' : 'info'}>{record.status}</Badge></td><td><Button variant="ghost" className="small-button" onClick={() => setSelected(record)}>Details</Button></td></tr>)}</tbody></table></div><div className="pagination"><span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div><button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button><span>{page} / {totalPages}</span><button aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button></div></div></>}
    </Card>
    {selected && <Modal title="Record details" onClose={() => setSelected(null)}><div className="detail-list">{[['Record ID', selected.recordId], ['INV value', selected.inv], ['Date', selected.date], ['Store', selected.store], ['Quantity', selected.quantity], ['Source provenance', selected.source], ['Review status', selected.status]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><p className="modal-footnote">Demo row only. No relationship to Bill, Lot, or Sales Team is asserted.</p></Modal>}
  </div>
}
