import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

import { gql } from 'apollo-server-core';
import 'jest';
import { Helper } from '../helper';
import { extractTokenData, meQuery } from '../util';

describe('register', () => {
  const helper = new Helper();

  const registerMutation = gql`
    mutation M {
      register(
        input: {
          email: "test@incloud.de"
          password: "Test123!"
          firstName: "Mr"
          lastName: "Test"
          birthYear: 1996
          gender: Male
          phoneNumber: "+496055899261"
          acceptedTermsAndConditions: true
        }
      ) {
        accessToken
        refreshToken
      }
    }
  `;

  beforeAll(async () => {
    await helper.init();
    jest.setTimeout(15000);
  });

  beforeEach(async () => {
    await helper.resetDatabase();
    helper.setContext(await helper.getAuthorizedContext());
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('should register successfully', async () => {
    const result = await helper.mutate(registerMutation);

    expect(result.data).toBeDefined();
    expect(result.data!.register).toBeDefined();
    expect(result.data!.register!.accessToken).toBeDefined();
    expect(result.data!.register!.refreshToken).toBeDefined();
  });

  it('should throw an error if already registered', async () => {
    const result = await helper.mutate(registerMutation);
    const result2 = await helper.mutate(registerMutation);

    expect(result.data).toBeDefined();
    expect(result.data!.register).toBeDefined();
    expect(result.data!.register!.accessToken).toBeDefined();
    expect(result.data!.register!.refreshToken).toBeDefined();

    expect(result2.errors).toBeDefined();
    expect(result2.errors![0].message).toContain('Already registered!');
  });

  it('should throw error if not authorized', async () => {
    helper.setContext({ req: {} });
    const result = await helper.query(meQuery);

    expect(result).toBeDefined();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('Access');
  });

  it('should throw no error if authorized', async () => {
    const registerResult = await helper.mutate(registerMutation);
    const payload = extractTokenData(registerResult.data!.register);

    helper.setContext({
      req: {
        user: {
          userId: payload.userId,
        },
      },
    });

    const result = await helper.query(meQuery);
    expect(result.data).toBeDefined();
    expect(result.data!.me).toBeDefined();
    expect(result.data!.me.email).toEqual('test@incloud.de');
  });
});
