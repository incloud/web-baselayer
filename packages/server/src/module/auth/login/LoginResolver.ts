import { AuthenticationError } from 'apollo-server-core';
import { plainToClass } from 'class-transformer';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../../repository/UserRepository';
import { AccessTokenService } from '../../../service/AccessTokenService';
import { RefreshTokenService } from '../../../service/RefreshTokenService';
import { verifyPassword } from '../../../util/hashing';
import { AuthResponse } from '../shared/AuthResponse';
import { TokenResponse } from '../shared/TokenResponse';
import { LoginInput } from './LoginInput';

const LOGIN_ERROR_MESSAGE = 'Invalid email or password!';

@Service()
@Resolver()
export class LoginResolver {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly accessTokenService: AccessTokenService;
  @Inject()
  private readonly refreshTokenService: RefreshTokenService;

  @Mutation(() => AuthResponse, { nullable: false })
  async login(@Arg('input') { email, password }: LoginInput): Promise<
    AuthResponse
  > {
    const user = await this.userRepository.findByEmail(email);

    // Check if a user for this email exists
    if (user == null) {
      throw new AuthenticationError(LOGIN_ERROR_MESSAGE);
    }

    // Check if the password is correct
    const isPasswordCorrect = await verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new AuthenticationError(LOGIN_ERROR_MESSAGE);
    }

    const accessToken = await this.accessTokenService.createAccessToken(user);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      user,
    );

    return plainToClass(AuthResponse, {
      accessToken,
      refreshToken,
      user,
    });
  }

  @Mutation(() => TokenResponse, { nullable: false })
  async refreshTokens(
    @Arg('refreshToken') refreshToken: string,
  ): Promise<TokenResponse> {
    const userId = await this.refreshTokenService.getUserIdForRequestToken(
      refreshToken,
    );

    const user = await this.userRepository.findOneOrFail(userId);
    const accessToken = await this.accessTokenService.createAccessToken(user);
    const newRefreshToken = await this.refreshTokenService.createRefreshToken(
      user,
    );
    await this.refreshTokenService.deleteRefreshToken(refreshToken);

    return plainToClass(AuthResponse, {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  }
}
