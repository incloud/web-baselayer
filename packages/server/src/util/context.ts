// tslint:disable:object-literal-sort-keys
import { Context } from 'apollo-server-core';
// @ts-ignore
import DataLoader = require('dataloader');
import { Maybe } from './helper';
import { Role } from './roles';

const loaders = () => ({});

export interface IContext {
  userId: Maybe<string>;
  req: any;
  adminId: Maybe<string>;
  role: Maybe<Role>;
  getUserIdOrFail: () => string;
  getAdminIdOrFail: () => string;
  loaders: ReturnType<typeof loaders>;
}

export async function createContext({ req }: any): Promise<Context<IContext>> {
  const { adminId = null, userId = null } = req.user != null ? req.user : {};

  return {
    adminId,
    req,
    role: adminId ? Role.ADMIN : userId ? Role.USER : null,
    userId,
    getUserIdOrFail: () => {
      if (userId == null) throw new Error();
      return userId;
    },
    getAdminIdOrFail: () => {
      if (adminId == null) throw new Error();
      return adminId;
    },
    loaders: loaders(),
  };
}
