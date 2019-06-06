import {
  ExtractJwt,
  JwtFromRequestFunction,
  Strategy as JwtStrategy,
} from 'passport-jwt';
import { fromBase64 } from '../../util/base64';

export const cookieJwtStrategy = () => {
  const jwtFromRequest: JwtFromRequestFunction = req => {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
    const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (bearer) {
      return bearer;
    }
    return null;
  };

  const strategy = new JwtStrategy(
    {
      jwtFromRequest,
      secretOrKey: fromBase64(process.env.PUBLIC_KEY_BASE64!),
    },
    (payload, done) => {
      return done(null, payload);
    },
  );
  return strategy;
};
