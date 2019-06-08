import {
  Form,
  Input,
  SubmitButton,
  Checkbox,
  Select,
} from '@jbuschke/formik-antd';
import { Icon } from 'antd';
import { Formik, FormikProps, FormikActions } from 'formik';
import React from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import {
  MeDocument,
  useLoginMutation,
  useRegisterMutation,
} from '../../components/apollo-components';
import Text from 'antd/lib/typography/Text';

enum Gender {
  Female = 'Female',
  Male = 'Male',
  Other = 'Other',
}

interface RegisterValues {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthYear: number;
  gender: Gender;
  password: string;
  acceptedTermsAndConditions: boolean;
}
const { Option } = Select;

interface FormikValidationError {
  constraints: {
    matches: string;
  };
  property: string;
}

interface FormikError {
  [k: string]: string;
}

export const RegisterPage: React.FC = () => {
  const register = useRegisterMutation();
  const client = useApolloClient();

  const handleRegister = async (
    values: RegisterValues,
    formikActions: FormikActions<RegisterValues>,
  ) => {
    formikActions.setSubmitting(false);
    const { data, errors } = await register({ variables: { ...values } });
    const user = data!.register.user;

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
          firstName: '',
          lastName: '',
          phoneNumber: '',
          birthYear: 2019,
          gender: Gender.Male,
          password: '',
          acceptedTermsAndConditions: false,
        }}
        onSubmit={handleRegister}
        render={(formikBag: FormikProps<RegisterValues>) => {
          return (
            <Form onSubmit={formikBag.handleSubmit} className="login-form">
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
          );
        }}
      />
    </div>
  );
};
