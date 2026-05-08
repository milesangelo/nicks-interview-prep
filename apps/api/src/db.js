import mysql from 'mysql2/promise';

export function createPoolFromEnv(env = process.env) {
  return mysql.createPool({
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT || 3306),
    database: env.DB_NAME || 'reading_list',
    user: env.DB_USER || 'reading_user',
    password: env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export function createBookRepository(pool) {
  return {
    async all() {
      const [rows] = await pool.query(
        `SELECT id, title, author, status, rating, notes, created_at, updated_at
         FROM books
         ORDER BY updated_at DESC, id DESC`
      );

      return rows;
    },
  };
}
