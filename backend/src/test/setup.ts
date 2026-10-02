import { execSync } from 'child_process';
import { beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma.js';

beforeAll(async () => {
  // Ensure the test database schema is pushed and up to date
  process.env.DATABASE_URL = 'file:./test.db';
  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'ignore',
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
