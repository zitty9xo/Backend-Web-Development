const { getSession } = require('../session/sessionStore');

function unauthorized(res) {
  return res.status(401).json({
    error: { code: 'AUTH_REQUIRED', message: 'Authentication required' },
  });
}

module.exports = function requireSession(req, res, next) {
  const sessionId = req.signedCookies?.sid;
  const session = getSession(sessionId);

  if (!session) return unauthorized(res);

  req.user = { id: session.userId };
  next();
};
