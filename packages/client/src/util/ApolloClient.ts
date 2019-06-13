import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

export type BaselayerClient = ApolloClient<any>;
export const createApolloClient = async (): Promise<BaselayerClient> => {
  const cache = new InMemoryCache({
    dataIdFromObject: object => object.id || null,
  });

  const link = createHttpLink({
    credentials: 'same-origin',
    uri: '/graphql',
  });

  const client = new ApolloClient({
    cache,
    link,
    resolvers: {},
  });

  return client;
};
