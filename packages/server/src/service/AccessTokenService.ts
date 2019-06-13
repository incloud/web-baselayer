import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import { Service } from 'typedi';
import { User } from '../entity/User';
import { fromBase64 } from '../util/base64';

const algorithm = 'RS256';

export interface IPayload {
  userId: string;
}

@Service()
export class AccessTokenService {
  private privateKey: string = fromBase64(process.env.PRIVATE_KEY_BASE64!);
  private publicKey: string = fromBase64(process.env.PUBLIC_KEY_BASE64!);
  private signOptions: SignOptions = {
    algorithm,
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY_TIME!, 10),
  };
  private verifyOptions: VerifyOptions = {
    algorithms: [algorithm],
  };

  async createAccessToken(user: User): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const { id: userId } = user;
      const payload: IPayload = { userId };
      sign(payload, this.privateKey, this.signOptions, (err, encoded) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(encoded);
      });
    });
  }

  async parseAccessToken(token: string): Promise<IPayload> {
    return new Promise<IPayload>((resolve, reject) => {
      verify(token, this.publicKey, this.verifyOptions, (err, decoded) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(decoded as IPayload);
      });
    });
  }
}
