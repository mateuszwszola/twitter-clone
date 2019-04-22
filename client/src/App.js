import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import checkForToken from './utils/checkForToken';

import { Provider } from 'react-redux';
import store from './store';

// import PrivateRoute from './components/PrivateRoute';
import PrivateHomepage from './components/PrivateHomepage';

import SignInContainer from './containers/SignInContainer';
import SignUpContainer from './containers/SignUpContainer';
import ProfileContainer from './containers/ProfileContainer';
import SettingsContainer from './containers/SettingsContainer';
import ErrorBoundary from './ErrorBoundary';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

checkForToken();

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="wrapper">
            <div className="content">
              <Header />
              <Switch>
                <Route exact path="/" component={PrivateHomepage} />
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
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
