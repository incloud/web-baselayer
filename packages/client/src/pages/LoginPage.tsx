import React, { useState } from 'react';
import { useLoginMutation } from '../components/apollo-components';

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const loginMutation = useLoginMutation({ variables: { email, password } });

  const login = async () => {
    const data = await loginMutation();
    console.log(data.data!.login);
  };

  return (
    <div>
      <input
        type="email"
        onChange={e => {
          setEmail(e.currentTarget.value);
        }}
      />
      <input
        type="password"
        onChange={e => {
          setPassword(e.currentTarget.value);
        }}
      />
      <button onClick={login}>login</button>
    </div>
  );
};
