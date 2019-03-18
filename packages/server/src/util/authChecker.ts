import { AuthChecker, UnauthorizedError } from 'type-graphql';
import { IContext } from './context';
import { isGranted, Role } from './roles';

/**
 * TODO: Maybe error thrown is send to sentry
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
