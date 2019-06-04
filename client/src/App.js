import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header, Footer } from './components/layout';
import SignInContainer from './containers/SignInContainer';
import SignUpContainer from './containers/SignUpContainer';
import PrivateHomepage from './components/PrivateHomepage';
// import ProfileContainer from './containers/ProfileContainer';
// import SettingsContainer from './containers/SettingsContainer';

// import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './ErrorBoundary';

import { Provider } from 'react-redux';
import store from './store';
import checkForToken from './utils/checkForToken';
import { loadUser } from './actions/authActions';

checkForToken();

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

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
                {/* <Route exact path="/settings" component={SettingsContainer} /> */}
                {/* <Route exact path="/:username" component={ProfileContainer} /> */}
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
