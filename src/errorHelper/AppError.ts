class AppError extends Error {
  public statuscode: number;
  public type?: string;
  constructor(statuscode: number, message: string, type?: string, stack = "") {
    super(message);
    this.statuscode = statuscode;
    if (type) {
      this.type = type;
    }
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
