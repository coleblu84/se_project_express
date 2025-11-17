const { HTTP_STATUS_CODES } = require("../utils/constants");

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
