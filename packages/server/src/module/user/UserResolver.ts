import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../entity/User';
import { UserRepository } from '../../repository/UserRepository';
import { IContext } from '../../util/context';
import { Role } from '../../util/roles';
import { BaseUserInput } from '../auth/shared/BaseUserInput';

@Resolver(() => User)
export class UserResolver {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Authorized<Role>(Role.USER)
  @Query(() => User, { nullable: false })
  async me(@Ctx() ctx: IContext): Promise<User> {
    return this.userRepository.findOneOrFail(ctx.getUserIdOrFail());
  }

  @Authorized<Role>(Role.USER)
  @Mutation(() => User, { nullable: false })
  async updateMe(
    @Ctx() ctx: IContext,
    @Arg('changes') { email, ...restChanges }: BaseUserInput,
  ) {
    const user = await this.userRepository.findOneOrFail(ctx.getUserIdOrFail());
    if (email != null) {
      user.email = email;
    }
    User.merge(user, restChanges);
    return user.save();
  }

  @Authorized<Role>(Role.ADMIN)
  @Query(() => [User], { nullable: false })
  async users() {
    return this.userRepository.find();
  }
}
