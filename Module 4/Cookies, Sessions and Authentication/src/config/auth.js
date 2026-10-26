const sessionTtlMs = Number(process.env.SESSION_TTL_MS || 3600000);

if (!Number.isInteger(sessionTtlMs) || sessionTtlMs <= 0) {
  throw new Error('SESSION_TTL_MS must be a positive integer');
}

const cookieOptions = Object.freeze({
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
  signed: true,
  maxAge: sessionTtlMs,
});

const clearCookieOptions = Object.freeze({
  httpOnly: cookieOptions.httpOnly,
  path: cookieOptions.path,
  sameSite: cookieOptions.sameSite,
  secure: cookieOptions.secure,
  signed: cookieOptions.signed,
});

module.exports = {
  cookieOptions,
  clearCookieOptions,
  sessionTtlMs,
};
