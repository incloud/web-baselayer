import { plainToClass } from 'class-transformer';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { AuthResponse } from '../shared/AuthResponse';
import { AuthService } from '../../../service/AuthSerivce';
import { IContext } from './../../../util/context';
import { LoginInput } from './LoginInput';

@Service()
@Resolver()
export class LoginResolver {
  @Inject()
  private readonly authService: AuthService;

  @Mutation(() => AuthResponse, { nullable: false })
  async login(
    @Arg('input') { email, password }: LoginInput,
    @Ctx() ctx: IContext,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken, user } = await this.authService.login(
      email,
      password,
      ctx.res,
    );

    return plainToClass(AuthResponse, {
      accessToken,
      refreshToken,
      user,
    });
  }

  @Mutation(() => AuthResponse, { nullable: false })
  async refreshTokens(
    @Ctx() ctx: IContext,
    @Arg('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    const {
      accessToken,
      user,
      newRefreshToken,
    } = await this.authService.refreshSession(refreshToken, ctx.res);

    return plainToClass(AuthResponse, {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  }
}
