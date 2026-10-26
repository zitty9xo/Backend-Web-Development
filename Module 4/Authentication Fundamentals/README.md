# Authentication Fundamentals Starter

## Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm start
```

Registration accepts non-empty `name`, `email`, and `password` values. Names and
emails are trimmed, and emails are stored lowercase.
Passwords are stored as bcrypt hashes and never appear in a response.

Successful registration returns `201` with a safe user object under `data`. A
duplicate email returns `409 EMAIL_EXISTS`. Login returns `200` with the safe user
object under `data`; every invalid login returns the same generic `401
INVALID_CREDENTIALS` response.

The SQLite datasource keeps local setup self-contained. Do not commit `.env` or
`prisma/dev.db`.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`

Use the platform assignment for required request, response, and security behavior.
