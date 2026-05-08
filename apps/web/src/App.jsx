import { useEffect, useState } from 'react';

const statusLabels = {
  want_to_read: 'Want to read',
  reading: 'Reading',
  finished: 'Finished',
};

export default function App() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('Checking the modern stack...');

  useEffect(() => {
    let ignore = false;

    async function loadBooks() {
      try {
        const response = await fetch('/api/books');
        const payload = await response.json();

        if (!response.ok || payload.error) {
          throw new Error(payload.error || 'Unable to load books.');
        }

        if (!ignore) {
          setBooks(payload.data || []);
          setStatus('React -> Express -> MySQL is connected.');
        }
      } catch (error) {
        if (!ignore) {
          setStatus(error.message || 'Unable to load books.');
        }
      }
    }

    loadBooks();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Modern React + Express Practice</p>
        <h1>Reading List Port</h1>
        <p>
          This starter screen proves the modern stack can talk through every layer.
          Port the legacy CRUD behavior here one small feature at a time.
        </p>
      </section>

      <section className="panel">
        <h2>Stack Check</h2>
        <p className="message success">{status}</p>
      </section>

      <section className="panel">
        <h2>Seeded Books From MySQL</h2>
        <div className="books" aria-live="polite">
          {books.length === 0 ? (
            <p className="book-meta">No books loaded yet.</p>
          ) : (
            books.map((book) => (
              <article className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p className="book-meta">by {book.author}</p>
                <p className="book-meta">
                  <span className="book-badge">{statusLabels[book.status] || book.status}</span>
                  <span>{book.rating ? `${book.rating}/5 stars` : 'No rating'}</span>
                </p>
                <p className="book-notes">{book.notes || 'No notes yet.'}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
