import { registerEnumType } from 'type-graphql';

export enum Gender {
  Female,
  Male,
  Other,
}

registerEnumType(Gender, {
  description: 'Gender of a user',
  name: 'Gender',
});
