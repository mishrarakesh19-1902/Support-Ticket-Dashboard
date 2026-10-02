import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
      PORT: '5001',
    },
    // Run test files sequentially to avoid SQLite concurrent file lock issues
    sequence: {
      concurrent: false,
    },
    fileParallelism: false,
  },
});
