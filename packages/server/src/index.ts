import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-express';
import express = require('express');
import { GraphQLError } from 'graphql';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { authChecker } from './util/authChecker';
import { createContext } from './util/context';
import { createDatabaseConnection } from './util/createDatabaseConnection';
import { getFlag } from './util/environment';
import { errorHandler } from './util/errorHandler';
import { setupPassport } from './util/setupPassport';

useContainer(Container);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  level: 'warn',
  patchGlobal: true,
  tags: { source: 'server' },
});

const startServer = async () => {
  await createDatabaseConnection();

  const app = express();
  const server = new ApolloServer({
    context: createContext,
    formatError: (err: GraphQLError) => errorHandler(err, Sentry),
    introspection: getFlag(true, false, 'ENABLE_INTROSPECTION'),
    playground: getFlag(true, false, 'ENABLE_PLAYGROUND'),
    schema: await buildSchema({
      authChecker,
      container: Container,
      resolvers: [`${__dirname}/module/**/*Resolver.@(ts|js)`],
    }),
  });

  app.set('trust proxy', 1);
  setupPassport(app);
  server.applyMiddleware({ app, cors: false });

  app.listen({ port: 4000 }, () =>
    // tslint:disable-next-line:no-console
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
    ),
  );

  // Catch global Errors
  app.use((error: any, _: any, res: any, next: any) => {
    if (error && process.env.NODE_ENV === 'production') {
      Sentry.captureException(error);
      return res.status(500).send(new Error('Internal Server Error'));
    }
    next(error);
  });
};

startServer();
