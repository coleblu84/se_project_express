const jwt = require("jsonwebtoken");
const { HTTP_STATUS_CODES, JWT_SECRET } = require("../utils/constants");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(HTTP_STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Authorization required" });
  }
};

module.exports = auth;
