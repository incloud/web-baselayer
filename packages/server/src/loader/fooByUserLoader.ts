import DataLoader = require('dataloader');
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export function communityByUserLoader() {
  return new DataLoader(async (ids: string[]) => {
    const usersWithCommunity = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.community', 'community')
      .where('user.id IN (:...ids)', { ids })
      .getMany();

    return usersWithCommunity.map(user => user.community!);
  });
}
