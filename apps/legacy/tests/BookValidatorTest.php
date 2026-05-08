<?php

declare(strict_types=1);

require_once __DIR__ . '/../src/BookValidator.php';

$validator = new BookValidator();

function assertValidationErrors(array $expected, array $actual, string $case): void
{
    if ($actual !== $expected) {
        fwrite(STDERR, sprintf(
            "Failed asserting validation errors for %s.\nExpected: %s\nActual: %s\n",
            $case,
            json_encode($expected),
            json_encode($actual)
        ));
        exit(1);
    }
}

assertValidationErrors(
    [],
    $validator->validate([
        'title' => 'Kindred',
        'author' => 'Octavia E. Butler',
        'status' => 'reading',
        'rating' => null,
        'notes' => 'A strong science fiction recommendation.',
    ]),
    'valid book'
);

assertValidationErrors(
    ['Title is required.', 'Author is required.'],
    $validator->validate([
        'title' => '   ',
        'author' => '',
        'status' => 'want_to_read',
        'rating' => null,
        'notes' => '',
    ]),
    'missing required fields'
);

assertValidationErrors(
    ['Status must be want_to_read, reading, or finished.', 'Rating must be a number from 1 to 5.'],
    $validator->validate([
        'title' => 'Bad Input Example',
        'author' => 'Interview Prep',
        'status' => 'archived',
        'rating' => 6,
        'notes' => '',
    ]),
    'invalid status and rating'
);

echo "BookValidatorTest passed.\n";
