import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ValidationError,
} from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { ArgumentValidationError, UnauthorizedError } from 'type-graphql';
import { Logger } from '../logger';

export const errorHandler = (error: GraphQLError) => {
  const { originalError } = error;

  // If the error is the clients fault, return it
  if (
    originalError instanceof AuthenticationError ||
    originalError instanceof UserInputError ||
    originalError instanceof ForbiddenError ||
    originalError instanceof UnauthorizedError ||
    error instanceof ValidationError
  ) {
    return error;
  }

  // Class-validator-Errors are transformed to UserInput-Errors
  if (originalError instanceof ArgumentValidationError) {
    return new UserInputError('Validation Error', originalError);
  }

  Logger.error(
    error.message,
    process.env.NODE_ENV === 'production' ? error.originalError : error,
  );
  return process.env.NODE_ENV === 'production'
    ? new GraphQLError('Internal Server Error')
    : error;
};
