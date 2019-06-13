import { Field, ObjectType } from 'type-graphql';
import { ITokenResponse } from './ITokenResponse';

@ObjectType({ implements: ITokenResponse })
export class TokenResponse implements ITokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
