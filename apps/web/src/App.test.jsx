import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import App from './App.jsx';

afterEach(() => {
  vi.restoreAllMocks();
});

test('loads books from the Express API and renders them', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({
      data: [
        {
          id: 1,
          title: 'The Pragmatic Programmer',
          author: 'David Thomas and Andrew Hunt',
          status: 'reading',
          rating: null,
          notes: 'Good reminder to focus on habits and feedback loops.',
        },
      ],
      error: null,
    }),
  });

  render(<App />);

  expect(screen.getByText('Checking the modern stack...')).toBeInTheDocument();
  expect(await screen.findByText('The Pragmatic Programmer')).toBeInTheDocument();
  expect(screen.getByText('by David Thomas and Andrew Hunt')).toBeInTheDocument();
  expect(screen.getByText('React -> Express -> MySQL is connected.')).toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledWith('/api/books');
});
