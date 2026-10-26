const crypto = require('crypto');
const { sessionTtlMs } = require('../config/auth');

const sessions = new Map();

function createSession(userId, ttlMs = sessionTtlMs) {
  if (!Number.isInteger(userId) || !Number.isFinite(ttlMs) || ttlMs <= 0) {
    throw new TypeError('A valid user id and session TTL are required');
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions.set(sessionId, {
    userId,
    expiresAt: Date.now() + ttlMs,
  });
  return sessionId;
}

function getSession(sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length === 0) return null;

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return { ...session };
}

function destroySession(sessionId) {
  return sessions.delete(sessionId);
}

module.exports = { createSession, getSession, destroySession };
