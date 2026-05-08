import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import { createApp } from '../src/app.js';

test('GET /api/books returns books from the repository', async () => {
  const app = createApp({
    bookRepository: {
      async all() {
        return [
          {
            id: 1,
            title: 'The Pragmatic Programmer',
            author: 'David Thomas and Andrew Hunt',
            status: 'reading',
            rating: null,
            notes: 'Good reminder to focus on habits and feedback loops.',
            created_at: '2026-05-07T00:00:00.000Z',
            updated_at: '2026-05-07T00:00:00.000Z',
          },
        ];
      },
    },
  });

  const response = await request(app).get('/api/books').expect(200);

  assert.deepEqual(response.body, {
    data: [
      {
        id: 1,
        title: 'The Pragmatic Programmer',
        author: 'David Thomas and Andrew Hunt',
        status: 'reading',
        rating: null,
        notes: 'Good reminder to focus on habits and feedback loops.',
        created_at: '2026-05-07T00:00:00.000Z',
        updated_at: '2026-05-07T00:00:00.000Z',
      },
    ],
    error: null,
  });
});

test('GET /api/health reports the API status', async () => {
  const app = createApp({
    bookRepository: {
      async all() {
        return [];
      },
    },
  });

  const response = await request(app).get('/api/health').expect(200);

  assert.deepEqual(response.body, {
    data: { status: 'ok' },
    error: null,
  });
});
