const { HTTP_STATUS_CODES } = require("../utils/constants");

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
