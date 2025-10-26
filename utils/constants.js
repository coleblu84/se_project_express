const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
};

const JWT_SECRET = "your-very-secret-key";

module.exports = { HTTP_STATUS_CODES, JWT_SECRET };
