import { useState, type FormEvent } from 'react'
import { MoreHorizontal, Pencil, Plus, Search, ShieldCheck, UserRound, UserRoundX } from 'lucide-react'
import { initialUsers } from '../data/mock'
import type { UserRecord } from '../types'
import { Badge, Button, Card, EmptyState, Modal } from '../components/ui/Primitives'

export function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<UserRecord | null>(null)
  const [editing, setEditing] = useState<UserRecord | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'Staff' as UserRecord['role'] })
  const visible = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()))
  function openAdd() { setEditing(null); setForm({ name: '', email: '', role: 'Staff' }); setSelected(null); setFormOpen(true) }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (editing) setUsers((list) => list.map((item) => item.id === editing.id ? { ...item, ...form } : item))
    else setUsers((list) => [...list, { ...form, id: `user-${Date.now()}`, status: 'Active' }])
    setSelected(null); setEditing(null); setFormOpen(false)
  }
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">SYSTEM ACCESS</div><h1>User Management</h1><p>จัดการรายการผู้ใช้ตัวอย่างและบทบาท Admin / Staff</p></div><Button onClick={openAdd}><Plus size={17} />Add user</Button></div>
    <div className="demo-banner"><ShieldCheck size={16} /><span>ข้อมูลผู้ใช้สมมติ ไม่มีการยืนยันตัวตนหรือกำหนดสิทธิ์จริง การเปลี่ยนแปลงจะอยู่ในหน่วยความจำระหว่างเปิดหน้านี้เท่านั้น</span></div>
    <Card className="users-card"><div className="table-toolbar"><div><h2>Users</h2><p>{users.length} demo accounts</p></div><label className="table-search"><Search size={16} /><input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users…" /></label></div>
      {visible.length === 0 ? <EmptyState title="No matching users" description="Change your search to see demo accounts." /> : <div className="table-scroll"><table><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map((user) => <tr key={user.id}><td><div className="user-cell"><span className="user-avatar">{user.name.charAt(0)}</span><b>{user.name}</b></div></td><td>{user.email}</td><td><Badge tone={user.role === 'Admin' ? 'info' : 'neutral'}>{user.role}</Badge></td><td><Badge tone={user.status === 'Active' ? 'success' : 'warning'}>{user.status}</Badge></td><td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${user.name}`} onClick={() => { setEditing(user); setForm({ name: user.name, email: user.email, role: user.role }); setFormOpen(true) }}><Pencil size={15} /></button><div className="action-menu-wrap"><button className="icon-button" aria-label={`More actions for ${user.name}`} onClick={() => setMenu(menu === user.id ? null : user.id)}><MoreHorizontal size={17} /></button>{menu === user.id && <div className="row-menu"><button onClick={() => { setSelected(user); setMenu(null) }}><UserRound size={14} />View details</button><button onClick={() => { setUsers((list) => list.map((item) => item.id === user.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item)); setMenu(null) }}><UserRoundX size={14} />{user.status === 'Active' ? 'Set inactive' : 'Set active'}</button></div>}</div></div></td></tr>)}</tbody></table></div>}
      <div className="pagination"><span>Showing {visible.length} of {users.length} demo accounts</span><span className="no-pagination">Local prototype</span></div>
    </Card>
    {formOpen && <Modal title={editing ? 'Edit demo user' : 'Add demo user'} onClose={() => { setFormOpen(false); setEditing(null) }}><form className="stack-form" onSubmit={save}><label>Name<input required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Demo user" /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="user@example.invalid" /></label><label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserRecord['role'] })}><option>Admin</option><option>Staff</option></select></label><div className="form-note">Prototype only. No credentials are created or stored.</div><div className="modal-actions"><Button type="button" variant="secondary" onClick={() => { setFormOpen(false); setEditing(null) }}>Cancel</Button><Button type="submit">Save demo user</Button></div></form></Modal>}
    {selected && <Modal title="Demo user details" onClose={() => setSelected(null)}><div className="detail-list">{[['Name', selected.name], ['Email', selected.email], ['Role', selected.role], ['Status', selected.status]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><p className="modal-footnote">This profile is fictional and does not represent an authenticated account.</p></Modal>}
  </div>
}
