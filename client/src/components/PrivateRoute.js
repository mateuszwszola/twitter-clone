import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, apiData, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      apiData.isAuthenticated === true ? (
        <Component {...props} {...apiData} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
