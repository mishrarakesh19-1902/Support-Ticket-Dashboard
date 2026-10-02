import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import prisma from '../lib/prisma.js';

describe('Support Ticket Dashboard API Tests', () => {
  beforeEach(async () => {
    // Clear test database before each test
    await prisma.ticket.deleteMany();
    try {
      await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'tickets';");
    } catch {
      // Ignore if sqlite_sequence not initialized
    }
  });

  describe('1. POST /api/tickets - Creation & Validation', () => {
    it('creates a valid ticket with default status OPEN and default priority MEDIUM', async () => {
      const payload = {
        title: 'Cannot reset password from mobile view',
        description: 'The reset link returns 404 on mobile browsers.',
        customerEmail: 'user@example.com',
      };

      const res = await request(app)
        .post('/api/tickets')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        title: payload.title,
        description: payload.description,
        customerEmail: payload.customerEmail,
        priority: 'MEDIUM',
        status: 'OPEN',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('creates a ticket with explicit priority and status', async () => {
      const payload = {
        title: 'Critical checkout failure',
        description: 'Stripe webhook timeout.',
        customerEmail: 'admin@startup.com',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
      };

      const res = await request(app)
        .post('/api/tickets')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.priority).toBe('HIGH');
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('rejects ticket creation when title is missing', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          description: 'No title provided',
          customerEmail: 'user@example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: expect.arrayContaining([
            expect.objectContaining({ field: 'title', message: expect.any(String) }),
          ]),
        },
      });
    });

    it('rejects ticket creation when title exceeds 120 characters', async () => {
      const longTitle = 'a'.repeat(121);
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: longTitle,
          description: 'Valid description',
          customerEmail: 'user@example.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: 'Title must be 120 characters or fewer',
          }),
        ])
      );
    });

    it('rejects ticket creation when customerEmail is invalid', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Valid description',
          customerEmail: 'not-an-email',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'customerEmail',
            message: 'Customer email must be a valid email address',
          }),
        ])
      );
    });

    it('rejects ticket creation with invalid priority enum', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Valid description',
          customerEmail: 'user@example.com',
          priority: 'URGENT',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'priority',
            message: "Priority must be one of 'LOW', 'MEDIUM', or 'HIGH'",
          }),
        ])
      );
    });

    it('rejects unexpected fields in request body', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Valid title',
          description: 'Valid description',
          customerEmail: 'user@example.com',
          extraField: 'not allowed',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('2. GET /api/tickets - Querying, Filtering & Pagination', () => {
    beforeEach(async () => {
      // Seed 15 controlled test tickets
      const now = Date.now();
      for (let i = 1; i <= 15; i++) {
        await prisma.ticket.create({
          data: {
            title: i % 2 === 0 ? `Database connection issue ${i}` : `UI bug in dashboard ${i}`,
            description: `Detailed description for issue ${i}`,
            customerEmail: i <= 5 ? 'sarah.chen@techcorp.io' : `client${i}@domain.com`,
            priority: i % 3 === 0 ? 'HIGH' : i % 3 === 1 ? 'MEDIUM' : 'LOW',
            status: i % 3 === 0 ? 'RESOLVED' : i % 3 === 1 ? 'OPEN' : 'IN_PROGRESS',
            createdAt: new Date(now - (16 - i) * 86400000), // oldest to newest
            updatedAt: new Date(now - (16 - i) * 86400000),
          },
        });
      }
    });

    it('returns paginated results with 10 items per page by default', async () => {
      const res = await request(app).get('/api/tickets');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(10);
      expect(res.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 15,
        totalPages: 2,
      });
    });

    it('navigates to page 2 and returns the remaining 5 items', async () => {
      const res = await request(app).get('/api/tickets?page=2');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.pagination.page).toBe(2);
    });

    it('sorts by newest first by default and oldest first when specified', async () => {
      const newestRes = await request(app).get('/api/tickets?sort=newest');
      const oldestRes = await request(app).get('/api/tickets?sort=oldest');

      const newestFirstDate = new Date(newestRes.body.data[0].createdAt).getTime();
      const newestSecondDate = new Date(newestRes.body.data[1].createdAt).getTime();
      expect(newestFirstDate).toBeGreaterThanOrEqual(newestSecondDate);

      const oldestFirstDate = new Date(oldestRes.body.data[0].createdAt).getTime();
      const oldestSecondDate = new Date(oldestRes.body.data[1].createdAt).getTime();
      expect(oldestFirstDate).toBeLessThanOrEqual(oldestSecondDate);
    });

    it('searches tickets by title (partial match, case-insensitive)', async () => {
      const res = await request(app).get('/api/tickets?search=Database');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      res.body.data.forEach((ticket: any) => {
        expect(ticket.title.toLowerCase()).toContain('database');
      });
    });

    it('searches tickets by customer email', async () => {
      const res = await request(app).get('/api/tickets?search=sarah.chen');

      expect(res.status).toBe(200);
      expect(res.body.pagination.total).toBe(5);
      res.body.data.forEach((ticket: any) => {
        expect(ticket.customerEmail).toContain('sarah.chen');
      });
    });

    it('filters tickets by status', async () => {
      const res = await request(app).get('/api/tickets?status=OPEN');

      expect(res.status).toBe(200);
      res.body.data.forEach((ticket: any) => {
        expect(ticket.status).toBe('OPEN');
      });
    });

    it('filters tickets by priority', async () => {
      const res = await request(app).get('/api/tickets?priority=HIGH');

      expect(res.status).toBe(200);
      res.body.data.forEach((ticket: any) => {
        expect(ticket.priority).toBe('HIGH');
      });
    });

    it('combines search, status, and priority filters (AND condition)', async () => {
      const res = await request(app).get(
        '/api/tickets?search=Database&status=OPEN&priority=MEDIUM'
      );

      expect(res.status).toBe(200);
      res.body.data.forEach((ticket: any) => {
        expect(ticket.title.toLowerCase()).toContain('database');
        expect(ticket.status).toBe('OPEN');
        expect(ticket.priority).toBe('MEDIUM');
      });
    });

    it('rejects invalid query parameters with 400 validation error', async () => {
      const res = await request(app).get('/api/tickets?status=INVALID_STATUS');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('3. GET /api/tickets/:id - Single Ticket Retrieval', () => {
    it('returns a single ticket by valid ID', async () => {
      const ticket = await prisma.ticket.create({
        data: {
          title: 'Sample ticket',
          description: 'Sample description',
          customerEmail: 'sample@example.com',
        },
      });

      const res = await request(app).get(`/api/tickets/${ticket.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(ticket.id);
      expect(res.body.title).toBe('Sample ticket');
    });

    it('returns 404 for a non-existent ticket ID', async () => {
      const res = await request(app).get('/api/tickets/99999');

      expect(res.status).toBe(404);
      expect(res.body.error).toEqual({
        code: 'NOT_FOUND',
        message: 'Ticket with id 99999 not found',
      });
    });

    it('returns 400 for a malformed non-numeric ID', async () => {
      const res = await request(app).get('/api/tickets/abc');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('4. PATCH /api/tickets/:id - Updating Status & Priority', () => {
    it('updates status and priority and modifies updatedAt', async () => {
      const pastDate = new Date(Date.now() - 60000);
      const ticket = await prisma.ticket.create({
        data: {
          title: 'Ticket to update',
          description: 'Original description',
          customerEmail: 'user@example.com',
          priority: 'LOW',
          status: 'OPEN',
          createdAt: pastDate,
          updatedAt: pastDate,
        },
      });

      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({
          status: 'RESOLVED',
          priority: 'HIGH',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('RESOLVED');
      expect(res.body.priority).toBe('HIGH');
      expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThan(pastDate.getTime());
    });

    it('rejects update when attempting to modify disallowed fields like title', async () => {
      const ticket = await prisma.ticket.create({
        data: {
          title: 'Ticket original title',
          description: 'Original description',
          customerEmail: 'user@example.com',
        },
      });

      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({
          title: 'Attempted new title',
          status: 'IN_PROGRESS',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects empty update payload', async () => {
      const ticket = await prisma.ticket.create({
        data: {
          title: 'Ticket title',
          description: 'Description',
          customerEmail: 'user@example.com',
        },
      });

      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 404 when updating non-existent ticket', async () => {
      const res = await request(app)
        .patch('/api/tickets/99999')
        .send({ status: 'RESOLVED' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('5. GET /api/tickets/stats - Dataset-wide Summary Stats', () => {
    it('returns overall dataset counts ignoring query parameters', async () => {
      await prisma.ticket.createMany({
        data: [
          { title: 'T1', description: 'D1', customerEmail: 'a@a.com', status: 'OPEN', priority: 'LOW' },
          { title: 'T2', description: 'D2', customerEmail: 'b@b.com', status: 'OPEN', priority: 'HIGH' },
          { title: 'T3', description: 'D3', customerEmail: 'c@c.com', status: 'IN_PROGRESS', priority: 'MEDIUM' },
          { title: 'T4', description: 'D4', customerEmail: 'd@d.com', status: 'RESOLVED', priority: 'LOW' },
          { title: 'T5', description: 'D5', customerEmail: 'e@e.com', status: 'RESOLVED', priority: 'HIGH' },
        ],
      });

      // Stats request should return full dataset totals even if query params are appended
      const res = await request(app).get('/api/tickets/stats?status=OPEN');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        total: 5,
        open: 2,
        inProgress: 1,
        resolved: 2,
      });
    });
  });

  describe('6. Error Handling & 404 Route Fallback', () => {
    it('returns 404 with standard error shape for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-route');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: {
          code: 'ROUTE_NOT_FOUND',
          message: 'Endpoint GET /api/unknown-route does not exist',
        },
      });
    });
  });
});
