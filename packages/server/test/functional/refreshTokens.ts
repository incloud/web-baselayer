import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

import { gql } from 'apollo-server-core';
import 'jest';
import { Helper } from '../helper';
import { extractTokenData, loginMutation } from '../util';

describe('refreshTokens', () => {
  const helper = new Helper();

  const refreshTokensMutation = gql`
    mutation M($token: String!) {
      refreshTokens(refreshToken: $token) {
        accessToken
        refreshToken
      }
    }
  `;

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('refreshTokens should throw error if refresh token was not found', async () => {
    const result = await helper.mutate(refreshTokensMutation, {
      token: 'RandomToken',
    });
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('Refresh token not found!');
  });

  it('should generate a new accessToken', async () => {
    const loginResult = await helper.mutate(loginMutation, {
      email: 'dev@incloud.de',
      password: 'password',
    });

    const { userId } = extractTokenData(loginResult.data!.login);

    const result = await helper.mutate(refreshTokensMutation, {
      token: loginResult.data!.login.refreshToken,
    });

    expect(result.data).toBeDefined();
    expect(result.data!.refreshTokens!.accessToken).toBeDefined();
    expect(result.data!.refreshTokens!.refreshToken).toBeDefined();

    const { userId: newUserId } = extractTokenData(result.data!.refreshTokens);

    expect(userId).toEqual(newUserId);
  });
});
