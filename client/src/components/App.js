import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserConsumer } from '../UserContext';

import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import ProfileContainer from '../containers/ProfileContainer';
import SettingsContainer from '../containers/SettingsContainer';
import CreateTweetContainer from '../containers/CreateTweetContainer';
import SignOut from './SignOut';
import PrivateRoute from './PrivateRoute';
import PrivateHomepage from './PrivateHomepage';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  return (
    <Router>
      <UserConsumer>
        {({ isAuthenticated }) => (
          <div className="wrapper">
            <div className="content">
              <Header />
              <Switch>
                <PrivateRoute
                  path="/create-tweet"
                  component={CreateTweetContainer}
                  isAuthenticated={isAuthenticated}
                />
                <Route exact path="/" component={PrivateHomepage} />
                <Route exact path="/signin" component={SignInContainer} />
                <Route exact path="/signup" component={SignUpContainer} />
                <Route exact path="/signout" component={SignOut} />
                <Route exact path="/settings" component={SettingsContainer} />
                <Route exact path="/:username" component={ProfileContainer} />
                <Route render={() => <div>404 Not Found</div>} />
              </Switch>
            </div>
            <Footer />
          </div>
        )}
      </UserConsumer>
    </Router>
  );
}

export default App;
