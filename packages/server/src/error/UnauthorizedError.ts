import { ForbiddenError } from 'apollo-server-core';

export class UnauthorizedError extends ForbiddenError {
  constructor() {
    super('You need to be authorized to perform this action!');
  }
}
