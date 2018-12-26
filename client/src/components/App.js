import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Homepage from './Homepage';
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import ProfileContainer from '../containers/ProfileContainer';
import PrivateRoute from '../components/PrivateRoute';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App(data) {
  return (
    <Router>
      <>
        <Header
          isAuthenticated={data.isAuthenticated}
          user={data.user}
          auth={data.auth}
        />
        <Switch>
          <Route
            path="/"
            exact
            render={props => <Homepage {...props} {...data} />}
          />
          <Route
            path="/signin"
            exact
            render={props => (
              <SignInContainer
                {...props}
                isAuthenticated={data.isAuthenticated}
                auth={data.auth}
              />
            )}
          />
          <Route
            path="/signup"
            exact
            render={props => (
              <SignUpContainer
                {...props}
                isAuthenticated={data.isAuthenticated}
              />
            )}
          />
          <PrivateRoute
            path="/profile"
            component={ProfileContainer}
            apiData={data}
          />
        </Switch>
        <Footer />
      </>
    </Router>
  );
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired
};

export default App;
