import React, { FunctionComponent } from 'react';
import {
  Omit,
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router';

interface IProps extends Omit<Omit<RouteProps, 'component'>, 'render'> {
  Component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  isLoggedIn: boolean;
}

export const PrivateRoute: FunctionComponent<IProps> = ({
  Component,
  isLoggedIn,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? <Component {...props} /> : <Redirect to={'/auth/login'} />
      }
    />
  );
};
