import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Landing from './Landing';
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';

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
            render={props => <Landing {...props} {...data} />}
          />
          <Route
            path="/signin"
            exact
            render={props => <SignInContainer {...props} {...data} />}
          />
          <Route
            path="/signup"
            exact
            render={props => <SignUpContainer {...props} {...data} />}
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
  auth: PropTypes.func.isRequired
};

export default App;
