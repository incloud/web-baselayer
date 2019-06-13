import { Field, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class ITokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
