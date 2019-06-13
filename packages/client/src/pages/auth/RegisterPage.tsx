import {
  Checkbox,
  Form,
  Input,
  Select,
  SubmitButton,
} from '@jbuschke/formik-antd';
import { Icon } from 'antd';
// tslint:disable-next-line:no-submodule-imports
import Text from 'antd/lib/typography/Text';
import { ApolloError } from 'apollo-client';
import { Formik, FormikActions, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import {
  MeDocument,
  RegisterMutationVariables,
  useRegisterMutation,
} from '../../components/apollo-components';
import { FormCard } from '../../components/FormCard';
import { FormError } from '../../components/FormError';
import { graphqlFormikError } from '../../hooks/useGraphqlFormikError';

enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other',
}

const { Option } = Select;

export const RegisterPage: React.FC = () => {
  const register = useRegisterMutation();
  const client = useApolloClient();

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleRegister = async (
    variables: RegisterMutationVariables,
    formikActions: FormikActions<RegisterMutationVariables>,
  ) => {
    try {
      formikActions.setSubmitting(false);
      const { data } = await register({ variables: { ...variables } });
      const user = data!.register.user;

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
        acceptedTermsAndConditions: false,
        birthYear: 2019,
        email: '',
        firstName: '',
        gender: Gender.Male,
        lastName: '',
        password: '',
        phoneNumber: '',
      }}
      onSubmit={handleRegister}
      render={(formikBag: FormikProps<RegisterMutationVariables>) => {
        return (
          <FormCard title="Register">
            <Form onSubmit={formikBag.handleSubmit} className="login-form">
              {formErrors.length > 0 && <FormError formErrors={formErrors} />}
              <Form.Item name="firstName">
                <Input
                  name="firstName"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Firstname"
                />
              </Form.Item>
              <Form.Item name="lastName">
                <Input
                  name="lastName"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Lastname"
                />
              </Form.Item>
              <Form.Item name="email">
                <Input
                  name="email"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item name="birthYear">
                <Input
                  name="birthYear"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="number"
                  placeholder="Phone number"
                />
              </Form.Item>
              <Form.Item name="phoneNumber">
                <Input
                  name="phoneNumber"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Phone number"
                />
              </Form.Item>
              <Form.Item name="gender">
                <Select defaultValue={Gender.Male} name="gender">
                  <Option value={Gender.Male}>Male</Option>
                  <Option value={Gender.Female}>Female</Option>
                  <Option value={Gender.Other}>Other</Option>
                </Select>
              </Form.Item>
              <Form.Item name="acceptedTermsAndConditions">
                <Text>Accepted terms and conditions</Text>
                <Checkbox name="acceptedTermsAndConditions" />
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
                className="register-form-button"
              >
                Register
              </SubmitButton>
            </Form>
          </FormCard>
        );
      }}
    />
  );
};
