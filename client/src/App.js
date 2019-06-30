import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import ThemeProvider from './shared/theme-provider';
import GlobalStyle from './shared/global-style';
import { Wrapper, Content } from './shared/layout';

import { Header, Footer } from './components/layout';
import SignInContainer from './containers/signInContainer';
import SignUpContainer from './containers/signUpContainer';
import PrivateHomepage from './components/route/privateHomepage';
import RenderCreateTweetModal from './components/createTweetModal';
import ProfileContainer from './containers/profileContainer';
// import SettingsContainer from './containers/SettingsContainer';
// import PrivateRoute from './components/route/PrivateRoute';
import ErrorBoundary from './components/errorBoundary';

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
      <GlobalStyle />
      <ThemeProvider>
        <ErrorBoundary>
          <Router>
            <Wrapper>
              <Content>
                <Header />
                <RenderCreateTweetModal />
                <Switch>
                  <Route exact path="/" component={PrivateHomepage} />
                  <Route exact path="/signin" component={SignInContainer} />
                  <Route exact path="/signup" component={SignUpContainer} />
                  {/* <Route exact path="/settings" component={SettingsContainer} /> */}
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
