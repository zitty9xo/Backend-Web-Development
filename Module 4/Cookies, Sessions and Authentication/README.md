# LU48 Starter — Session Authentication

## Setup

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Set `COOKIE_SECRET` in `.env` to at least 32 random characters. Keep `COOKIE_SECURE=false` for local HTTP; production must use HTTPS with `COOKIE_SECURE=true`.

Seeded demo account: `sam@example.com` / `SessionDemo!48`.

The supplied session store is an in-memory implementation for learning and local
execution only. Production deployments should use a shared expiring store such as
Redis so sessions survive process restarts and work across multiple instances.

Never commit `.env` or real secrets. `.env.example` contains placeholder values
only.

## Authentication implementation

The authentication flow is implemented across:

- `src/routes/authRoutes.js`
- `src/session/sessionStore.js`
- `src/middleware/requireSession.js`

Required endpoints: `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`.

Use Postman cookie jar or curl `-c cookies.txt` and `-b cookies.txt` to preserve the cookie between requests.

## Verify

Start the API after setup:

```bash
npm run dev
```

Login and save the signed cookie:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"sam@example.com","password":"SessionDemo!48"}' \
  http://localhost:3000/auth/login
```

The response must include a `sid` cookie with `HttpOnly` and `SameSite=Lax`.
Use the saved cookie to access the protected identity:

```bash
curl -i -b cookies.txt http://localhost:3000/auth/me
```

Missing, altered, expired, or orphaned cookies return the same generic `401`
response. Logout destroys the server session and clears the cookie:

```bash
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3000/auth/logout
```

Set `COOKIE_SECURE=true` only when serving HTTPS; browsers will not send a
`Secure` cookie over local HTTP.
