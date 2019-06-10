import { Layout } from 'antd';
import React, { FC, useEffect } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router';
import {
  useMeQuery,
  useLogoutMutation,
  MeDocument,
} from './components/apollo-components';
import { PrivateRoute } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { Header } from './components/Header';
import { LogoutMutation } from './graphql/auth/LogoutMutation';
import { useApolloClient } from 'react-apollo-hooks';
import { RegisterPage } from './pages/auth/RegisterPage';

const { Content, Footer } = Layout;

const BaselayerCmp: FC<RouteComponentProps> = ({ history }) => {
  const client = useApolloClient();
  // cache and network is currently exposed wrong (react-apollo-hooks v.0.4.5)
  // https://github.com/apollographql/apollo-client/issues/4847#issuecomment-494847903
  // https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/watchQueryOptions.ts
  // https://github.com/trojawski/react-apollo-hooks/pull/169
  // @ts-ignore
  const loggedInUser = useMeQuery({ fetchPolicy: 'cache-first' });
  const logout = useLogoutMutation();
  const isLoggedIn = !!(loggedInUser.data && loggedInUser.data.me);

  useEffect(() => {
    const pathName =
      history.location.pathname === '/' ? '/home' : history.location.pathname;
    history.replace(isLoggedIn ? pathName : '/auth/login');
  }, [isLoggedIn]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        login={() => {}}
        logout={async () => {
          await logout();

          client.resetStore();
        }}
        isLoggedIn={isLoggedIn}
      />
      <Layout className="content">
        <Layout className="page">
          <Content>
            <Switch>
              <PrivateRoute
                path="/home"
                Component={HomePage}
                isLoggedIn={isLoggedIn}
              />
              {!isLoggedIn && (
                <Route path="/auth/register" render={() => <RegisterPage />} />
              )}
              {!isLoggedIn ? (
                <Route path="/auth/login" render={() => <LoginPage />} />
              ) : (
                <Redirect from="/auth/login" to="/home" />
              )}
            </Switch>
          </Content>
        </Layout>
      </Layout>
      <Footer />
    </Layout>
  );
};

export const Baselayer = withRouter(BaselayerCmp);
