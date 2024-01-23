import { ILogger } from '../server';

export class BaseApiError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
    readonly details?: unknown,
    readonly logger?: ILogger | Console
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
