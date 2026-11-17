import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity, Bell, Boxes, ChevronDown, ClipboardList, FileSpreadsheet,
  LayoutDashboard, Menu, Package, PanelLeftClose, Search, Settings, ShieldCheck,
  Truck, Users, Warehouse, X,
} from 'lucide-react'

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inv-search', label: 'INV Search', icon: Search },
  { to: '/sheets-sync', label: 'Google Sheets Sync', icon: FileSpreadsheet },
  { to: '/users', label: 'User Management', icon: Users },
  { to: '/audit-logs', label: 'Audit Logs', icon: ClipboardList },
]
const phaseLinks = [
  { label: 'Bill Management', icon: FileSpreadsheet }, { label: 'Lot Management', icon: Boxes },
  { label: 'Sales Team', icon: Users }, { label: 'INV Reconciliation', icon: Activity },
  { label: 'Store Management', icon: Warehouse }, { label: 'Reports & Export', icon: ClipboardList },
  { label: 'Stock Management', icon: Package }, { label: 'Stock Movement', icon: Truck },
]

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState(false)
  const location = useLocation()
  const title = primaryLinks.find((item) => item.to === location.pathname)?.label ?? 'Coming Soon'

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Boxes size={19} /></span><span className="brand-name">Goodwill</span><button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={17} /></button></div>
      <nav aria-label="Main navigation" className="side-nav">
        <div className="nav-group">
          {primaryLinks.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} title={collapsed ? label : undefined}><Icon size={17} /><span>{label}</span></NavLink>)}
        </div>
        <div className="nav-section-label"><span>Phase 2</span><span className="coming-badge">Coming Soon</span></div>
        <div className="nav-group phase-links">{phaseLinks.map(({ label, icon: Icon }) => <NavLink key={label} to={`/coming-soon/${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`} onClick={() => setMobileOpen(false)} className="nav-link" title={collapsed ? label : undefined}><Icon size={16} /><span>{label}</span></NavLink>)}</div>
        <div className="nav-group nav-bottom"><NavLink to="/coming-soon/settings" className="nav-link"><Settings size={17} /><span>Settings</span></NavLink></div>
      </nav>
      <div className="sidebar-note"><ShieldCheck size={15} /><span>Read-only demo<br />No Sheets connection</span></div>
    </aside>

    <section className="main-frame">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><button className="icon-button desktop-toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setCollapsed(!collapsed)}><PanelLeftClose size={18} /></button><div className="breadcrumb"><span>Goodwill</span><span className="crumb-divider">/</span><strong>{title}</strong></div></div>
        <div className="topbar-actions"><span className="demo-pill">DEMO</span><div className="popover-wrap"><button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice(!notice)}><Bell size={18} /><i /></button>{notice && <div className="popover notification-popover"><strong>Notifications</strong><p>No live notifications in demo mode.</p><span>Sync status is simulated.</span></div>}</div><div className="popover-wrap"><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}><span className="avatar">A</span><span className="profile-text"><b>Admin</b><small>Demo account</small></span><ChevronDown size={15} /></button>{profileOpen && <div className="popover profile-popover"><b>Admin</b><p>Prototype role only</p><button onClick={() => setProfileOpen(false)}>Close menu</button></div>}</div></div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="app-footer"><span>Goodwill · Frontend prototype</span><span>Sample data only · Authentication and sync are not connected</span></footer>
    </section>
  </div>
}
