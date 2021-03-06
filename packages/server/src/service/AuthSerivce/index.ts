import { AuthenticationError } from 'apollo-server-core';
import { Express, Response } from 'express';
import { authenticate, initialize, use } from 'passport';
import { CookieService } from '../CookieService';

import { Inject, Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRepository } from '../../repository/UserRepository';
import { verifyPassword } from '../../util/hashing';
import { AccessTokenService, IPayload } from './../AccessTokenService';
import { RefreshTokenService } from './../RefreshTokenService';
import { cookieJwtStrategy } from './cookieJwtStrategy';

const LOGIN_ERROR_MESSAGE = 'Invalid email or password!';

@Service()
export class AuthService {
  @Inject()
  private readonly cookieService: CookieService;

  @InjectRepository()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly accessTokenService: AccessTokenService;
  @Inject()
  private readonly refreshTokenService: RefreshTokenService;

  async refreshSession(refreshToken: string, res: Response) {
    const userId = await this.refreshTokenService.getUserIdForRequestToken(
      refreshToken,
    );

    const user = await this.userRepository.findOneOrFail(userId);

    const accessToken = await this.accessTokenService.createAccessToken(user);
    const newRefreshToken = await this.refreshTokenService.createRefreshToken(
      user,
    );
    this.cookieService.setCookie(accessToken, newRefreshToken, res);

    await this.refreshTokenService.deleteRefreshToken(refreshToken);
    return { user, newRefreshToken, accessToken };
  }

  async login(email: string, password: string, res: Response) {
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

    this.cookieService.setCookie(accessToken, refreshToken, res);
    return { user, refreshToken, accessToken };
  }

  async logout(res: Response) {
    this.cookieService.unsetCookie(res);
  }

  setupPassport(app: Express) {
    use(cookieJwtStrategy());
    initialize();

    app.use('/graphql', (req, res, next) => {
      authenticate('jwt', { session: false }, async (_, payload: IPayload) => {
        if (payload) {
          req.user = payload;
        } else {
          const refreshToken = req.cookies.refreshToken;
          if (refreshToken) {
            const { user } = await this.refreshSession(refreshToken, res);
            req.user = user;
          }
        }
        return next();
      })(req, res, next);
    });
  }
}
