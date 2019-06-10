import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class LogoutResponse {
  @Field()
  success: boolean;
}
