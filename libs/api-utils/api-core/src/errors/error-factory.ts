import { AxiosError, isAxiosError } from 'axios';
import {
  BadGatewayError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  GatewayTimeout,
  GoneError,
  HTTPVersionNotSupported,
  InsufficientStorage,
  InternalServerError,
  LoopDetected,
  MethodNotAllowedError,
  NetworkAuthenticationRequired,
  NotAcceptableError,
  NotExtended,
  NotFoundError,
  NotImplemented,
  RequestTimeoutError,
  ServiceUnavailableError,
  UnauthorizedError,
  VariantAlsoNegotiates,
} from './api-errors';
import { BaseApiError } from './base-api-error';

export class ErrorFactory {
  static create(error: unknown) {
    return ErrorFactory.createError(error);
  }

  private static createError(error: unknown) {
    if (error instanceof BaseApiError) {
      return error;
    }

    if (isAxiosError(error)) {
      return ErrorFactory.parseAxiosErrorToBaseApiError(error);
    }

    if (error instanceof Error) {
      return new InternalServerError('Unhandled error');
    }

    return new InternalServerError('Unexpected error');
  }

  private static parseAxiosErrorToBaseApiError(error: AxiosError) {
    const errorDetails = {
      reason: `Integration with external API failed`,
      request: {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        headers: error.config?.headers,
        data: error.config?.data,
      },
      response: {
        statusCode: error.response?.status,
        data: error.response?.data,
      },
    };

    if (!error.response?.status) {
      return new InternalServerError(error.message, errorDetails);
    }

    switch (error.response.status) {
      case 400:
        return new BadRequestError(error.message, errorDetails);
      case 401:
        return new UnauthorizedError(error.message, errorDetails);
      case 403:
        return new ForbiddenError(error.message, errorDetails);
      case 404:
        return new NotFoundError(error.message, errorDetails);
      case 405:
        return new MethodNotAllowedError(error.message, errorDetails);
      case 406:
        return new NotAcceptableError(error.message, errorDetails);
      case 408:
        return new RequestTimeoutError(error.message, errorDetails);
      case 409:
        return new ConflictError(error.message, errorDetails);
      case 410:
        return new GoneError(error.message, errorDetails);
      case 500:
        return new InternalServerError(error.message, errorDetails);
      case 501:
        return new NotImplemented(error.message, errorDetails);
      case 502:
        return new BadGatewayError(error.message, errorDetails);
      case 503:
        return new ServiceUnavailableError(error.message, errorDetails);
      case 504:
        return new GatewayTimeout(error.message, errorDetails);
      case 505:
        return new HTTPVersionNotSupported(error.message, errorDetails);
      case 506:
        return new VariantAlsoNegotiates(error.message, errorDetails);
      case 507:
        return new InsufficientStorage(error.message, errorDetails);
      case 508:
        return new LoopDetected(error.message, errorDetails);
      case 510:
        return new NotExtended(error.message, errorDetails);
      case 511:
        return new NetworkAuthenticationRequired(error.message, errorDetails);
      default:
        return new InternalServerError(error.message, errorDetails);
    }
  }
}
