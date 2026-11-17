import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Boxes, CircleHelp, PackageSearch } from 'lucide-react'
import { Button, Card } from '../components/ui/Primitives'

function titleFromSlug(slug?: string) {
  if (!slug) return 'Feature'
  return slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function ComingSoonPage() {
  const { feature } = useParams()
  const navigate = useNavigate()
  const title = titleFromSlug(feature)
  const stockFeature = title.toLowerCase().includes('stock')
  return <div className="page-stack">
    <div className="page-heading"><div><div className="eyebrow">PHASE 2 · PLANNED</div><h1>{title}</h1><p>ฟังก์ชันนี้ยังไม่อยู่ในขอบเขต Core MVP</p></div><span className="coming-badge large">Coming Soon</span></div>
    <Card className="coming-card"><div className="coming-illustration"><div className="coming-circle"><Boxes size={34} /></div><span className="coming-spark spark-a">✳</span><span className="coming-spark spark-b">✦</span></div><BadgeLine /><h2>{title} อยู่ระหว่างการวางแผน</h2><p>ข้อมูลและกติกาธุรกิจที่จำเป็นยังต้องได้รับการยืนยันก่อนพัฒนาฟังก์ชันนี้</p>{stockFeature && <div className="stock-pending"><PackageSearch size={17} /><span>ยังไม่มีหลักฐานยืนยัน Stock Balance หรือ Stock Movement จากแหล่งข้อมูลเดิม</span></div>}<Button onClick={() => navigate('/')}><ArrowLeft size={16} />Back to Dashboard</Button></Card>
  </div>
}

function BadgeLine() { return <div className="coming-label"><CircleHelp size={15} />PLANNED FEATURE</div> }
