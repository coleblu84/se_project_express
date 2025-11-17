const { HTTP_STATUS_CODES } = require("../utils/constants");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
  }
}

module.exports = NotFoundError;
