import type { AuditRecord, InvRecord, UserRecord } from '../types'

// Entirely fictional UI data for the frontend prototype. No exported business rows are used.
export const invRecords: InvRecord[] = [
  { recordId: 'demo-001', inv: 'DEMO-INV-001', date: 'Unknown', store: 'Demo store A', quantity: 'Unknown', source: 'Demo worksheet A · row 2', status: 'Unverified' },
  { recordId: 'demo-002', inv: 'DEMO-INV-001', date: 'Unknown', store: 'Demo store B', quantity: 'Unknown', source: 'Demo worksheet B · row 5', status: 'Needs review' },
  { recordId: 'demo-003', inv: 'DEMO-INV-002', date: 'Unknown', store: 'Unknown', quantity: 'Unknown', source: 'Demo worksheet C · row 8', status: 'Unverified' },
  { recordId: 'demo-004', inv: 'DEMO-INV-003', date: 'Unknown', store: 'Demo store A', quantity: 'Unknown', source: 'Demo worksheet A · row 11', status: 'Unverified' },
  { recordId: 'demo-005', inv: 'DEMO-INV-004', date: 'Unknown', store: 'Unknown', quantity: 'Unknown', source: 'Demo worksheet D · row 4', status: 'Needs review' },
]

export const initialUsers: UserRecord[] = [
  { id: 'user-1', name: 'Demo Admin', email: 'admin@example.invalid', role: 'Admin', status: 'Active' },
  { id: 'user-2', name: 'Demo Staff', email: 'staff@example.invalid', role: 'Staff', status: 'Active' },
]

export const auditRecords: AuditRecord[] = [
  { id: 'a-1', date: 'Today · 10:42', user: 'Demo Admin', event: 'Sync simulation completed', detail: 'Frontend demo only. No external source was contacted.', status: 'Success' },
  { id: 'a-2', date: 'Today · 10:31', user: 'Demo Staff', event: 'INV search', detail: 'Searched using a fictional demo value.', status: 'Info' },
  { id: 'a-3', date: 'Yesterday · 16:08', user: 'Demo Admin', event: 'User status changed', detail: 'Local prototype state only.', status: 'Warning' },
  { id: 'a-4', date: 'Yesterday · 15:55', user: 'Demo Admin', event: 'Sign-in placeholder', detail: 'Authentication is not connected.', status: 'Info' },
]

export const mockSyncHistory = [
  { id: 's-1', date: 'Today · 10:42', status: 'Completed', records: 'Demo only', detail: 'Simulation completed' },
  { id: 's-2', date: 'Today · 09:12', status: 'Failed', records: '—', detail: 'Example error state' },
  { id: 's-3', date: 'Yesterday · 16:20', status: 'Completed', records: 'Demo only', detail: 'Simulation completed' },
]
