import { Service } from 'typedi';
import { EntityRepository, FindConditions, Repository } from 'typeorm';
import { User } from '../entity/User';
import { RegisterInput } from '../module/auth/register/RegisterInput';
import { hashPassword } from '../util/hashing';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string) {
    const conditions: FindConditions<User> = {
      email: email.toLowerCase(),
    };
    return this.findOne(conditions);
  }

  async createFromRegister({ password, ...rest }: RegisterInput) {
    const user = this.create({
      ...rest,
    });
    user.password = await hashPassword(password);
    return user.save();
  }
}
