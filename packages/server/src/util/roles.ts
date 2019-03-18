import { Maybe } from './helper';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export function isGranted(currentRole: Maybe<Role>, neededRoles: Role[]) {
  if (neededRoles.length === 0) {
    return true;
  }
  if (currentRole == null) {
    return false;
  }
  return neededRoles.includes(currentRole);
}
