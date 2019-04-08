import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
import { gql } from 'apollo-server-core';
import 'jest';
import { Helper } from '../helper';
import { loginMutation } from '../util';

describe('changePassword', () => {
  const helper = new Helper();

  const changePasswordMutation = gql`
    mutation M($oldPassword: String!, $newPassword: String!) {
      changePassword(
        input: { oldPassword: $oldPassword, newPassword: $newPassword }
      ) {
        accessToken
      }
    }
  `;

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('changePassword should throw error if passwords do not match', async () => {
    const result = await helper.mutate(changePasswordMutation, {
      newPassword: 'Test123!',
      oldPassword: 'FalsePassword',
    });

    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('Passwords do not match!');
  });

  it('changePassword should throw error if new password is not good enough', async () => {
    const result = await helper.mutate(changePasswordMutation, {
      newPassword: 'Test',
      oldPassword: 'password',
    });

    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('Validation Error');
    expect(
      (result.errors![0] as any).extensions.exception.validationErrors[0]
        .property,
    ).toEqual('newPassword');
  });

  it('changePassword should set new password if passwords match', async () => {
    await helper.mutate(changePasswordMutation, {
      newPassword: 'Test123!',
      oldPassword: 'password',
    });

    const loginResult = await helper.mutate(loginMutation, {
      email: 'dev@incloud.de',
      password: 'Test123!',
    });
    expect(loginResult.data).toBeDefined();
    expect(loginResult.data!.login).toBeDefined();
    expect(loginResult.data!.login!.accessToken).toBeDefined();
    expect(loginResult.data!.login!.refreshToken).toBeDefined();
  });
});
