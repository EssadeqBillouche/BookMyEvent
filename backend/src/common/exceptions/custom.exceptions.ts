import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode,
        message,
        error: 'BusinessError',
      },
      statusCode,
    );
  }
}

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, identifier?: string | number) {
    const message = identifier
      ? `${entity} with identifier '${identifier}' not found`
      : `${entity} not found`;

    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message,
        error: 'NotFound',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class DuplicateEntityException extends HttpException {
  constructor(entity: string, field: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `${entity} with this ${field} already exists`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ForbiddenResourceException extends HttpException {
  constructor(message = 'You do not have permission to access this resource') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
