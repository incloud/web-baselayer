import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
