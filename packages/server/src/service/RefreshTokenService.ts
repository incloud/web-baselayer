import { UserInputError } from 'apollo-server-core';
import { Service } from 'typedi';
import { User } from '../entity/User';
import { generateRandomToken } from '../util/generateRandomToken';
import { redis } from '../util/redis';

// t2u => token to user
const PREFIX_T2U = 'REFRESH_T2U_';

// u2t => user to token
const PREFIX_U2T = 'REFRESH_U2T_';

@Service()
export class RefreshTokenService {
  async createRefreshToken(user: User): Promise<string> {
    const token = generateRandomToken(255);
    await this.setRefreshToken(token, user.id);
    return token;
  }

  async getUserIdForRequestToken(refreshToken: string) {
    const userId = await this.getRefreshToken(refreshToken);
    if (!userId) {
      throw new UserInputError('Refresh token not found!');
    }
    return userId;
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.delRefreshToken(refreshToken);
  }

  async deleteAllRefreshTokenOfUser(userId: string): Promise<void> {
    const tokenList = await this.getRefreshTokenList(userId);
    if (tokenList.length === 0) {
      return;
    }
    await redis.del(...tokenList.map(tl => PREFIX_T2U + tl));
    await this.setRefreshTokenList(userId, []);
  }

  private async setRefreshToken(refreshToken: string, userId: string) {
    // Set the token in redis as "token -> userId"
    await redis.set(
      PREFIX_T2U + refreshToken,
      userId,
      'ex',
      parseInt(process.env.REFRESH_TOKEN_EXPIRY_TIME!, 10),
    );
    const tokenList = await this.getRefreshTokenList(userId);
    await this.setRefreshTokenList(userId, [...tokenList, refreshToken]);
  }
  private async getRefreshToken(refreshToken: string) {
    return redis.get(PREFIX_T2U + refreshToken);
  }
  private async delRefreshToken(refreshToken: string) {
    const userId = await redis.get(PREFIX_T2U + refreshToken);
    if (userId == null) {
      return;
    }
    await redis.del(PREFIX_T2U + refreshToken);
    const tokenList = await this.getRefreshTokenList(userId);
    await this.setRefreshTokenList(
      userId,
      tokenList.filter((t: string) => t !== refreshToken),
    );
  }
  private async getRefreshTokenList(userId: string): Promise<string[]> {
    const tokenListString = await redis.get(PREFIX_U2T + userId);
    if (tokenListString == null) {
      return [];
    }
    return JSON.parse(tokenListString);
  }
  private async setRefreshTokenList(
    userId: string,
    tokenList: string[],
  ): Promise<void> {
    if (tokenList.length === 0) {
      await redis.del(PREFIX_U2T + userId);
      return;
    }

    const userIds: string[] = await redis.mget(
      ...tokenList.map(tl => PREFIX_T2U + tl),
    );

    await redis.set(
      PREFIX_U2T + userId,
      JSON.stringify(tokenList.filter((_, i) => userIds[i] != null)),
      'ex',
      parseInt(process.env.REFRESH_TOKEN_EXPIRY_TIME!, 10),
    );
  }
}
