import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Icon } from 'antd';
import { ApolloError } from 'apollo-client';
import { Formik, FormikActions, FormikProps } from 'formik';
import { GraphQLError } from 'graphql';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { Link } from 'react-router-dom';
import {
  LoginMutationVariables,
  MeDocument,
  useLoginMutation,
} from '../../components/apollo-components';
import { FormCard } from '../../components/FormCard';
import { FormError } from '../../components/FormError';
import { graphqlFormikError } from '../../hooks/useGraphqlFormikError';

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
        const errors = graphqlFormikError(e.graphQLErrors, variables);
        if (errors) {
          formikActions.setErrors(errors.fieldErrors);
          setFormErrors(errors.formErrors);
        }
      }
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={handleLogin}
      render={(formikBag: FormikProps<LoginMutationVariables>) => {
        return (
          <FormCard title="Login">
            <Form onSubmit={formikBag.handleSubmit} className="login-form">
              {formErrors.length > 0 && <FormError formErrors={formErrors} />}
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
          </FormCard>
        );
      }}
    />
  );
};
