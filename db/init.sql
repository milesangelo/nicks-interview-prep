CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  status ENUM('want_to_read', 'reading', 'finished') NOT NULL DEFAULT 'want_to_read',
  rating TINYINT UNSIGNED NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_books_rating_range CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
);

INSERT INTO books (title, author, status, rating, notes) VALUES
  ('The Pragmatic Programmer', 'David Thomas and Andrew Hunt', 'reading', NULL, 'Good reminder to focus on habits and feedback loops.'),
  ('Clean Code', 'Robert C. Martin', 'want_to_read', NULL, 'Use as a discussion starter, not a rulebook.'),
  ('Designing Data-Intensive Applications', 'Martin Kleppmann', 'finished', 5, 'Dense but useful for thinking about persistence and tradeoffs.');
