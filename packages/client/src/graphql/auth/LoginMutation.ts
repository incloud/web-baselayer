import gql from 'graphql-tag';

export const LoginMutation = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;
