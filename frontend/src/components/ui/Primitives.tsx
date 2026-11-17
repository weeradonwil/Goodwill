import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>
}
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) {
  return <span className={`badge badge-${tone}`}><i />{children}</span>
}
export function Card({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return <section className={`card ${className}`}>{(title || action) && <div className="card-heading">{title && <h2>{title}</h2>}{action}</div>}{children}</section>
}
export function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><header className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></header><div className="modal-body">{children}</div></section></div>
}
export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="state-panel"><span className="state-icon">⌕</span><strong>{title}</strong><p>{description}</p></div>
}
export function LoadingState({ label = 'Loading demo data…' }: { label?: string }) {
  return <div className="state-panel"><span className="spinner" aria-hidden="true" /><strong>{label}</strong><p>This prototype uses local sample data.</p></div>
}
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="state-panel error-panel"><span className="state-icon">!</span><strong>Could not load demo data</strong><p>Try again to restore the local sample view.</p><Button variant="secondary" onClick={onRetry}>Try again</Button></div>
}
