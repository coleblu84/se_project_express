const { HTTP_STATUS_CODES } = require("../utils/constants");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CODES.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
