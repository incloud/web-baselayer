import * as Sentry from '@sentry/node';
import { ApolloError } from 'apollo-server-core';
import { GraphQLError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';
// tslint:disable-next-line: no-submodule-imports
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { Logger } from '../logger';
import { isProduction } from './environment';

export function errorHandler(error: GraphQLError) {
  const { originalError } = error;

  // If the error is the clients fault, return it
  if (error instanceof ApolloError || originalError instanceof ApolloError) {
    return error;
  }

  // Class-validator-Errors are transformed to UserInput-Errors
  if (originalError instanceof ArgumentValidationError) {
    if (error.extensions != null) {
      error.extensions.code = 'ARGUMENT_VALIDATION_ERROR';
    }
    return error;
  }

  // TypeORM -> findOneOrFail()
  if (originalError instanceof EntityNotFoundError) {
    if (error.extensions != null) {
      error.extensions.code = 'ENTITY_NOT_FOUND_ERROR';
    }
    return error;
  }

  // If this is prod, capture the error and send a generic error
  if (isProduction()) {
    const eventId = Sentry.captureException(error);
    return new GraphQLError(`Internal Error: ${eventId}`);
  }

  Logger.info(
    `An error occured while processing the request.
    This error would be sent to sentry in production.`,
    error,
  );
  return error;
}
