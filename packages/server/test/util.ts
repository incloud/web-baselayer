import { gql } from 'apollo-server-core';
import 'jest';
import { TokenResponse } from '../src/module/auth/shared/TokenResponse';
import { fromBase64 } from '../src/util/base64';

export const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
    }
  }
`;

export const meQuery = gql`
  query {
    me {
      id
      email
    }
  }
`;

export const extractTokenData = (authResult: TokenResponse) => {
  const tokenPayload = authResult.accessToken.split('.')[1];
  return JSON.parse(fromBase64(tokenPayload));
};
