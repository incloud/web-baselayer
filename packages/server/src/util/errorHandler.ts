import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ValidationError,
} from 'apollo-server-core';
import { GraphQLError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';
// tslint:disable-next-line: no-submodule-imports
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

export const errorHandler = (error: GraphQLError, Sentry: any) => {
  const { originalError } = error;

  // If the error is the clients fault, return it
  if (
    originalError instanceof AuthenticationError ||
    originalError instanceof UserInputError ||
    originalError instanceof ForbiddenError ||
    error instanceof ValidationError
  ) {
    return error;
  }

  // Class-validator-Errors are transformed to UserInput-Errors
  if (originalError instanceof ArgumentValidationError) {
    return new UserInputError('Validation Error', originalError);
  }

  // TypeORM -> findOneOrFail()
  if (originalError instanceof EntityNotFoundError) {
    return new UserInputError(originalError.message, {
      error: { message: originalError.message, code: 'ENTITY_NOT_FOUND' },
    });
  }

  Sentry.captureException(error);

  return process.env.NODE_ENV === 'production'
    ? new GraphQLError('Internal Server Error')
    : error;
};
