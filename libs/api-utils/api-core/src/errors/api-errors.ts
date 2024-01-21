import { BaseApiError } from './base-api-error';

export class BadRequestError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(401, message, details);
  }
}

export class ForbiddenError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(403, message, details);
  }
}

export class NotFoundError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(404, message, details);
  }
}

export class MethodNotAllowedError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(405, message, details);
  }
}

export class NotAcceptableError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(406, message, details);
  }
}

export class RequestTimeoutError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(408, message, details);
  }
}

export class ConflictError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(409, message, details);
  }
}

export class GoneError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(410, message, details);
  }
}

export class InternalServerError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(500, message, details);
  }
}

export class NotImplemented extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(501, message, details);
  }
}

export class BadGatewayError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(502, message, details);
  }
}

export class ServiceUnavailableError extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(503, message, details);
  }
}

export class GatewayTimeout extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(504, message, details);
  }
}

export class HTTPVersionNotSupported extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(505, message, details);
  }
}

export class VariantAlsoNegotiates extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(506, message, details);
  }
}

export class InsufficientStorage extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(507, message, details);
  }
}

export class LoopDetected extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(508, message, details);
  }
}

export class NotExtended extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(510, message, details);
  }
}

export class NetworkAuthenticationRequired extends BaseApiError {
  constructor(message: string, details?: unknown) {
    super(511, message, details);
  }
}
