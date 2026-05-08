# Reading List Interview Prep

This repo is a deliberately small porting exercise for a first software interview.
It contains both stacks side by side:

- A legacy PHP + vanilla HTML/CSS/jQuery app.
- A modern React + Express app scaffold.
- One shared MySQL database container.

The business domain is intentionally simple: a reading list. The point is to practice reading an older stack, mapping behavior, and porting the same logic into React and Express without getting blocked by setup.

## What The Legacy App Does

The legacy app already lets you:

- List seeded books from MySQL.
- Add a new book.
- Edit title, author, reading status, rating, and notes.
- Delete a book.
- See the same CRUD behavior flow from browser UI to AJAX to PHP to SQL.

The modern stack currently proves one behavior:

- React loads seeded books from Express.
- Express reads those books from MySQL.
- The browser shows that React -> Express -> MySQL communication works.

The remaining CRUD behavior is intentionally left as the porting exercise.

## Prerequisites

Install these before running the project:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git
- A web browser

No local PHP, Apache, MySQL, Composer, or Node install is required if you run everything through Docker.

## Project Structure

```text
.
├── apps
│   ├── api
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app.js
│   │   │   ├── db.js
│   │   │   ├── routes
│   │   │   │   └── books.js
│   │   │   └── server.js
│   │   └── tests
│   │       ├── books.test.js
│   │       └── db.test.js
│   ├── legacy
│   │   ├── public
│   │   │   ├── api
│   │   │   │   └── books.php
│   │   │   ├── assets
│   │   │   │   ├── app.js
│   │   │   │   └── styles.css
│   │   │   └── index.html
│   │   ├── src
│   │   │   ├── BookRepository.php
│   │   │   ├── BookValidator.php
│   │   │   └── Database.php
│   │   └── tests
│   │       └── BookValidatorTest.php
│   └── web
│       ├── index.html
│       ├── package.json
│       ├── src
│       │   ├── App.jsx
│       │   ├── App.test.jsx
│       │   ├── main.jsx
│       │   └── styles.css
│       └── vite.config.js
├── db
│   └── init.sql
├── docker
│   ├── legacy-php
│   │   └── Dockerfile
│   └── node
│       └── Dockerfile
├── .dockerignore
├── .env.example
├── docker-compose.yml
├── package-lock.json
├── package.json
└── README.md
```

## Run Both Stacks

From the repository root:

```bash
cp .env.example .env
docker compose up --build
```

Open the app:

```text
Legacy PHP app: http://localhost:8080
Modern React app: http://localhost:5173
Express API: http://localhost:3000/api/books
```

The first startup may take a few minutes because Docker needs to download PHP, Node, and MySQL images and install npm dependencies.

## Stop The Stack

```bash
docker compose down
```

## Reset The Database

This deletes the MySQL volume and re-runs `db/init.sql` with the seed data:

```bash
docker compose down -v
docker compose up --build
```

## Useful Commands

Validate the Docker Compose file:

```bash
docker compose config
```

Run the PHP validator test:

```bash
docker run --rm -v "$PWD":/app -w /app php:8.3-cli php apps/legacy/tests/BookValidatorTest.php
```

Lint the PHP files:

```bash
docker run --rm -v "$PWD":/app -w /app php:8.3-cli sh -c 'php -l apps/legacy/src/Database.php && php -l apps/legacy/src/BookRepository.php && php -l apps/legacy/src/BookValidator.php && php -l apps/legacy/public/api/books.php'
```

Run the modern API tests:

```bash
npm --workspace apps/api test
```

Run the modern React tests:

```bash
npm --workspace apps/web test
```

Run all Node workspace tests:

```bash
npm test
```

Call the legacy API directly:

```bash
curl http://localhost:8080/api/books.php
```

Call the modern API directly:

```bash
curl http://localhost:3000/api/books
```

Create a book with the legacy API:

```bash
curl -X POST http://localhost:8080/api/books.php \
  -H "Content-Type: application/json" \
  -d '{"title":"Kindred","author":"Octavia E. Butler","status":"reading","rating":null,"notes":"Practice creating a book through the API."}'
```

## MySQL Connection Details

Docker exposes MySQL on port `3306`.

```text
Host: localhost
Port: 3306
Database: value of DB_NAME in .env
User: value of DB_USER in .env
Password: value of DB_PASSWORD in .env
Root password: value of MYSQL_ROOT_PASSWORD in .env
```

You can connect with any MySQL client, or from the MySQL container:

```bash
docker compose exec mysql sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"'
```

## Legacy API Reference

All API responses use this shape:

```json
{
  "data": [],
  "error": null
}
```

Validation errors use the same shape:

```json
{
  "data": null,
  "error": "Title is required."
}
```

Endpoints:

- `GET /api/books.php` lists all books.
- `POST /api/books.php` creates a book from a JSON body.
- `PUT /api/books.php?id=1` updates a book from a JSON body.
- `DELETE /api/books.php?id=1` deletes a book.

Book JSON fields:

```json
{
  "title": "Kindred",
  "author": "Octavia E. Butler",
  "status": "reading",
  "rating": null,
  "notes": "Short notes go here."
}
```

Allowed `status` values:

- `want_to_read`
- `reading`
- `finished`

Allowed `rating` values are `1` through `5`, or `null`.

## Manual Smoke Test

After `docker compose up --build`, open `http://localhost:8080` and verify:

- Seed books appear on the page.
- Submitting a blank title or author shows a validation message.
- Adding a book creates a new card.
- Editing a book updates the card.
- Deleting a book removes the card.
- Refreshing the browser keeps the data because it is stored in MySQL.

Then open `http://localhost:5173` and verify:

- The modern page says `React -> Express -> MySQL is connected.`
- The seeded books appear on the page.
- `curl http://localhost:3000/api/books` returns the same seeded books in `{ "data": [...], "error": null }` format.

## How To Study The Legacy Stack

Read the files in this order:

1. `db/init.sql`: database shape and seed data.
2. `apps/legacy/src/Database.php`: how PHP connects to MySQL.
3. `apps/legacy/src/BookValidator.php`: business rules for incoming data.
4. `apps/legacy/src/BookRepository.php`: SQL queries for CRUD behavior.
5. `apps/legacy/public/api/books.php`: HTTP routing and JSON responses.
6. `apps/legacy/public/index.html`: page structure.
7. `apps/legacy/public/assets/app.js`: jQuery AJAX and UI state.
8. `apps/legacy/public/assets/styles.css`: vanilla styling.

As you read, write down each behavior in plain English before thinking about React or Express.

## How To Study The Modern Scaffold

Read the files in this order:

1. `apps/api/src/db.js`: how Express connects to MySQL and reads books.
2. `apps/api/src/routes/books.js`: how the modern API returns `{ data, error }`.
3. `apps/api/src/app.js`: how routes are composed into the Express app.
4. `apps/api/tests/books.test.js`: what the API promises to return.
5. `apps/web/vite.config.js`: how `/api` requests proxy from React to Express.
6. `apps/web/src/App.jsx`: how React fetches and renders books.
7. `apps/web/src/App.test.jsx`: what the modern UI proves.

## Suggested React + Express Porting Roadmap

Port in small steps:

1. Keep MySQL and the schema the same.
2. The modern stack already has `GET /api/books`; compare it to `GET /api/books.php`.
3. Recreate the remaining PHP API contract in Express:
   - `POST /api/books`
   - `PUT /api/books/:id`
   - `DELETE /api/books/:id`
4. Port validation from `apps/legacy/src/BookValidator.php` into Express.
5. Add React form state for creating books.
6. Add React edit and delete behavior.
7. Match the legacy smoke test first, then improve component structure.

Target modern endpoints:

```text
GET /api/books
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id
```

The important interview skill is not the book domain. It is learning to identify data shape, validation rules, API contracts, UI state, and persistence behavior, then map those pieces into the new stack.
