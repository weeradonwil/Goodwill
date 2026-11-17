import { useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, AlertTriangle, Check, Clock3, Database, FileSearch, RefreshCw, Search, Sparkles } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Button, Card, Badge } from '../components/ui/Primitives'

const chartData = [{ name: 'Completed', value: 72, color: '#16a34a' }, { name: 'Needs review', value: 18, color: '#f59e0b' }, { name: 'Pending', value: 10, color: '#cbd5e1' }]

export function DashboardPage() {
  const navigate = useNavigate()
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Dashboard</h1><p>ภาพรวมสถานะข้อมูลและการเชื่อมต่อ · <strong>ตัวอย่างจำลอง</strong></p></div><Button onClick={() => navigate('/sheets-sync')}><RefreshCw size={16} />Sync Now</Button></div>
    <div className="demo-banner"><Sparkles size={16} /><span>โหมดตัวอย่าง — ตัวเลขและรายการด้านล่างเป็นข้อมูลสมมติ ไม่มีการเชื่อมต่อ Google Sheets หรือข้อมูลธุรกิจจริง</span></div>
    <div className="stat-grid">
      <div className="stat-card"><span className="stat-icon orange"><Database size={20} /></span><div><small>Worksheets ใน Demo</small><strong>464</strong><span>จำนวนตามขอบเขตที่ตรวจสอบไว้</span></div></div>
      <div className="stat-card"><span className="stat-icon green"><Check size={20} /></span><div><small>สถานะการเชื่อมต่อ</small><strong className="text-green">จำลอง</strong><span>ยังไม่เชื่อมต่อ API</span></div></div>
      <div className="stat-card"><span className="stat-icon amber"><AlertTriangle size={20} /></span><div><small>รายการรอตรวจสอบ</small><strong>—</strong><span>ยังไม่ยืนยันกติกาธุรกิจ</span></div></div>
      <button className="stat-card stat-action" onClick={() => navigate('/inv-search')}><span className="stat-icon blue"><FileSearch size={20} /></span><div><small>ค้นหารายการ</small><strong>INV Search</strong><span>ค้นหาจากข้อมูล Demo <ArrowRight size={13} /></span></div></button>
    </div>
    <div className="dashboard-grid">
      <Card title="Sync status summary" action={<Badge tone="info">Demo</Badge>}>
        <div className="chart-area"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" innerRadius="72%" outerRadius="93%" paddingAngle={3} stroke="none">{chartData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => [`${value}%`, 'สัดส่วน (จำลอง)']} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>DEMO</strong><span>ข้อมูลจำลอง</span></div></div><div className="chart-legend">{chartData.map((item) => <div key={item.name}><span className="legend-dot" style={{ background: item.color }} /><span>{item.name}</span><b>{item.value}%</b></div>)}</div></div>
        <div className="sync-summary"><span><Check size={15} />Completed <b>72%</b></span><span><AlertTriangle size={15} />Needs review <b>18%</b></span><span><Clock3 size={15} />Pending <b>10%</b></span></div>
      </Card>
      <Card title="Recent activity" action={<button className="text-link" onClick={() => navigate('/audit-logs')}>View all <ArrowRight size={14} /></button>}>
        <div className="activity-list"><div className="activity-item"><span className="activity-icon green"><Check size={16} /></span><div><b>Sync simulation completed</b><p>Demo mode · No external source contacted</p></div><time>10:42</time></div><div className="activity-item"><span className="activity-icon blue"><Search size={16} /></span><div><b>INV search</b><p>Fictional sample query</p></div><time>10:31</time></div><div className="activity-item"><span className="activity-icon amber"><AlertTriangle size={16} /></span><div><b>Example sync error</b><p>Displayed as a UI state only</p></div><time>09:12</time></div></div>
      </Card>
    </div>
    <Card className="dashboard-note"><div className="note-icon"><Activity size={19} /></div><div><h2>ข้อมูลธุรกรรมยังไม่เชื่อมต่อ</h2><p>ผลค้นหาและกิจกรรมในต้นแบบนี้ใช้ข้อมูลสมมติเท่านั้น; INV ซ้ำอาจแสดงได้หลายรายการ และระบบยังไม่สรุปยอดธุรกิจหรือยอดคงเหลือ</p></div><Button variant="secondary" onClick={() => navigate('/inv-search')}>Open INV Search <ArrowRight size={15} /></Button></Card>
  </div>
}
