class AppError extends Error {
  constructor(message, StatusCode) {
    super(message);
    this.StatusCode = StatusCode;
    this.message = message;
  }
}

module.exports = AppError;
