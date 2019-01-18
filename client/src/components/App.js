import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import PrivateHomepage from './PrivateHomepage';
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import SignOut from './SignOut';
import ProfileContainer from '../containers/ProfileContainer';
import SettingsContainer from '../containers/SettingsContainer';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <div className="content">
          <Header />
          <Switch>
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
    </Router>
  );
}

export default App;
