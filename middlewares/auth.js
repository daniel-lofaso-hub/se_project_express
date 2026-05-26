const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    next(new UnauthorizedError("Authorization required"));
  }
};

module.exports = auth;
