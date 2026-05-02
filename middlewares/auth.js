const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
};

module.exports = auth;
