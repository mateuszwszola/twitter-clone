import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from 'context/UserContext';

const PrivateRoute = ({ children, ...rest }) => {
  const user = useUser();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
