import gql from 'graphql-tag';

export const RegisterMutation = gql`
  mutation register(
    $email: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $birthYear: Int!
    $gender: Gender!
    $password: String!
    $acceptedTermsAndConditions: Boolean!
  ) {
    register(
      input: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        birthYear: $birthYear
        gender: $gender
        password: $password
        acceptedTermsAndConditions: $acceptedTermsAndConditions
      }
    ) {
      user {
        id
        email
        firstName
        lastName
        phoneNumber
        birthYear
        gender
      }
    }
  }
`;
