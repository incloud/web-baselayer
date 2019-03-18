import { Field, ObjectType } from 'type-graphql';
import { User } from '../../../entity/User';
import { TokenResponse } from './TokenResponse';

@ObjectType()
export class AuthResponse extends TokenResponse {
  @Field(() => User)
  user: User;
}
