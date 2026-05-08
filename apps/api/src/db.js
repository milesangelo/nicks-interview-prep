import mysql from "mysql2/promise";

export function createPoolFromEnv(env = process.env) {
  return mysql.createPool({
    host: env.DB_HOST || "localhost",
    port: Number(env.DB_PORT || 3306),
    database: env.DB_NAME || "reading_list",
    user: env.DB_USER || "reading_user",
    password: env.DB_PASSWORD || "change-me-for-local-dev",
    waitForConnections: true,
    connectionLimit: 10
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
    async create(book) {
      // same INSERT SQL - but ? placeholders instead of :title, :author, etc.
      // pool.execute() does prepare + execute in one call
      console.log("params:", [
        book.title,
        book.author,
        book.status,
        book.rating,
        book.notes
      ]);
      const [
        result
      ] = await pool.execute(
        `INSERT INTO books (title, author, status, rating, notes)
         VALUES (?,?,?,?,?)`,
        [
          // Values array maps to each ? in order - replaces bindableBook()
          book.title,
          book.author,
          book.status,
          book.rating,
          book.notes
        ]
      );
      const newId = result.insertId;
      const [rows] = await pool.execute(`SELECT * FROM books WHERE id = ?`, [
        newId
      ]);
      return rows[0];
      // result.insertID is equal to pdo->lastInsertId()
      // fetch the full row back so the response includes id, created_at, updated_at ...
    }
  };
}
