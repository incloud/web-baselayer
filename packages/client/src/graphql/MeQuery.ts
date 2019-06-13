import gql from 'graphql-tag';

export const MeQuery = gql`
  query me {
    me {
      id
      firstName
    }
  }
`;
