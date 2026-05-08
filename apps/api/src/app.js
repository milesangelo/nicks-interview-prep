import express from 'express';

import { createBooksRouter } from './routes/books.js';

export function createApp({ bookRepository }) {
  const app = express();

  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ data: { status: 'ok' }, error: null });
  });

  app.use('/api/books', createBooksRouter({ bookRepository }));

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({ data: null, error: 'Unexpected server error.' });
  });

  return app;
}
