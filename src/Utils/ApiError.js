class apiError {
  constructor(Success = false, data, message, error = true) {
    (this.success = Success),
      (this.data = data),
      (this.message = message),
      (this.error = error);
  }
}

module.exports = { apiError };
