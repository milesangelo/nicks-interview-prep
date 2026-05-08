<?php

declare(strict_types=1);

require_once __DIR__ . '/../../src/Database.php';
require_once __DIR__ . '/../../src/BookRepository.php';
require_once __DIR__ . '/../../src/BookValidator.php';

header('Content-Type: application/json');

$repository = new BookRepository(Database::connect());
$validator = new BookValidator();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    match ($method) {
        'GET' => respond($repository->all()),
        'POST' => createBook($repository, $validator),
        'PUT' => updateBook($repository, $validator),
        'DELETE' => deleteBook($repository),
        default => respond(null, 'Unsupported HTTP method.', 405),
    };
} catch (Throwable $exception) {
    respond(null, 'Unexpected server error.', 500);
}

function createBook(BookRepository $repository, BookValidator $validator): void
{
    $input = readJsonBody();
    $errors = $validator->validate($input);

    if ($errors !== []) {
        respond(null, implode(' ', $errors), 422);
    }

    respond($repository->create($validator->normalize($input)), null, 201);
}

function updateBook(BookRepository $repository, BookValidator $validator): void
{
    $id = readId();
    if ($id === null) {
        respond(null, 'A valid book id is required.', 400);
    }

    $input = readJsonBody();
    $errors = $validator->validate($input);

    if ($errors !== []) {
        respond(null, implode(' ', $errors), 422);
    }

    $book = $repository->update($id, $validator->normalize($input));
    if ($book === null) {
        respond(null, 'Book not found.', 404);
    }

    respond($book);
}

function deleteBook(BookRepository $repository): void
{
    $id = readId();
    if ($id === null) {
        respond(null, 'A valid book id is required.', 400);
    }

    if (!$repository->delete($id)) {
        respond(null, 'Book not found.', 404);
    }

    respond(['deleted' => true]);
}

function readJsonBody(): array
{
    $rawBody = file_get_contents('php://input');
    $decoded = json_decode($rawBody ?: '{}', true);

    if (!is_array($decoded)) {
        respond(null, 'Request body must be valid JSON.', 400);
    }

    return $decoded;
}

function readId(): ?int
{
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    return $id === false || $id === null ? null : $id;
}

function respond(mixed $data, ?string $error = null, int $statusCode = 200): never
{
    http_response_code($statusCode);
    echo json_encode([
        'data' => $data,
        'error' => $error,
    ], JSON_PRETTY_PRINT);
    exit;
}
