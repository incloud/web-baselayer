import { Field, ObjectType } from 'type-graphql';
import { User } from '../../../entity/User';
import { ITokenResponse } from './ITokenResponse';
import { TokenResponse } from './TokenResponse';

@ObjectType({ implements: ITokenResponse })
export class AuthResponse extends TokenResponse {
  @Field(() => User)
  user: User;
}
