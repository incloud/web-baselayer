import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Icon } from 'antd';
import { Formik, FormikProps, FormikActions } from 'formik';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import {
  MeDocument,
  useLoginMutation,
  LoginMutationVariables,
} from '../../components/apollo-components';
import { Link } from 'react-router-dom';
import { graphqlFormikError } from '../../hooks/useGraphqlFormikError';
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-client';

interface LoginValues {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const login = useLoginMutation();
  const client = useApolloClient();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleLogin = async (
    variables: LoginMutationVariables,
    formikActions: FormikActions<LoginMutationVariables>,
  ) => {
    const { email, password } = variables;
    try {
      formikActions.setSubmitting(false);
      const response = await login({ variables: { email, password } });
      const user = response.data!.login.user;

      client.writeQuery({
        data: {
          me: {
            ...user,
          },
        },
        query: MeDocument,
      });
    } catch (e) {
      if (e instanceof ApolloError) {
        console.log(e);
        const errors = graphqlFormikError(e.graphQLErrors, variables);
        if (errors) {
          formikActions.setErrors(errors.fieldErrors);
          setFormErrors(errors.formErrors);
        }
      }
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={handleLogin}
        render={(formikBag: FormikProps<LoginMutationVariables>) => {
          return (
            <Form onSubmit={formikBag.handleSubmit} className="login-form">
              {formErrors.length > 0 && (
                <div>
                  <ul>
                    {formErrors.map((error, idx) => {
                      return <li key={idx}>{error}</li>;
                    })}
                  </ul>
                </div>
              )}
              <Form.Item name="email">
                <Input
                  name="email"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item name="password">
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <SubmitButton
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </SubmitButton>
              Or <Link to="/auth/register"> register now!</Link>
            </Form>
          );
        }}
      />
    </div>
  );
};
