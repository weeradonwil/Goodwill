export type InvRecord = {
  recordId: string
  inv: string
  date: string
  store: string
  quantity: string
  source: string
  status: 'Needs review' | 'Unverified'
}

export type UserRecord = {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Staff'
  status: 'Active' | 'Inactive'
}

export type AuditRecord = {
  id: string
  date: string
  user: string
  event: string
  detail: string
  status: 'Success' | 'Info' | 'Warning'
}
