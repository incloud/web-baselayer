import { plainToClass } from 'class-transformer';
import { Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { AuthService } from '../../../service/AuthSerivce';
import { IContext } from '../../../util/context';
import { LogoutResponse } from './LogoutResponse';

@Service()
@Resolver()
export class LogoutResolver {
  @Inject()
  private readonly authService: AuthService;

  @Mutation(() => LogoutResponse, { nullable: false })
  async logout(@Ctx() ctx: IContext): Promise<LogoutResponse> {
    this.authService.logout(ctx.res);

    return plainToClass(LogoutResponse, {
      success: true,
    });
  }
}
