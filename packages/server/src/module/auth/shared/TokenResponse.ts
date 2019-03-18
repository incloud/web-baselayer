import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
