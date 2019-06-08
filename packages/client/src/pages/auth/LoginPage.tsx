import { Form, Input, SubmitButton } from '@jbuschke/formik-antd';
import { Icon } from 'antd';
import { Formik, FormikProps } from 'formik';
import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import {
  MeDocument,
  useLoginMutation,
} from '../../components/apollo-components';
import { Link } from 'react-router-dom';

interface LoginValues {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const login = useLoginMutation();
  const client = useApolloClient();

  const handleLogin = async ({ email, password }: LoginValues) => {
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
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => {
          handleLogin(values);
        }}
        render={(formikBag: FormikProps<LoginValues>) => {
          return (
            <Form onSubmit={formikBag.handleSubmit} className="login-form">
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
