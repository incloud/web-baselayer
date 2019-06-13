import {
  IsEmail,
  IsEnum,
  IsInt,
  IsPhoneNumber,
  Length,
  MaxLength,
} from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { User } from '../../../entity/User';
import { Gender } from '../../../enum/Gender';

@InputType()
export abstract class BaseUserInput implements Partial<User> {
  @Field()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsPhoneNumber('ZZ')
  phoneNumber: string;

  @Field(() => Int)
  @IsInt()
  birthYear: number;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;
}
