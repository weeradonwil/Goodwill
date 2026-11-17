# Goodwill Frontend

Responsive frontend prototype for the Goodwill Inventory & Delivery Management System. The current screens use fictional in-memory data. Google Sheets and the FastAPI backend are not connected.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (Vite plugin) with a small shared CSS design system
- React Router, Lucide React, Recharts
- ESLint

## Run locally

```powershell
npm install
npm run dev
```

Vite prints the local address. Production output can be checked with:

```powershell
npm run build
npm run preview
```

## Pages

- Dashboard
- INV Search
- Google Sheets Sync (simulation only)
- User Management (local prototype state only)
- Audit Logs (sample rows)
- Coming Soon pages for Phase 2 features

## Structure

```text
src/
  components/layout/   App shell, sidebar, topbar
  components/ui/       Buttons, cards, badges, modals, UI states
  data/                Fictional sample data
  pages/               Route pages
  services/            Future API URL helper; currently makes no requests
  types.ts             Frontend view types
```

## Environment and API

`VITE_API_BASE_URL` is reserved for a future FastAPI connection. No endpoint calls run in this prototype. Do not put Google credentials, service account keys, or other secrets in frontend environment variables; all Google Sheets access must remain in the backend.

Sync, users, and audit screens are demonstrations. Sync never calls Google APIs. User changes are held only in React memory and are not saved to a backend or browser storage. Sample INV identifiers, people, stores, times, statuses, and activity are fictional. Unknown business fields remain marked `Unknown`; duplicate INV examples are separate records.

## Checks

```powershell
npm run lint
npm run build
```
