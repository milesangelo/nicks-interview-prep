<?php

declare(strict_types=1);

final class BookRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function all(): array
    {
        $statement = $this->pdo->query(
            'SELECT id, title, author, status, rating, notes, created_at, updated_at
             FROM books
             ORDER BY updated_at DESC, id DESC'
        );

        return $statement->fetchAll();
    }

    public function create(array $book): array
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO books (title, author, status, rating, notes)
             VALUES (:title, :author, :status, :rating, :notes)'
        );

        $statement->execute($this->bindableBook($book));

        return $this->find((int) $this->pdo->lastInsertId());
    }

    public function update(int $id, array $book): ?array
    {
        $statement = $this->pdo->prepare(
            'UPDATE books
             SET title = :title, author = :author, status = :status, rating = :rating, notes = :notes
             WHERE id = :id'
        );

        $statement->execute(['id' => $id] + $this->bindableBook($book));

        return $this->find($id);
    }

    public function delete(int $id): bool
    {
        $statement = $this->pdo->prepare('DELETE FROM books WHERE id = :id');
        $statement->execute(['id' => $id]);

        return $statement->rowCount() > 0;
    }

    public function find(int $id): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, title, author, status, rating, notes, created_at, updated_at
             FROM books
             WHERE id = :id'
        );
        $statement->execute(['id' => $id]);

        $book = $statement->fetch();

        return $book === false ? null : $book;
    }

    private function bindableBook(array $book): array
    {
        return [
            'title' => $book['title'],
            'author' => $book['author'],
            'status' => $book['status'],
            'rating' => $book['rating'],
            'notes' => $book['notes'],
        ];
    }
}
