// middlewares/auth.js

const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'backendmesto' } = process.env;
const UnautorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnautorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
