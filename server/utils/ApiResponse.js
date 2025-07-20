class ApiResponse {
  constructor(statusCode, data = null, message = "Success", error = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}

export { ApiResponse };

