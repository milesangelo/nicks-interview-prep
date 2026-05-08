<?php

declare(strict_types=1);

final class Database
{
    public static function connect(): PDO
    {
        $host = getenv('DB_HOST') ?: 'mysql';
        $database = getenv('DB_NAME') ?: 'reading_list';
        $user = getenv('DB_USER') ?: 'reading_user';
        $password = getenv('DB_PASSWORD') ?: '';

        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $database);

        return new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
