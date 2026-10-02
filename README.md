# 🎫 Support Ticket Dashboard

A full-stack, responsive web application designed for customer support teams to replace spreadsheets by creating, tracking, filtering, and managing customer support tickets with real-time statistics and database-driven querying.

---

## 🌐 Live Application URL

- **Live Frontend Dashboard**: [https://support-ticket-dashboard-frontend-6qne.onrender.com](https://support-ticket-dashboard-frontend-6qne.onrender.com)
- **Live Backend API**: [https://support-ticket-dashboard-backend.onrender.com](https://support-ticket-dashboard-backend.onrender.com)
- **API Health Check**: [https://support-ticket-dashboard-backend.onrender.com/health](https://support-ticket-dashboard-backend.onrender.com/health)

---

## 📸 Application Screenshots

> 💡 **Instructions for adding screenshots:** Replace the placeholder markdown images below with your actual screenshot image paths (e.g. `./screenshots/dashboard.png` or an image hosting URL).

### 1. Ticket List Dashboard (Overview, Summary Cards, Filters & Table)
```
[ PASTE SCREENSHOT 1 HERE: Main Dashboard & Ticket List ]
```
![Ticket List Dashboard](https://placehold.co/1200x675/f8fafc/334155?text=1.+Ticket+List+Dashboard+(Summary+Cards,+Filters,+Data+Table))

<br />

---

### 2. Create Ticket Form (Live Character Counter & Inline Validation)
```
[ PASTE SCREENSHOT 2 HERE: Create Ticket Form ]
```
![Create Ticket Form](https://placehold.co/1200x675/f8fafc/334155?text=2.+Create+Ticket+Form+(Live+Counter+0%2F120,+Inline+Validation))

<br />

---

### 3. Ticket Detail & Status Management (Inline Status & Priority Controls)
```
[ PASTE SCREENSHOT 3 HERE: Ticket Detail View ]
```
![Ticket Detail View](https://placehold.co/1200x675/f8fafc/334155?text=3.+Ticket+Detail+View+(Metadata,+Status+%26+Priority+Editing))

<br />

---

### 4. Mobile Responsive View (Stacked Cards & Touch Controls)
```
[ PASTE SCREENSHOT 4 HERE: Mobile Responsive View ]
```
![Mobile Responsive View](https://placehold.co/600x900/f8fafc/334155?text=4.+Mobile+Responsive+View+(Stacked+Cards+at+360px))

<br />

---

## 🚀 Step-by-Step Setup Instructions

Follow these steps to run the application locally from scratch:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Support Ticket Dashboard"
```

### 2. Configure Environment Variables
Copy the `.env.example` files to `.env` in both folders:

**On macOS / Linux:**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**On Windows (PowerShell):**
```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### 3. Install Dependencies
```bash
npm --prefix backend install
npm --prefix frontend install
```

### 4. Setup Database & Seed Data
Initialize the SQLite database schema with Prisma migrations and seed 33 realistic tickets:
```bash
npm run seed
```

### 5. Start Development Servers
Open two terminal windows:

- **Terminal 1 (Backend API):**
  ```bash
  npm run dev:backend
  ```
  *(Server runs at `http://localhost:5000`)*

- **Terminal 2 (Frontend App):**
  ```bash
  npm run dev:frontend
  ```
  *(Vite app runs at `http://localhost:5173`)*

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 🔐 Environment Variables

The project uses zero-setup local defaults. Customize them via `.env` files if needed:

### Backend (`backend/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Express REST API |
| `DATABASE_URL` | `"file:./dev.db"` | Local SQLite database file path |
| `CORS_ORIGIN` | `"http://localhost:5173"` | Allowed origin for frontend CORS requests |

### Frontend (`frontend/.env`)
| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL for backend REST API endpoints |

---

## 🧪 Instructions to Run Automated Tests

The repository contains 33 automated tests across backend integration and frontend components.

### 1. Run All Tests (Backend + Frontend)
```bash
npm run test
```

### 2. Run Backend Tests Only (Vitest + Supertest)
Tests run against an isolated SQLite test database (`file:./test.db`) with clean resets before each test:
```bash
npm run test:backend
# or inside the backend folder:
cd backend && npm test
```
**Coverage (25 tests):**
- Ticket creation & validation (missing title, title > 120 chars, RFC email check, priority enum, strict schema).
- Database-level filtering (search by title or email, status filter, priority filter, combined `AND` filters).
- Sorting (`newest` vs `oldest` by `createdAt`) and server-driven pagination (10 items/page).
- Single ticket retrieval by ID, malformed ID rejection (400), and non-existent ID (404).
- `PATCH /api/tickets/:id` mutations (status & priority update, `updatedAt` change, disallowed field rejection).
- Dataset-wide `/api/tickets/stats` counts independent of query filters.
- Central error middleware and 404 route handling.

### 3. Run Frontend Tests Only (Vitest + React Testing Library)
```bash
npm run test:frontend
# or inside the frontend folder:
cd frontend && npm test
```
**Coverage (8 tests):**
- Client-side inline form validation error displays.
- Live character counter updates while typing (`0/120` -> `27/120`).
- Priority and Status badge accessibility ARIA attributes.
- Filter-aware empty state with clear-filters callback.
- Pagination bounds, page calculations, and Previous/Next button disabling.

---

## 🛠️ Tech Stack & Architectural Decisions

| Layer | Technologies | Rationale |
|---|---|---|
| **Monorepo** | npm Workspaces / Root orchestration | Keeps backend and frontend in a single repository with unified root scripts (`dev`, `test`, `seed`) while maintaining clean modular separation. |
| **Backend API** | Node.js, Express, TypeScript | Lightweight, fast runtime with strict typing, predictable routing, and central error middleware. |
| **Database & ORM** | SQLite, Prisma ORM | **Zero-setup local execution**: No Docker or PostgreSQL installation needed. Includes migrations, schema indexes (`status`, `priority`, `createdAt`), and typed queries. |
| **Validation** | Zod | Runtime type safety and schema validation with structured `{ field, message }` error mapping mirrored on frontend. |
| **Frontend** | React 18, Vite, TypeScript | Modern component architecture, type-safe API consumption, and fast build times. |
| **Routing & URL Sync** | React Router v6 | Bidirectional URL query synchronization (`?search=...&status=...&page=...`) for shareable links and refresh persistence. |
| **UI & Styling** | Tailwind CSS, Lucide Icons | Clean, responsive, mobile-first design with explicit WCAG-compliant color, icon, and text indicators. |
| **Testing** | Vitest, Supertest, React Testing Library | Fast unit and integration testing with isolated database environments. |

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

### 1. `GET /api/tickets/stats`
Returns total ticket counts across the entire database, unaffected by any active filters.

**Response (`200 OK`):**
```json
{
  "total": 33,
  "open": 12,
  "inProgress": 10,
  "resolved": 11
}
```

---

### 2. `GET /api/tickets`
Fetches paginated tickets with database-level multi-filter combining and sorting.

**Query Parameters:**
- `search` (string): Case-insensitive partial match on `title` OR `customerEmail`.
- `status` (string): `OPEN` | `IN_PROGRESS` | `RESOLVED`.
- `priority` (string): `LOW` | `MEDIUM` | `HIGH`.
- `sort` (string): `newest` (default) | `oldest`.
- `page` (number): Page number (default `1`).
- `limit` (number): Fixed at `10` items per page.

**Example Request:**
```http
GET /api/tickets?search=sarah.chen&status=IN_PROGRESS&priority=HIGH&page=1&sort=newest
```

**Response (`200 OK`):**
```json
{
  "data": [
    {
      "id": 7,
      "title": "API rate limits triggered unexpectedly for Enterprise tier",
      "description": "Enterprise account with unlimited tier is hitting HTTP 429 after 500 requests per minute.",
      "customerEmail": "sarah.chen@techcorp.io",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "createdAt": "2026-09-19T06:46:13.305Z",
      "updatedAt": "2026-09-19T06:46:13.305Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 3. `GET /api/tickets/:id`
Fetches a single ticket by numeric ID.

**Response (`200 OK`):**
```json
{
  "id": 1,
  "title": "Payment gateway failing for European customers",
  "description": "Multiple users in the EU region report 502 errors when checking out...",
  "customerEmail": "sarah.chen@techcorp.io",
  "priority": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-09-30T12:42:37.827Z",
  "updatedAt": "2026-09-30T12:42:37.827Z"
}
```

**Error Response (`404 Not Found`):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Ticket with id 9999 not found"
  }
}
```

---

### 4. `POST /api/tickets`
Creates a new support ticket.

**Request Body:**
```json
{
  "title": "SSO login loop for Okta users",
  "description": "Users attempting SAML 2.0 authentication are redirected back to login.",
  "customerEmail": "alex.miller@acme.org",
  "priority": "HIGH",
  "status": "OPEN"
}
```

**Response (`201 Created`):**
```json
{
  "id": 34,
  "title": "SSO login loop for Okta users",
  "description": "Users attempting SAML 2.0 authentication are redirected back to login.",
  "customerEmail": "alex.miller@acme.org",
  "priority": "HIGH",
  "status": "OPEN",
  "createdAt": "2026-10-01T14:46:36.081Z",
  "updatedAt": "2026-10-01T14:46:36.081Z"
}
```

**Validation Error Response (`400 Bad Request`):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title must be 120 characters or fewer"
      },
      {
        "field": "customerEmail",
        "message": "Customer email must be a valid email address"
      }
    ]
  }
}
```

---

### 5. `PATCH /api/tickets/:id`
Updates `status` and/or `priority` of an existing ticket. Other fields cannot be modified.

**Request Body:**
```json
{
  "status": "RESOLVED",
  "priority": "LOW"
}
```

**Response (`200 OK`):**
```json
{
  "id": 1,
  "title": "Payment gateway failing for European customers",
  "description": "Multiple users in the EU region report 502 errors...",
  "customerEmail": "sarah.chen@techcorp.io",
  "priority": "LOW",
  "status": "RESOLVED",
  "createdAt": "2026-09-30T12:42:37.827Z",
  "updatedAt": "2026-10-01T15:20:00.000Z"
}
```

---

## 📁 Repository Structure

```text
support-ticket-dashboard/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # SQLite migrations
│   │   ├── schema.prisma        # Database schema with indexes
│   │   └── seed.ts              # 33 realistic tickets seed script
│   ├── src/
│   │   ├── controllers/         # Request handling & schema validation
│   │   ├── lib/                 # Prisma client singleton
│   │   ├── middleware/          # Central error handler, notFound, asyncHandler
│   │   ├── routes/              # Express API route definitions
│   │   ├── services/            # Database queries (filtering, pagination, stats)
│   │   ├── test/                # Vitest + Supertest integration tests
│   │   ├── types/               # TypeScript domain interfaces
│   │   ├── validators/          # Zod validation schemas
│   │   ├── app.ts               # Express application setup
│   │   └── server.ts            # Server entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   │   ├── api/                 # Typed API client with central error parser
│   │   ├── components/
│   │   │   ├── common/          # Badges, Pagination, Skeletons, EmptyState, Alerts
│   │   │   ├── layout/          # Navbar, AppLayout wrapper
│   │   │   └── tickets/         # StatsOverview, TicketFilters, TicketTable, TicketCard
│   │   ├── hooks/               # useDebounce hook (300ms)
│   │   ├── pages/               # TicketListPage, CreateTicketPage, TicketDetailPage, NotFoundPage
│   │   ├── test/                # RTL component tests
│   │   ├── types/               # Frontend TypeScript definitions
│   │   ├── utils/               # Formatters (dates, relative time) and cn helper
│   │   ├── App.tsx              # Router configuration
│   │   ├── index.css            # Tailwind directives
│   │   └── main.tsx             # React entry point
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── ASSUMPTIONS.md               # Technical assumptions log
├── PROJECT_EXPLANATION.md       # Architectural overview & decisions
├── package.json                 # Monorepo root scripts
└── README.md                    # Documentation & setup guide
```

---

## 💡 Assumptions & Technical Decisions

1. **SQLite Database & Autoincrement IDs**: Used SQLite with integer IDs for simplicity, rapid setup, and clean URL routing (`/tickets/1`).
2. **Enum Emulation**: SQLite has no native enum types; enums (`LOW/MEDIUM/HIGH` and `OPEN/IN_PROGRESS/RESOLVED`) are stored as strings and strictly guarded via Zod and TypeScript unions.
3. **Database-Level Filtering**: Search (title OR email), status, priority, sorting, and pagination are executed directly inside SQL queries (`WHERE`, `ORDER BY`, `LIMIT/OFFSET`) rather than in-memory JavaScript filtering.
4. **URL Synchronization**: All filter parameters, search queries, sort orders, and page numbers sync to the browser URL for bookmarking, refresh persistence, and link sharing.
5. **Stats Independence**: `/api/tickets/stats` calculates whole-dataset counts regardless of active table filters and is mounted before `/:id` to prevent route shadowing.

---

## 🔮 Known Limitations & Future Improvements

1. **Authentication & Authorization**: In a production environment, role-based access control (RBAC) would separate Support Agents, Admins, and Customers.
2. **Single SQLite Concurrency**: A production deployment would use PostgreSQL or MySQL for high concurrent write throughput.
3. **Real-Time Updates**: WebSockets (Socket.io) or Server-Sent Events (SSE) to update the dashboard live when other agents modify tickets.
4. **File Attachments**: Uploading screenshots or log files stored in S3/Cloud Storage.

---

## ⏱️ Approximate Time Spent

- **Scaffolding & Tooling**: ~30 mins
- **Database Schema, Migrations & 33 Seed Tickets**: ~35 mins
- **Backend REST API, Validation & Error Middleware**: ~50 mins
- **Backend Automated Test Suite (25 tests)**: ~45 mins
- **Frontend Core, API Client & Shared Components**: ~50 mins
- **Ticket List, Debounced Search, URL Sync & Server Pagination**: ~55 mins
- **Create Ticket Form with Client/Server Validation Mapping**: ~35 mins
- **Ticket Detail View & Status/Priority Updates**: ~35 mins
- **Responsive Design Pass & Frontend Tests (8 tests)**: ~35 mins
- **Documentation & Final Cleanup**: ~25 mins
- **Total Time**: ~6.5 hours

---

## 🤖 AI Assistance Disclosure

This project was developed with assistance from **Antigravity (Google DeepMind)** for rapid boilerplate scaffolding, realistic seed dataset generation across 60 days, structuring Vitest/Supertest test suites, and formatting documentation. All architectural decisions, data models, validation schemas, API routing, and code structure were reviewed, verified, and tested step-by-step.
