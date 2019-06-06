import gql from 'graphql-tag';

export const RefreshTokenMutation = gql`
  mutation refreshTokenMutation($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;
