import { AuthChecker } from 'type-graphql';
import { UnauthorizedError } from '../error/UnauthorizedError';
import { IContext } from './context';
import { isGranted, Role } from './roles';

/**
 * @param param
 * @param roles
 */
export const authChecker: AuthChecker<IContext, Role> = (
  { context },
  roles: Role[],
) => {
  if (!context.userId && !context.adminId) {
    throw new UnauthorizedError();
  }

  if (!isGranted(context.role, roles)) {
    throw new UnauthorizedError();
  }

  return true;
};
