class apiError {
  constructor(Success = false, statusCode, data, message, error = true) {
    (this.success = Success),
      ((this.statusCode = statusCode), (this.data = data)),
      (this.message = message),
      (this.error = error);
  }
}

module.exports = { apiError };
