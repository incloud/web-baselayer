import { AuthService } from './../src/service/AuthSerivce/index';
const cookieParser = require('cookie-parser');
import { authChecker } from '@baselayer/server/src/util/authChecker';
import { createDatabaseConnection } from '@baselayer/server/src/util/createDatabaseConnection';
import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import deepmerge = require('deepmerge');
import { Express } from 'express';
import express = require('express');
import { DocumentNode, ExecutionResult } from 'graphql';
import 'jest';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { Connection, getRepository, useContainer } from 'typeorm';
import { User } from '../src/entity/User';
import { createContext } from '../src/util/context';
import { errorHandler } from '../src/util/errorHandler';
import { loadFixtures } from '../src/util/loadFixtures';

Sentry.init({
  level: 'warn',
  patchGlobal: true,
  tags: { source: 'server' },
});

interface IInitHooks {
  updateContainer?: (container: typeof Container) => void | Promise<void>;
}

export class Helper {
  public server: ApolloServer;
  public client: any;
  private context: any;
  private dbConnection: Connection;
  private app: Express | null;

  public async init({ updateContainer }: IInitHooks = {}): Promise<void> {
    jest.setTimeout(10000);
    useContainer(Container);
    if (updateContainer != null) {
      await updateContainer(Container);
    }

    this.dbConnection = await createDatabaseConnection({
      database: process.env.TEST_DB_NAME,
    });
    await this.resetDatabase();

    this.context = await this.getAuthorizedContext();
    this.app = express();
    this.server = new ApolloServer({
      context: this.createContext,
      formatError: errorHandler,
      schema: buildSchemaSync({
        authChecker,
        container: Container,
        resolvers: [`${__dirname}/../src/module/**/*Resolver.@(ts|js)`],
      }),
    });

    this.app.use(cookieParser());
    this.app.set('trust proxy', 1);

    const auth = Container.get(AuthService);
    auth.setupPassport(this.app);
    this.server.applyMiddleware({ app: this.app, cors: false });

    this.client = createTestClient(this.server);
  }

  public async query(
    query: string | DocumentNode,
    variables?: any,
  ): Promise<ExecutionResult> {
    return this.client.query({ query, variables });
  }

  public async mutate(
    mutation: string | DocumentNode,
    variables?: any,
  ): Promise<ExecutionResult> {
    return this.client.mutate({ mutation, variables });
  }

  public async shutdown() {
    return this.dbConnection.close();
  }

  public async resetDatabase() {
    await this.dbConnection.synchronize(true);
    await loadFixtures(this.dbConnection);
  }

  public async getAuthorizedContext() {
    const user = await getRepository(User).findOneOrFail({
      email: 'dev@incloud.de',
    });

    return {
      req: {
        user: {
          userId: user.id,
        },
      },
    };
  }

  public async setContext(context: any) {
    this.context = context;
  }

  private createContext = async () => {
    const context = deepmerge(this.context, {
      req: {
        app: this.app,
      },
      res: {
        // tslint:disable-next-line:variable-name
        cookie: jest.fn(),
      },
    });
    return createContext(context);
  };
}
