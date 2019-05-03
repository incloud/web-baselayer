import * as fs from 'fs';
import { graphqlSync, introspectionQuery } from 'graphql';
import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';

const schema = buildSchemaSync({
  authChecker: () => true,
  resolvers: [`${__dirname}/module/**/*Resolver.@(ts|js)`],
});

const result = graphqlSync(schema, introspectionQuery).data;

fs.writeFileSync('./schema.json', JSON.stringify(result));

process.exit(0);
