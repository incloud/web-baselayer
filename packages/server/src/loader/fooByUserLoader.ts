/**
 * An example how to integrate a custom data loader which works as a join layer inside the database
 *
 * import DataLoader = require('dataloader');
 * import { getRepository } from 'typeorm';
 * import { User } from '../entity/User';
 * import { mapData } from './util';
 *
 * export function fooByUserLoader() {
 *   return new DataLoader(async (ids: string[]) => {
 *     const usersWithFoo = await getRepository(User)
 *       .createQueryBuilder('user')
 *       .leftJoinAndSelect('user.foo', 'foo')
 *       .where('user.id IN (:...ids)', { ids })
 *       .getMany();
 *
 *    return mapData(
 *      ids,
 *      usersWithFoo,
 *      user => user.id,
 *      user => user.foo!,
 *      () => null,
 *    );
 * }
 */
