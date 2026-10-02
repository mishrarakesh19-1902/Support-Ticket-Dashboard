# Project Assumptions & Technical Decisions

1. **Database & ID Generation**:
   - SQLite is used via Prisma ORM for zero-setup execution.
   - Ticket IDs use auto-incremented integer identifiers (e.g. `1`, `2`, `3`) for simplicity and clean URL path parameters (`/tickets/1`).

2. **Enum Handling in SQLite**:
   - SQLite lacks native enum types. Status (`OPEN`, `IN_PROGRESS`, `RESOLVED`) and Priority (`LOW`, `MEDIUM`, `HIGH`) are stored as `String` in Prisma schema and validated at application boundaries via Zod schemas and TypeScript union types.

3. **Database-level Querying**:
   - Filtering (status, priority, search across title or customerEmail), sorting (newest/oldest by `createdAt`), and pagination (`limit=10`, `page`) are executed purely in SQL/Prisma database queries rather than in-memory JavaScript array filtering.
   - Search is case-insensitive. In SQLite, `contains` with default collation operates case-insensitively for ASCII characters.

4. **Stats Endpoint**:
   - `GET /api/tickets/stats` calculates summary counts across the full dataset (total, open, in-progress, resolved) regardless of any active filters or query parameters.
   - It is routed before `/api/tickets/:id` to prevent route collision.

5. **Error Formatting**:
   - Standard unified error response shape: `{ "error": { "code": string, "message": string, "details"?: Array<{ field?: string, message: string }> } }`.
   - Never exposes internal stack traces in responses.

6. **Frontend State & URL Sync**:
   - Filter, search, sort, and pagination state in the Ticket List view are synced bidirectionally to URL search parameters for link sharing and refresh persistence.
   - Search input is debounced at 300ms to avoid unnecessary API requests.
