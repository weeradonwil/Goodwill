/** API URL helper reserved for the later FastAPI integration. No requests are made in this prototype. */
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export function apiUrl(path: string): string {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured')
  return `${apiBaseUrl}/${path.replace(/^\//, '')}`
}
