import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
import { gql } from 'apollo-server-core';
import 'jest';
import { Helper } from '../helper';
import { meQuery } from '../util';

describe('user', () => {
  const helper = new Helper();

  const updateMeMutation = gql`
    mutation M($changes: BaseUserInput!) {
      updateMe(changes: $changes) {
        email
        firstName
        lastName
        phoneNumber
        birthYear
        gender
      }
    }
  `;

  beforeAll(async () => {
    await helper.init();
  });

  afterAll(async () => {
    await helper.shutdown();
  });

  it('me should return the current user with permits', async () => {
    const meResult = await helper.query(meQuery);

    expect(meResult.data).toBeDefined();
    expect(meResult.data!.me).toBeDefined();
    const { email } = meResult.data!.me;

    expect(email).toEqual('dev@incloud.de');
  });

  it('should successfully change fields that are allowed to be changed', async () => {
    const result = await helper.mutate(updateMeMutation, {
      changes: {
        birthYear: 1997,
        email: 'Test2@incloud.de',
        firstName: 'Tester',
        gender: 'Female',
        lastName: 'Testo',
        phoneNumber: '+496055899262',
      },
    });

    expect(result.data).toBeDefined();
    expect(result.data!.updateMe).toBeDefined();
    expect(result.data!.updateMe.email).toEqual('test2@incloud.de');
    expect(result.data!.updateMe.firstName).toEqual('Tester');
    expect(result.data!.updateMe.lastName).toEqual('Testo');
    expect(result.data!.updateMe.phoneNumber).toEqual('+496055899262');
    expect(result.data!.updateMe.birthYear).toEqual(1997);
    expect(result.data!.updateMe.gender).toEqual('Female');
  });

  it('should throw error if password should be changed', async () => {
    const result = await helper.mutate(updateMeMutation, {
      changes: {
        birthYear: 1997,
        email: 'Test2@incloud.de',
        firstName: 'Tester',
        gender: 'Female',
        lastName: 'Testo',
        password: 'NewPassword',
        phoneNumber: '+496055899262',
      },
    });
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain(
      'Field "password" is not defined by type BaseUserInput',
    );
  });
});
