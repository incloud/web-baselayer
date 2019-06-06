import { Response } from 'express';
import { Service } from 'typedi';

@Service()
export class CookieService {
  setCookie(accessToken: string, refreshToken: string, res: Response) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_TIME!, 10) * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY_TIME!, 10) * 1000,
    });
  }
}
