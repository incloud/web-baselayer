import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../entity/User';
import { UserRepository } from '../repository/UserRepository';
import { generateRandomToken } from '../util/generateRandomToken';
import { hashPassword } from '../util/hashing';
import { redis } from '../util/redis';
import { RefreshTokenService } from './RefreshTokenService';

// t2u => token to user
const PREFIX_T2U = 'PW_RESET_T2U_';

// u2t => user to token
const PREFIX_U2T = 'PW_RESET_U2T_';

@Service()
export class PasswordResetService {
  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly refreshTokenService: RefreshTokenService;

  public async requestPasswordReset(user: User): Promise<string> {
    // Generate a random token
    const token = generateRandomToken(255);

    // Check if this user already requested a password reset with a non-expired token
    // If there is a token => delete it
    const existingToken = await redis.get(PREFIX_U2T + user.id);
    if (existingToken != null) {
      await redis.del(PREFIX_T2U + existingToken);
    }

    // Set the token and the reverse lookup via userId
    await redis.set(
      PREFIX_U2T + user.id,
      token,
      'ex',
      parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_TIME!, 10),
    );
    await redis.set(
      PREFIX_T2U + token,
      user.id,
      'ex',
      parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_TIME!, 10),
    );

    return token;
  }

  public async isTokenValid(token: string): Promise<boolean> {
    const userId = await redis.get(PREFIX_T2U + token);
    return userId != null;
  }

  public async resetPassword(
    token: string,
    password: string,
  ): Promise<boolean> {
    const userId = await redis.get(PREFIX_T2U + token);
    if (userId == null) {
      return false;
    }

    const user = await this.userRepository.findOne(userId);
    if (user == null) {
      return false;
    }

    user.password = await hashPassword(password);

    await Promise.all([
      user.save(),
      this.refreshTokenService.deleteAllRefreshTokenOfUser(user.id),
      redis.del(PREFIX_T2U + token),
      redis.del(PREFIX_U2T + user.id),
    ]);

    return true;
  }
}
