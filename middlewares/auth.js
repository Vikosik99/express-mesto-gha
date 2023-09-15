// middlewares/auth.js

const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'backendmesto' } = process.env;
const UnautorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnautorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnautorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
