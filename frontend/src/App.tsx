import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const InvSearchPage = lazy(() => import('./pages/InvSearchPage').then((module) => ({ default: module.InvSearchPage })))
const SheetsSyncPage = lazy(() => import('./pages/SheetsSyncPage').then((module) => ({ default: module.SheetsSyncPage })))
const UsersPage = lazy(() => import('./pages/UsersPage').then((module) => ({ default: module.UsersPage })))
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage').then((module) => ({ default: module.AuditLogsPage })))
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage').then((module) => ({ default: module.ComingSoonPage })))

export default function App() {
  return <BrowserRouter><Suspense fallback={<div className="route-loading"><span className="spinner" />Loading page…</div>}><Routes><Route element={<AppLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="inv-search" element={<InvSearchPage />} />
    <Route path="sheets-sync" element={<SheetsSyncPage />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="audit-logs" element={<AuditLogsPage />} />
    <Route path="coming-soon/:feature" element={<ComingSoonPage />} />
    <Route path="*" element={<ComingSoonPage />} />
  </Route></Routes></Suspense></BrowserRouter>
}
