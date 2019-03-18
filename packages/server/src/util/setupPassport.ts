import { Express } from 'express';
import { authenticate, initialize, use } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { IPayload } from '../service/AccessTokenService';
import { fromBase64 } from './base64';

export function setupPassport(app: Express) {
  const strategy = new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: fromBase64(process.env.PUBLIC_KEY_BASE64!),
    },
    (payload, done) => {
      return done(null, payload);
    },
  );

  use(strategy);
  initialize();

  app.use('/graphql', (req, res, next) => {
    authenticate('jwt', { session: false }, (_, payload: IPayload) => {
      if (payload) {
        req.user = payload;
      }
      return next();
    })(req, res, next);
  });
}
