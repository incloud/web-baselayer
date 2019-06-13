import * as path from 'path';
import { Connection, getRepository } from 'typeorm';
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli';

export const loadFixtures = async (
  connection: Connection,
  paths: string[] = ['./src/fixture'],
) => {
  try {
    const loader = new Loader();
    paths.forEach((fixturePath: string) => {
      loader.load(path.resolve(fixturePath));
    });
    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);

      try {
        await getRepository(entity.constructor.name).save(entity);
      } catch (e) {
        throw e;
      }
    }
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(`Fail fixture loading: ${error.message}`);
    console.log(error); // tslint:disable-line
    process.exit(1);
  }
};
