import assert from 'node:assert/strict';
import test from 'node:test';

import { createBookRepository } from '../src/db.js';

test('book repository reads books in the legacy ordering', async () => {
  const calls = [];
  const repository = createBookRepository({
    async query(sql) {
      calls.push(sql);

      return [[{ id: 1, title: 'Example Book' }]];
    },
  });

  const books = await repository.all();

  assert.deepEqual(books, [{ id: 1, title: 'Example Book' }]);
  assert.match(calls[0], /SELECT id, title, author, status, rating, notes, created_at, updated_at/);
  assert.match(calls[0], /ORDER BY updated_at DESC, id DESC/);
});
