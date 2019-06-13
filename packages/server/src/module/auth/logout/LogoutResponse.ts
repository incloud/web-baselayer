import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LogoutResponse {
  @Field()
  success: boolean;
}
