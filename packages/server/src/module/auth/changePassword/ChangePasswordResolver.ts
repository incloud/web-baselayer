import { AuthenticationError } from 'apollo-server-core';
import { plainToClass } from 'class-transformer';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../../repository/UserRepository';
import { AccessTokenService } from '../../../service/AccessTokenService';
import { RefreshTokenService } from '../../../service/RefreshTokenService';
import { IContext } from '../../../util/context';
import { hashPassword, verifyPassword } from '../../../util/hashing';
import { Role } from '../../../util/roles';
import { AuthResponse } from '../shared/AuthResponse';
import { CookieService } from './../../../service/CookieService';
import { ChangePasswordInput } from './ChangePasswordInput';

@Resolver()
export class ChangePasswordResolver {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly refreshTokenService: RefreshTokenService;

  @Inject()
  private readonly accessTokenService: AccessTokenService;

  @Inject()
  private readonly cookieService: CookieService;

  @Authorized<Role>(Role.USER)
  @Mutation(() => AuthResponse)
  async changePassword(
    @Ctx() ctx: IContext,
    @Arg('input') changePasswordInput: ChangePasswordInput,
  ): Promise<AuthResponse> {
    const { oldPassword, newPassword } = changePasswordInput;

    let user = await this.userRepository.findOneOrFail(ctx.getUserIdOrFail());

    // Check if the password is correct
    const isPasswordCorrect = await verifyPassword(oldPassword, user.password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError('Passwords do not match!');
    }

    user!.password = await hashPassword(newPassword);

    // Delete all active refresh token of the user
    await this.refreshTokenService.deleteAllRefreshTokenOfUser(user.id);

    // Create a new auth response
    user = await user.save();
    const accessToken = await this.accessTokenService.createAccessToken(user);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user,
    );
    this.cookieService.setCookie(accessToken, refreshToken, ctx.res);

    return plainToClass(AuthResponse, {
      accessToken,
      refreshToken,
      user,
    });
  }
}
