# Pomodoro Backend

A Java (Spring Boot) backend for the Pomodoro app: user accounts, JWT authentication,
and per-user task storage/history, backed by PostgreSQL.

## Security design

- Passwords are hashed with **BCrypt** (work factor 12) — the plain-text password is
  never stored, logged, or returned in any response.
- Auth uses **JWT** bearer tokens (HS256), signed with a secret you provide via
  environment variable — never hardcoded in source.
- All `/api/tasks/**` endpoints require a valid token. The authenticated user is
  resolved from the token itself (not from any client-supplied ID), so there's no
  way for one account to read or modify another account's tasks.
- Login/register return the same error message for "no such account" and "wrong
  password," so failed attempts can't be used to discover which emails have accounts.
- CORS is locked to an explicit allow-list of frontend origins (set via
  `CORS_ALLOWED_ORIGINS`) — not left wide open.
- Error responses are sanitized centrally so stack traces / internal details never
  reach the client.
- The app is stateless (JWT, no server-side sessions), so it scales horizontally
  without shared session storage.

**You still need to do these two things yourself before going live:**
1. Run this behind HTTPS. Spring Boot itself doesn't terminate TLS — the hosting
   platforms below handle this for you automatically.
2. Generate a real random `JWT_SECRET` (see below) instead of the placeholder.

## Local setup

Requires Java 17+, Maven, and PostgreSQL running locally.

```bash
createdb pomodoro

export JWT_SECRET=$(openssl rand -base64 48)
export CORS_ALLOWED_ORIGINS=http://localhost:5500,https://your-site.netlify.app

mvn spring-boot:run
```

The API will be live at `http://localhost:8080/api`.

## Environment variables

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | JDBC connection string | `jdbc:postgresql://host:5432/pomodoro` |
| `DATABASE_USERNAME` | DB user | `pomodoro_user` |
| `DATABASE_PASSWORD` | DB password | (keep secret) |
| `JWT_SECRET` | Signs/verifies tokens — 32+ random bytes | `openssl rand -base64 48` |
| `JWT_EXPIRATION_MS` | Token lifetime in ms (default 7 days) | `604800000` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins | `https://your-site.netlify.app` |
| `PORT` | Port to listen on (most hosts set this automatically) | `8080` |

## Deploying

Any host that runs a Java jar + PostgreSQL works. Easiest options with free tiers:

- **Railway** (railway.app): add a Postgres plugin, connect this repo, set the env
  vars above, deploy. Gives you HTTPS automatically.
- **Render** (render.com): "New Web Service" from this repo, add a Postgres
  instance, set env vars. Also automatic HTTPS.

Build command: `mvn clean package`
Run command: `java -jar target/backend-1.0.0.jar`

## API reference

### `POST /api/auth/register`
```json
{ "email": "you@example.com", "password": "at least 8 chars" }
```
Returns `{ "token": "...", "email": "..." }`.

### `POST /api/auth/login`
Same shape as register.

### `GET /api/tasks`
Requires `Authorization: Bearer <token>`. Returns all of the caller's tasks.

### `POST /api/tasks`
```json
{ "title": "Write report", "date": "2026-09-03", "completed": false, "pomodorosCompleted": 0 }
```

### `PUT /api/tasks/{id}`
Same body shape as POST — updates the task (must belong to the caller).

### `DELETE /api/tasks/{id}`
Deletes the task (must belong to the caller).

## Connecting the frontend

In `script.js`, update:
```js
const API_BASE_URL = "https://your-backend-url.up.railway.app/api";
```
to point at wherever you deploy this. Until you do, the frontend transparently
falls back to browser-local storage (guest mode) — nothing breaks, accounts just
won't sync across devices yet.
