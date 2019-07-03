import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ThemeProvider from 'shared/theme-provider';
import GlobalStyle from 'shared/global-style';
import { Wrapper, Content } from 'shared/layout';

import { Header, Footer } from 'components/layout';
import SignInContainer from 'containers/SignInContainer';
import SignUpContainer from 'containers/SignUpContainer';
import PrivateHomepage from 'components/route/PrivateHomepage';
import RenderCreateTweetModal from 'components/createTweetModal';
import ProfileContainer from 'containers/ProfileContainer';
import SettingsContainer from './containers/SettingsContainer';
import EditProfileContainer from './containers/EditProfileContainer';
import PrivateRoute from './components/route/PrivateRoute';
import ErrorBoundary from 'components/ErrorBoundary';
import Alert from 'components/alert/Alert';

import { Provider } from 'react-redux';
import store from './store';
import checkForToken from 'utils/checkForToken';
import { loadUser } from 'actions/authActions';

checkForToken();

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <GlobalStyle />
      <ThemeProvider>
        <ErrorBoundary>
          <Router>
            <Wrapper>
              <Content>
                <Alert />
                <Header />
                <RenderCreateTweetModal />
                <Switch>
                  <PrivateRoute
                    exact
                    path="/edit-profile"
                    component={EditProfileContainer}
                  />
                  <Route exact path="/" component={PrivateHomepage} />
                  <Route exact path="/signin" component={SignInContainer} />
                  <Route exact path="/signup" component={SignUpContainer} />
                  <Route exact path="/settings" component={SettingsContainer} />
                  <Route exact path="/:username" component={ProfileContainer} />
                  <Route render={() => <div>404 Not Found</div>} />
                </Switch>
              </Content>
              <Footer />
            </Wrapper>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
