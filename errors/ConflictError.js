const { HTTP_STATUS_CODES } = require("../utils/constants");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CODES.CONFLICT;
  }
}

module.exports = ConflictError;
