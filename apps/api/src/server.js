import { createApp } from './app.js';
import { createBookRepository, createPoolFromEnv } from './db.js';

const port = Number(process.env.PORT || 3000);
const pool = createPoolFromEnv();
const app = createApp({ bookRepository: createBookRepository(pool) });

app.listen(port, '0.0.0.0', () => {
  console.log(`Express API listening on port ${port}`);
});
