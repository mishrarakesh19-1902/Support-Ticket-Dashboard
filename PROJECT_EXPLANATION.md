# 📋 Project Explanation & Technical Overview

This document provides a concise summary of the architectural choices, assumptions, known limitations, and time investment for the **Support Ticket Dashboard** take-home assignment.

- **Live Application URL**: [https://support-ticket-dashboard-frontend-6qne.onrender.com](https://support-ticket-dashboard-frontend-6qne.onrender.com)
- **Live Backend API**: [https://support-ticket-dashboard-backend.onrender.com](https://support-ticket-dashboard-backend.onrender.com)

---

## 1. Technical Choices & Rationale

### Monorepo Structure (`/backend` and `/frontend`)
- **Choice**: Separate `backend` and `frontend` folders with root-level script orchestration.
- **Why**: Eliminates workspace configuration conflicts while providing single-command operations (`npm run dev`, `npm run test`, `npm run seed`) from the root.

### Backend: Node.js + Express + TypeScript
- **Choice**: Express with TypeScript and an asynchronous error-wrapper pattern.
- **Why**: Minimal, predictable, and transparent. Provides full control over routing, middleware order, and error handling without heavy framework abstractions.

### Database: SQLite with Prisma ORM
- **Choice**: SQLite (`file:./dev.db`) managed via Prisma.
- **Why**:
  - **Zero-setup**: Requires no local PostgreSQL/MySQL daemon or Docker containers; reviewers can run the project immediately.
  - **Type Safety**: Prisma generates TypeScript types directly from `schema.prisma`.
  - **Indexed Queries**: Explicit indexes on `status`, `priority`, and `createdAt` ensure production-like database query execution.

### Validation: Zod (Shared Rules on Backend & Frontend)
- **Choice**: Zod schema definitions with strict input validation.
- **Why**:
  - Enforces field rules (title max 120 characters, RFC email format, enum values) at runtime.
  - Formats validation errors into a consistent `{ field, message }` structure that the frontend easily maps to inline form errors.

### Frontend: React 18 + Vite + Tailwind CSS + React Router
- **Choice**: Vite for fast bundling, React Router for declarative navigation, and Tailwind CSS for mobile-first styling.
- **Why**:
  - **URL Query Synchronization**: Keeps search, filters, sorting, and pagination in sync with the browser URL (`?search=...&page=...`) for shareable links and refresh persistence.
  - **Accessibility**: Color-coded badges always combine color, icons, and text so they do not rely on color alone (WCAG compliance).

### Testing: Vitest + Supertest (Backend) & Vitest + React Testing Library (Frontend)
- **Choice**: Vitest runner across both projects with Supertest for API integration and RTL for component tests.
- **Why**:
  - Blazing fast execution with native TypeScript support.
  - Backend tests run against an isolated `test.db` with automated cleanups before each test.

---

## 2. Assumptions

1. **Database Identifiers**:
   - Ticket IDs use auto-incremented integers (`1`, `2`, `3`) for simplicity and clean URL path parameters (`/tickets/1`).
   - SQLite autoincrement sequence is reset during database re-seeding for clean, predictable IDs.

2. **Enum Emulation in SQLite**:
   - SQLite lacks a native `ENUM` column type. Status (`OPEN`, `IN_PROGRESS`, `RESOLVED`) and Priority (`LOW`, `MEDIUM`, `HIGH`) are stored as `TEXT` and enforced at application boundaries via Zod schemas and TypeScript union types.

3. **Database-Level Query Execution**:
   - Filtering (`search` against title OR email, `status`, `priority`), sorting (`newest`/`oldest` by `createdAt`), and pagination (`limit=10`, `offset`) are executed **strictly in the database query via Prisma**, never via in-memory JavaScript array manipulation.

4. **Global Stats Independence**:
   - The `/api/tickets/stats` endpoint calculates summary counts across the entire dataset, completely independent of active table filters.
   - The stats route is registered before `/:id` to prevent route collision.

5. **Search Behavior**:
   - Search is partial and case-insensitive against both `title` and `customerEmail`.

6. **Filter Reset on Pagination**:
   - Modifying search input, status, priority, or sort order automatically resets pagination back to Page 1.

---

## 3. Known Limitations

1. **No Authentication / Authorization**:
   - As specified in the prompt, auth is out of scope. In a production environment, role-based access control (RBAC) would separate Support Agents, Admins, and Customers.

2. **Single SQLite Database Concurrency**:
   - SQLite supports high read concurrency but serializes writes. A production deployment would use PostgreSQL or MySQL for high concurrent write throughput.

3. **No Real-Time WebSocket Updates**:
   - Ticket updates by other agents require a page refresh or filter re-trigger. WebSockets or Server-Sent Events (SSE) would enable live updates across browser sessions.

4. **Attachment Storage**:
   - Tickets only support text descriptions. File/screenshot uploads with S3/GCS presigned URLs would be added in a production system.

---

## 4. Time Spent Breakdown

| Phase / Task | Approximate Time |
|---|---|
| Monorepo scaffolding, TypeScript configs, dependencies & hello-world | ~30 mins |
| Prisma data model, indexes, migrations & 33-ticket realistic seed script | ~35 mins |
| Backend REST API (Zod schemas, service layer, controllers, error middleware) | ~50 mins |
| Backend automated integration tests with isolated test database (25 tests) | ~45 mins |
| Frontend API client, TypeScript types, layout & shared accessible components | ~50 mins |
| Ticket list page with stats cards, debounced search, URL sync & server pagination | ~55 mins |
| Create ticket form with live counter, client validation & server error mapping | ~35 mins |
| Ticket detail page with PATCH controls for status/priority and persistence | ~35 mins |
| Responsive design pass (360px, 768px, 1280px) & RTL frontend tests (8 tests) | ~35 mins |
| Documentation, README, technical explanation & final test verification | ~25 mins |
| **Total Time Spent** | **~6.5 hours** |

---

## 5. AI Assistance Disclosure

This project was developed with assistance from **Antigravity (Google DeepMind)** for rapid scaffolding, generating realistic seed datasets, writing boilerplate tests, and formatting documentation. All data schemas, database query logic, error formatting, component designs, and edge-case handling were verified and tested step-by-step.
