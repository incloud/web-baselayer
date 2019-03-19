# Readme

This Boilerplate consists of a setup for a NodeJS-Graphql-Server written in Typescript. It contains a basic configuration for docker (with nginx), gitlab-ci and k8s. Basic User-Authentication through [JWT](https://jwt.io)-Tokens is already implemented.

With [Jest](https://jestjs.io/), the Boilerplate has already a Test-Framework integrated alongside with powerful helpers for GraphQL-Testing and examples for the existing code.

The default Database is PostgreSQL, but thanks to [TypeORM](http://typeorm.io/) almost any DB-System can be easily connected.

[Lerna](https://lernajs.io/) is used as Package-Manager, so that functionality can be shared between the Backend and a potential Frontend.

## Used Libraries

- [apollo-graphql](https://github.com/apollographql/apollo-server) as a base for graphql
- [TypeORM](http://typeorm.io/) as ORM for the Database
- [type-graphql](https://19majkel94.github.io/type-graphql/) for easy and leightweight Definition of Graphql-Resolvers and Types.
- [type-di](https://github.com/typestack/typedi) for Dependency Injection of Services
- [typeorm-fixtures](https://github.com/RobinCK/typeorm-fixtures) for easy generation of fixtures
- [Jest](https://jestjs.io/) for testing.
- [Lerna](https://lernajs.io/) for Package-Management

## Project Structure

- `packages/` contains the different packages

  - `common/` contains functions that can be shared between packages
  - `server/` contains the GraphQL-Server and backend logic

    - `src/`

      - `entity` TypeORM entities
      - `enum` TS enums
      - `error` Custom errors
      - `fixture` TypeORM fixtures
      - `loader` [DataLoaders](https://github.com/facebook/dataloader) for Batching and Caching DB-Requests
      - `module` GraphQL-Logic like resolvers, input-types etc. (Resolvers in this folder are automatically added to the Schema)
      - `repository` custom TypeORM-Repositories
      - `service` Services for dependency injection
      - `util` Helper functions

    - `test/`
      - `functional` Jest Test-Files.
      - `helper.ts` A Test-Helper that inits the DB etc. for tests and offers methods for accessing the Graphql-API of the server.
      - `util.ts` Contains methods often used by tests

## Setup

You need to have `docker` and `docker-compose` installed on your computer.

- Clone the repository and `cd` into it
- Create a `.env`-file in `packages/server` and set values or simply copy the example-file
  ```
  cp packages/server/.env.example packages/server/.env
  ```
- Install npm-dependencies using `yarn` inside of the running `server`-service:
  ```
  docker-compose run --rm server bash
  yarn install
  yarn bootstrap
  ```
- Prepare the database:
  ```
  docker-compose run --rm server bash
  cd packages/server
  yarn typeorm schema:sync
  ```
- Start everything with `docker-compose`
  ```
  docker-compose up
  ```
- Visit `localhost:4000/graphql` to access the GraphQL-Playground

## Testing

- To be able to run a test against a custom 'test'-database follow these steps:

  - Create the Database as following:

  ```
   docker-compose exec db sh
   psql --user toolsharing
   CREATE DATABASE <DB_NAME>;
  ```

  - Set `TEST_DB_NAME` to the newly created Database in your local .env-file.

- The Helper class offers two basic methods to access the graphQL-Schema:
  - `query(query, variables)`
  - `mutate(query, variables)`
- With `resetDatabase()` the Database is cleared and the fixtures are loaded.
  - Be aware, that this method is already invoked by the Helper´s `init()`-Method.

## Frequently Used Commands

- To sync the database on entity-changes
  - `yarn typeorm schema:sync`
- To drop the database completely
  - `yarn typeorm schema:drop`
- To load the fixtures
  - `yarn fixtures`
