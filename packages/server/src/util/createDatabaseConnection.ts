import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import { Logger } from '../logger';

export const createDatabaseConnection = async (
  configOverride: Partial<ConnectionOptions> = {},
) => {
  let retries = 5;
  while (retries) {
    try {
      const config = await getConnectionOptions('default');
      // tslint:disable-next-line: prefer-object-spread
      return createConnection(Object.assign({}, config, configOverride));
    } catch (err) {
      retries -= 1;
      Logger.error(`DB-Connection failed. Retries left: ${retries}.`, err);
      // wait 5 seconds
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  throw new Error('Could not establish a database connection!');
};
