import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

import { gql } from 'apollo-server-core';
import 'jest';
import { Helper } from '../helper';
import { extractTokenData, loginMutation } from '../util';
import console = require('console');

describe('login', () => {
  const helper = new Helper();

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('login should throw error if user not existing', async () => {
    const result = await helper.mutate(loginMutation, {
      email: 'NotExisting@incloud.de',
      password: 'Test123!',
    });

    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('Invalid email or password!');
  });

  it('login should throw error if password is false', async () => {
    const result = await helper.mutate(loginMutation, {
      email: 'dev@incloud.de',
      password: 'Test123!',
    });
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('Invalid email or password!');
  });

  it('login should return valid tokens if credentials are right', async () => {
    const loginResult = await helper.mutate(loginMutation, {
      email: 'dev@incloud.de',
      password: 'password',
    });
    expect(loginResult.data).toBeDefined();
    expect(loginResult.data!.login).toBeDefined();
    expect(loginResult.data!.login!.accessToken).toBeDefined();
    expect(loginResult.data!.login!.refreshToken).toBeDefined();

    const meQuery = gql`
      query {
        me {
          id
          email
        }
      }
    `;
    const payload = extractTokenData(loginResult.data!.login);

    helper.setContext({
      req: {
        user: {
          userId: payload.userId,
        },
      },
    });

    const queryResult = await helper.query(meQuery);

    expect(queryResult.data).toBeDefined();
    expect(queryResult.data!.me).toBeDefined();
    expect(queryResult.data!.me.email).toEqual('dev@incloud.de');
  });
});
