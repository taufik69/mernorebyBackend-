class apiResponse {
  constructor(Success = true, data, message, error = false) {
    (this.success = Success),
      (this.data = data),
      (this.message = message),
      (this.error = error);
  }
}

module.exports = { apiResponse };
