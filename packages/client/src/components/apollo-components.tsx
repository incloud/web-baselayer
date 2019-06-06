// THIS IS A GENERATED FILE, DO NOT EDIT IT!
// tslint:disable
import gql from 'graphql-tag';
import * as ReactApollo from 'react-apollo';
import * as ReactApolloHooks from 'react-apollo-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export type AuthResponse = ITokenResponse & {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: User;
};

export type BaseUserInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
  birthYear: Scalars['Int'];
  gender: Gender;
};

export type ChangePasswordInput = {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

/** Gender of a user */
export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other',
}

export type ITokenResponse = {
  __typename?: 'ITokenResponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: AuthResponse;
  login: AuthResponse;
  refreshTokens: AuthResponse;
  register: AuthResponse;
  resetPassword: Scalars['Boolean'];
  updateMe: User;
};

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationRefreshTokensArgs = {
  refreshToken: Scalars['String'];
};

export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type MutationResetPasswordArgs = {
  email: Scalars['String'];
};

export type MutationUpdateMeArgs = {
  changes: BaseUserInput;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  users: Array<User>;
};

export type RegisterInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
  birthYear: Scalars['Int'];
  gender: Gender;
  /** Password requirements:
   *  - Must be between 8 and 255 characters long
   *  - Must contain at least one number
   *  - Must contain at least one lower case character
   *  - Must contain at least one upper case character
   *  - Must contain at least one of the following special characters: !@#$%^&*()-_=+{};:,<.>
   */
  password: Scalars['String'];
  acceptedTermsAndConditions: Scalars['Boolean'];
};

export type TokenResponse = ITokenResponse & {
  __typename?: 'TokenResponse';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber: Scalars['String'];
  birthYear: Scalars['Int'];
  gender: Gender;
};
export type LoginMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'AuthResponse' } & Pick<
    AuthResponse,
    'accessToken' | 'refreshToken'
  > & {
      user: { __typename?: 'User' } & Pick<
        User,
        'id' | 'email' | 'firstName' | 'lastName'
      >;
    };
};

export type RefreshTokenMutationMutationVariables = {
  refreshToken: Scalars['String'];
};

export type RefreshTokenMutationMutation = { __typename?: 'Mutation' } & {
  refreshTokens: { __typename?: 'AuthResponse' } & Pick<
    AuthResponse,
    'accessToken' | 'refreshToken'
  >;
};

export type MeQueryVariables = {};

export type MeQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<User, 'id' | 'firstName'>;
};

export const LoginDocument = gql`
  mutation login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;
export type LoginMutationFn = ReactApollo.MutationFn<
  LoginMutation,
  LoginMutationVariables
>;
export type LoginProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<LoginMutation, LoginMutationVariables>
> &
  TChildProps;
export function withLogin<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    LoginMutation,
    LoginMutationVariables,
    LoginProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    LoginMutation,
    LoginMutationVariables,
    LoginProps<TChildProps>
  >(LoginDocument, {
    alias: 'withLogin',
    ...operationOptions,
  });
}

export function useLoginMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    baseOptions,
  );
}
export const RefreshTokenMutationDocument = gql`
  mutation refreshTokenMutation($refreshToken: String!) {
    refreshTokens(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;
export type RefreshTokenMutationMutationFn = ReactApollo.MutationFn<
  RefreshTokenMutationMutation,
  RefreshTokenMutationMutationVariables
>;
export type RefreshTokenMutationProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    RefreshTokenMutationMutation,
    RefreshTokenMutationMutationVariables
  >
> &
  TChildProps;
export function withRefreshTokenMutation<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    RefreshTokenMutationMutation,
    RefreshTokenMutationMutationVariables,
    RefreshTokenMutationProps<TChildProps>
  >,
) {
  return ReactApollo.withMutation<
    TProps,
    RefreshTokenMutationMutation,
    RefreshTokenMutationMutationVariables,
    RefreshTokenMutationProps<TChildProps>
  >(RefreshTokenMutationDocument, {
    alias: 'withRefreshTokenMutation',
    ...operationOptions,
  });
}

export function useRefreshTokenMutationMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    RefreshTokenMutationMutation,
    RefreshTokenMutationMutationVariables
  >,
) {
  return ReactApolloHooks.useMutation<
    RefreshTokenMutationMutation,
    RefreshTokenMutationMutationVariables
  >(RefreshTokenMutationDocument, baseOptions);
}
export const MeDocument = gql`
  query me {
    me {
      id
      firstName
    }
  }
`;
export type MeProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<MeQuery, MeQueryVariables>
> &
  TChildProps;
export function withMe<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    MeQuery,
    MeQueryVariables,
    MeProps<TChildProps>
  >,
) {
  return ReactApollo.withQuery<
    TProps,
    MeQuery,
    MeQueryVariables,
    MeProps<TChildProps>
  >(MeDocument, {
    alias: 'withMe',
    ...operationOptions,
  });
}

export function useMeQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<MeQueryVariables>,
) {
  return ReactApolloHooks.useQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions,
  );
}
