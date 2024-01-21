export class BaseApiError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
  }

  toJSON() {
    return {
      message: this.message,
      details: this.details,
    };
  }
}
