import { Equals, Matches } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { BaseUserInput } from '../shared/BaseUserInput';

export const PASSWORD_REQUIREMENTS = /^.*(?=.{8,255})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
export const PASSWORD_HINTS = [
  `Must be between 8 and 255 characters long`,
  `Must contain at least one number`,
  `Must contain at least one lower case character`,
  `Must contain at least one upper case character`,
  `Must contain at least one of the following special characters: !@#$%^&*()-_=+{};:,<.>`,
];

@InputType()
export class RegisterInput extends BaseUserInput {
  @Field({
    description: `
Password requirements:
${PASSWORD_HINTS.map(hint => ` - ${hint}`).join('\n')}
    `,
  })
  @Matches(PASSWORD_REQUIREMENTS)
  password: string;

  @Field()
  @Equals(true)
  acceptedTermsAndConditions: boolean;
}
