# AGENTS.md

# Goodwill - Project Instructions

## 1. Project Overview

Goodwill is an Inventory & Delivery Management System.

The system is designed to manage inventory, delivery bills, Lot information, sales team data, and INV reconciliation.

The primary objective is to search by INV and compare delivery bill/Lot information with sales team records.

## 2. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint

### Backend
- Python 3.13
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Pydantic Settings
- uv

### Database and Data Source
- SQLite for initial local database and search cache
- Google Sheets API as the initial primary data source

### Development Tools
- Git
- GitHub
- VS Code
- Codex

## 3. Project Structure

```text
Goodwill/
├── AGENTS.md
├── .gitignore
├── backend/
│   ├── src/
│   │   └── backend/
│   ├── tests/
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── data/
└── docs/
```

Keep the existing `src` layout in the backend.

## 4. Development Rules

1. Use TypeScript for frontend development.
2. Use Python with type hints for backend development.
3. Follow clean code and modular architecture principles.
4. Separate API routers, business logic, database models, and schemas.
5. Avoid putting all application logic in one file.
6. Use environment variables for sensitive configuration.
7. Never expose API keys, credentials, or secrets in frontend code.
8. Validate all user inputs.
9. Handle errors appropriately.
10. Write tests for important business logic.
11. Avoid unnecessary dependencies.
12. Follow security and performance best practices.

## 5. Database Rules

- Inspect existing database structures before making changes.
- Do not delete or overwrite original database files.
- Use SQLAlchemy for database access.
- Use appropriate indexes for frequently searched fields, especially INV.
- Keep database operations separate from API routes.
- Preserve original data unless explicitly authorized to modify it.

## 6. Google Sheets Integration

Google Sheets is the initial primary data source.

- Connect to Google Sheets through the backend only.
- Never expose Google credentials to the frontend.
- Implement data validation and duplicate detection.
- Support synchronization and error logging.
- Keep SQLite as a local cache/search database.
- Do not assume the spreadsheet schema before inspecting it.

## 7. Core System Features

1. Dashboard
2. INV Search
3. Bill Management
4. Lot Management
5. Sales Team Management
6. INV Reconciliation
7. Stock Management
8. Store Management
9. Stock Movement and Audit Log
10. User and Permission Management
11. Google Sheets Integration
12. Reports and Export

## 8. INV Reconciliation Rules

The reconciliation system must compare delivery bill/Lot data against sales team data.

It should support:

- Matching INV numbers
- Comparing store information
- Comparing delivery dates
- Comparing product quantities
- Detecting missing records
- Identifying mismatched information
- Recording review status

Do not invent comparison rules. Ask for clarification when business rules are not defined.

## 9. Codex Working Instructions

Before making changes:

1. Inspect the existing project structure.
2. Read this AGENTS.md file.
3. Inspect relevant source files.
4. Explain the proposed changes before major modifications.

When implementing:

- Work incrementally.
- Avoid unnecessary rewrites.
- Preserve existing functionality.
- Explain important implementation decisions.
- Run relevant tests after changes.
- Report modified files and test results.

Do not delete, overwrite, or migrate existing databases without explicit approval.

## 10. Development Priorities

Phase 1: Project setup, API foundation, database inspection, Dashboard, and INV Search.

Phase 2: Bill Management, Lot Management, Sales Team, and INV Reconciliation.

Phase 3: Google Sheets integration and synchronization.

Phase 4: Stock Management and Store Management.

Phase 5: Authentication, Permissions, and Audit Logs.

Phase 6: Reports, optimization, testing, and deployment.

## 11. Important Principles

- Accuracy of inventory and delivery data is critical.
- INV is a key identifier throughout the system.
- Data integrity must be maintained.
- Prefer maintainable and understandable solutions.
- Do not implement unconfirmed business rules.
- Do not make assumptions about existing data structures.
# AGENTS.md

# Goodwill - Project Instructions

## 1. Project Overview

Goodwill is an Inventory & Delivery Management System.

The system is designed to manage inventory, delivery bills, Lot information, sales team data, and INV reconciliation.

The primary objective is to search by INV and compare delivery bill/Lot information with sales team records.

## 2. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint

### Backend
- Python 3.13
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- Pydantic Settings
- uv

### Database and Data Source
- SQLite for initial local database and search cache
- Google Sheets API as the initial primary data source

### Development Tools
- Git
- GitHub
- VS Code
- Codex

## 3. Project Structure

```text
Goodwill/
├── AGENTS.md
├── .gitignore
├── backend/
│   ├── src/
│   │   └── backend/
│   ├── tests/
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── data/
└── docs/
```

Keep the existing `src` layout in the backend.

## 4. Development Rules

1. Use TypeScript for frontend development.
2. Use Python with type hints for backend development.
3. Follow clean code and modular architecture principles.
4. Separate API routers, business logic, database models, and schemas.
5. Avoid putting all application logic in one file.
6. Use environment variables for sensitive configuration.
7. Never expose API keys, credentials, or secrets in frontend code.
8. Validate all user inputs.
9. Handle errors appropriately.
10. Write tests for important business logic.
11. Avoid unnecessary dependencies.
12. Follow security and performance best practices.

## 5. Database Rules

- Inspect existing database structures before making changes.
- Do not delete or overwrite original database files.
- Use SQLAlchemy for database access.
- Use appropriate indexes for frequently searched fields, especially INV.
- Keep database operations separate from API routes.
- Preserve original data unless explicitly authorized to modify it.

## 6. Google Sheets Integration

Google Sheets is the initial primary data source.

- Connect to Google Sheets through the backend only.
- Never expose Google credentials to the frontend.
- Implement data validation and duplicate detection.
- Support synchronization and error logging.
- Keep SQLite as a local cache/search database.
- Do not assume the spreadsheet schema before inspecting it.

## 7. Core System Features

1. Dashboard
2. INV Search
3. Bill Management
4. Lot Management
5. Sales Team Management
6. INV Reconciliation
7. Stock Management
8. Store Management
9. Stock Movement and Audit Log
10. User and Permission Management
11. Google Sheets Integration
12. Reports and Export

## 8. INV Reconciliation Rules

The reconciliation system must compare delivery bill/Lot data against sales team data.

It should support:

- Matching INV numbers
- Comparing store information
- Comparing delivery dates
- Comparing product quantities
- Detecting missing records
- Identifying mismatched information
- Recording review status

Do not invent comparison rules. Ask for clarification when business rules are not defined.

## 9. Codex Working Instructions

Before making changes:

1. Inspect the existing project structure.
2. Read this AGENTS.md file.
3. Inspect relevant source files.
4. Explain the proposed changes before major modifications.

When implementing:

- Work incrementally.
- Avoid unnecessary rewrites.
- Preserve existing functionality.
- Explain important implementation decisions.
- Run relevant tests after changes.
- Report modified files and test results.

Do not delete, overwrite, or migrate existing databases without explicit approval.

## 10. Development Priorities

Phase 1: Project setup, API foundation, database inspection, Dashboard, and INV Search.

Phase 2: Bill Management, Lot Management, Sales Team, and INV Reconciliation.

Phase 3: Google Sheets integration and synchronization.

Phase 4: Stock Management and Store Management.

Phase 5: Authentication, Permissions, and Audit Logs.

Phase 6: Reports, optimization, testing, and deployment.

## 11. Important Principles

- Accuracy of inventory and delivery data is critical.
- INV is a key identifier throughout the system.
- Data integrity must be maintained.
- Prefer maintainable and understandable solutions.
- Do not implement unconfirmed business rules.
- Do not make assumptions about existing data structures.

## Google Sheets Integration - Detailed Requirements

### Architecture
- Google Sheets is the primary source of truth.
- SQLite is used as a local cache and search database.
- Frontend must communicate with Google Sheets only through the FastAPI backend.
- Never expose Google credentials or service account keys to the frontend.

### Authentication
- Use Google Cloud Service Account authentication.
- Store credentials outside source code.
- Load credentials through environment configuration.
- Never commit credentials, tokens, or secret files to Git.

### Initial Implementation
1. Establish a secure connection to Google Sheets.
2. Verify spreadsheet access.
3. Inspect worksheet names, headers, and data types.
4. Read spreadsheet data without modifying the source.
5. Validate and normalize the data.
6. Import data into SQLite.
7. Implement INV search using the local database.

### Synchronization
- Support full synchronization.
- Design incremental synchronization only after identifying reliable change tracking fields.
- Detect duplicate records.
- Handle missing and invalid data.
- Record synchronization history.
- Record errors and failed operations.
- Avoid overwriting valid local data when synchronization fails.
- Make synchronization safe to retry.

### Data Integrity
- Preserve original spreadsheet data.
- Do not assume column names or worksheet structures.
- Do not delete or overwrite source data without explicit approval.
- Define unique identifiers and update rules before implementing synchronization.
- Verify data counts and sample records after import.

### Security
- Use least-privilege access.
- Keep service account credentials out of Git.
- Use environment variables for configuration.
- Do not log credentials or sensitive authentication data.

### Initial Access Mode
- Begin with read-only access.
- Enable write-back functionality only after explicit approval and business-rule verification.