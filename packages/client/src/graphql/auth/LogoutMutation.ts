import gql from 'graphql-tag';

export const LogoutMutation = gql`
  mutation logout {
    logout {
      success
    }
  }
`;
