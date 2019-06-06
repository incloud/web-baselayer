import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { createHttpLink } from 'apollo-link-http';

// defaults override objects stored by the cache persister => so there are no defaults
const defaults = {};

const typeDefs = `
  type LoggedInUser {
    email: String!
    name: String!
    accessToken: String!
    idToken: String!
    expiresIn: Int!
  }
`;

export type BaselayerClient = ApolloClient<any>;
export const createApolloClient = async (): Promise<BaselayerClient> => {
  const cache = new InMemoryCache({
    dataIdFromObject: object => object.id || null,
  });

  await persistCache({
    cache,
    // Remove once this is merged: https://github.com/apollographql/apollo-cache-persist/pull/58
    storage: window.localStorage as any,
  });

  const link = createHttpLink({
    credentials: 'same-origin',
    uri: '/graphql',
  });

  const client = new ApolloClient({
    cache,
    link,
  });

  return client;
};
