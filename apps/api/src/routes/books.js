import { Router } from 'express';

export function createBooksRouter({ bookRepository }) {
  const router = Router();

  router.get('/', async (_request, response, next) => {
    try {
      const books = await bookRepository.all();
      response.json({ data: books, error: null });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
