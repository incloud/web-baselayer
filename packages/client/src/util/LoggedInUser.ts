import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export interface ILoggedInUser {
  email: string;
  name: string;
  accessToken: string;
  idToken: string;
  expiresIn: number;
}

export const LOGGED_IN_USER = gql`
  query {
    loggedInUser @client {
      email
      name
      accessToken
      idToken
      expiresIn
    }
  }
`;
