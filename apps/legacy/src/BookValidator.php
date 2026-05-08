<?php

declare(strict_types=1);

final class BookValidator
{
    private const VALID_STATUSES = ['want_to_read', 'reading', 'finished'];

    public function validate(array $input): array
    {
        $errors = [];

        if ($this->isBlank($input['title'] ?? null)) {
            $errors[] = 'Title is required.';
        }

        if ($this->isBlank($input['author'] ?? null)) {
            $errors[] = 'Author is required.';
        }

        $status = $input['status'] ?? 'want_to_read';
        if (!in_array($status, self::VALID_STATUSES, true)) {
            $errors[] = 'Status must be want_to_read, reading, or finished.';
        }

        $rating = $input['rating'] ?? null;
        if ($rating !== null && $rating !== '' && !$this->isValidRating($rating)) {
            $errors[] = 'Rating must be a number from 1 to 5.';
        }

        return $errors;
    }

    public function normalize(array $input): array
    {
        $rating = $input['rating'] ?? null;

        return [
            'title' => trim((string) ($input['title'] ?? '')),
            'author' => trim((string) ($input['author'] ?? '')),
            'status' => (string) ($input['status'] ?? 'want_to_read'),
            'rating' => ($rating === null || $rating === '') ? null : (int) $rating,
            'notes' => trim((string) ($input['notes'] ?? '')),
        ];
    }

    private function isBlank(mixed $value): bool
    {
        return trim((string) $value) === '';
    }

    private function isValidRating(mixed $rating): bool
    {
        if (filter_var($rating, FILTER_VALIDATE_INT) === false) {
            return false;
        }

        $rating = (int) $rating;

        return $rating >= 1 && $rating <= 5;
    }
}
