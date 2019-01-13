import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Homepage from './Homepage';
import SignInContainer from '../containers/SignInContainer';
import SignUpContainer from '../containers/SignUpContainer';
import ProfileContainer from '../containers/ProfileContainer';
import SettingsContainer from '../containers/SettingsContainer';
// import PrivateRoute from '../components/PrivateRoute';

import Header from './layout/Header';
import Footer from './layout/Footer';

function App() {
  return (
    <Router>
      <div className="wrapper">
        <div className="content">
          <Header />
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/signin" component={SignInContainer} />
            <Route exact path="/signup" component={SignUpContainer} />
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
