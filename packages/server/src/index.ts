import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
const cookieParser = require('cookie-parser');

import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-express';
import { json, urlencoded } from 'body-parser';
import { ErrorRequestHandler } from 'express';
import express = require('express');
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';
import { AuthService } from './service/AuthSerivce';
import { authChecker } from './util/authChecker';
import { createContext } from './util/context';
import { createDatabaseConnection } from './util/createDatabaseConnection';
import { getFlag, isProduction } from './util/environment';
import { errorHandler } from './util/errorHandler';

useContainer(Container);

if (isProduction()) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    level: 'warn',
    patchGlobal: true,
    tags: { source: 'server' },
  });
}

const startServer = async () => {
  await createDatabaseConnection();

  const app = express();
  app.use(urlencoded({ extended: true }), json());
  app.use(cookieParser());
  if (isProduction()) {
    app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  }
  const server = new ApolloServer({
    context: createContext,
    formatError: errorHandler,
    introspection: getFlag(true, false, 'ENABLE_INTROSPECTION'),
    playground: getFlag(true, false, 'ENABLE_PLAYGROUND'),
    schema: await buildSchema({
      authChecker,
      container: Container,
      resolvers: [`${__dirname}/module/**/*Resolver.@(ts|js)`],
    }),
  });

  app.set('trust proxy', 1);
  const auth = Container.get(AuthService);
  auth.setupPassport(app);
  server.applyMiddleware({ app, cors: false });

  // Catch global Errors
  if (isProduction()) {
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
  }

  const errorRequestHandler: ErrorRequestHandler = (err, _, res, next) => {
    if (err != null) {
      const errorId = (res as any).sentry;
      return res
        .status(500)
        .send(
          `Internal Error: ${
            errorId != null ? errorId : 'error was not tracked'
          }`,
        );
    }
    return next();
  };
  app.use(errorRequestHandler);

  app.listen({ port: 4000 }, () =>
    // tslint:disable-next-line:no-console
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`,
    ),
  );
};

startServer();
