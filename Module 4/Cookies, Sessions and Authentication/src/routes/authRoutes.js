const express = require('express');
const bcrypt = require('bcryptjs');
const requireSession = require('../middleware/requireSession');
const userRepository = require('../repositories/userRepository');
const {
  createSession,
  destroySession,
} = require('../session/sessionStore');
const { cookieOptions, clearCookieOptions } = require('../config/auth');

const router = express.Router();
const dummyPasswordHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

router.post('/login', async (req, res, next) => {
  const { email: rawEmail, password } = req.body || {};
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  if (!email || typeof password !== 'string' || !password) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
    });
  }

  try {
    const user = await userRepository.findByEmail(email);
    const passwordMatches = await bcrypt.compare(
      password,
      user?.passwordHash || dummyPasswordHash,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const sessionId = createSession(user.id);
    res.cookie('sid', sessionId, cookieOptions);
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireSession, async (req, res, next) => {
  try {
    const user = await userRepository.findSafeById(req.user.id);

    if (!user) {
      return res.status(401).json({
        error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
      });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res, next) => {
  try {
    const sessionId = req.signedCookies?.sid;
    if (sessionId) destroySession(sessionId);

    res.clearCookie('sid', clearCookieOptions);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
