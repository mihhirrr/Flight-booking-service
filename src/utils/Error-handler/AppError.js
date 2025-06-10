/**
 * @class AppError
 * @extends Error
 * @description Custom error class that extends built-in Error with an HTTP status code.
 */
class AppError extends Error {
  /**
   * @constructor
   * @param {string} message - Error message
   * @param {number} StatusCode - HTTP status code associated with the error
   */
  constructor(message, StatusCode) {
    super(message);
    this.StatusCode = StatusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;