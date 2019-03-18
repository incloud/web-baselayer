import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

import { ApolloServer } from 'apollo-server-express';
import express = require('express');
import { buildSchema, useContainer as useContainerGQL } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer as useContainerORM } from 'typeorm';
import { authChecker } from './util/authChecker';
import { createContext } from './util/context';
import { createDatabaseConnection } from './util/createDatabaseConnection';
import { getFlag } from './util/environment';
import { errorHandler } from './util/errorHandler';
import { setupPassport } from './util/setupPassport';

useContainerGQL(Container);
useContainerORM(Container);

const startServer = async () => {
  await createDatabaseConnection();

  const app = express();
  const server = new ApolloServer({
    context: createContext,
    formatError: errorHandler,
    introspection: getFlag(true, false, 'ENABLE_INTROSPECTION'),
    playground: getFlag(true, false, 'ENABLE_PLAYGROUND'),
    schema: await buildSchema({
      authChecker,
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
};

startServer();
