import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PASSWORD_REQUIREMENTS } from '../register/RegisterInput';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_REQUIREMENTS)
  newPassword: string;
}
