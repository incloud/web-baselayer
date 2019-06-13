import { AuthenticationError } from 'apollo-server-core';
import { plainToClass } from 'class-transformer';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../../repository/UserRepository';
import { AccessTokenService } from '../../../service/AccessTokenService';
import { RefreshTokenService } from '../../../service/RefreshTokenService';
import { AuthResponse } from '../shared/AuthResponse';
import { CookieService } from './../../../service/CookieService';
import { IContext } from './../../../util/context';
import { RegisterInput } from './RegisterInput';

@Service()
@Resolver()
export class RegisterResolver {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly accessTokenService: AccessTokenService;
  @Inject()
  private readonly refreshTokenService: RefreshTokenService;
  @Inject()
  private readonly cookieService: CookieService;

  @Mutation(() => AuthResponse, { nullable: false })
  async register(
    @Ctx() ctx: IContext,
    @Arg('input') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    const alreadyRegisteredEmailUser = await this.userRepository.findByEmail(
      registerInput.email,
    );

    // Check if the user is already registered with this email
    if (alreadyRegisteredEmailUser != null) {
      throw new AuthenticationError('Already registered!');
    }

    const user = await this.userRepository.createFromRegister(registerInput);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user,
    );
    const accessToken = await this.accessTokenService.createAccessToken(user);
    this.cookieService.setCookie(accessToken, refreshToken, ctx.res);

    return plainToClass(AuthResponse, {
      accessToken,
      refreshToken,
      user,
    });
  }
}
