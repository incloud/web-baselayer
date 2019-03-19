# Readme

The purpose of this boilerplate is to show how a simple production-ready backend can be build using Node.js with TypeScript at Incloud. Therefore an HTTP interface for the query language GraphQL is provided which can be easily extended by adding project specific resolvers to it. It also contains a basic configuration for docker (with nginx in production), gitlab-ci and k8s examples. Basic user authentication with [JWT](https://jwt.io) is also implemented.

You can add other Node.js services to this project using the package structure provided by [Lerna](https://lernajs.io/). This tool is used as a package manager, so that functionality can be shared between the backend, a potential frontend and other services. Therefore only one package.json is necessary.

The default database is PostgreSQL, but thanks to [TypeORM](http://typeorm.io/) almost any database system can be easily connected. Services to create and load fixtures are integrated within this boilerplate.

Testing is implemented using [Jest](https://jestjs.io/). This boilerplate already uses some basic test cases which are integrated alongside with some powerful helpers for testing GraphQL APIs and some more examples for the existing code.

## Used Libraries

- [apollo-graphql](https://github.com/apollographql/apollo-server) Base for the GraphQL API.
- [TypeORM](http://typeorm.io/) ORM for the Database.
- [type-graphql](https://19majkel94.github.io/type-graphql/) Easy and leightweight definition of GraphQL resolvers and types.
- [type-di](https://github.com/typestack/typedi) Dependency injection of services.
- [typeorm-fixtures](https://github.com/RobinCK/typeorm-fixtures) Easy generation of fixtures.
- [Jest](https://jestjs.io/) Main testing framework - See testing section.
- [Lerna](https://lernajs.io/) Management of multiple Node.js services within one project.

## Project Structure

- `packages/` contains the different services

  - `common/` contains functions that can be shared between packages
  - `server/` contains the GraphQL API and backend logic

    - `src/`

      - `entity` TypeORM entities
      - `enum` TS enums
      - `error` Custom errors
      - `fixture` TypeORM fixtures
      - `loader` [DataLoaders](https://github.com/facebook/dataloader) for Batching and Caching DB-Requests
      - `module` GraphQL logic like resolvers, input-types etc. (Resolvers in this folder are automatically added to the generale schema)
      - `repository` custom TypeORM repositories
      - `scalar` Custom scalars for GraphQL
      - `service` Services for dependency injection
      - `util` Helper functions

    - `test/`
      - `functional` Jest test files.
      - `helper.ts` A test helper that inits the DB etc. for tests and provides methods for accessing the GraphQL API of the server.
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
   psql --user boilerplate
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
