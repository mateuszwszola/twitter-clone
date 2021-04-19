import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import ThemeProvider from 'shared/theme-provider';
import GlobalStyle from 'shared/global-style';
import { Wrapper, Content } from 'shared/layout';

import { Header } from './components/layout';
import SignInContainer from './containers/SignInContainer';
import SignUpContainer from './containers/SignUpContainer';
import PrivateHomepage from './components/route/PrivateHomepage';
import RenderCreateTweetModal from './components/CreateTweetModal';
import ProfileContainer from './containers/ProfileContainer';
import ProfilesContainer from './containers/ProfilesContainer';
import SettingsContainer from './containers/SettingsContainer';
import EditProfileContainer from './containers/EditProfileContainer';
import PrivateRoute from './components/route/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Alert from 'components/Alert';
import ModalSwitch from './components/ModalSwitch';
import NotFoundPage from 'components/NotFoundPage';

import store from './store';
import { loadUser } from 'actions/authActions';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
                  <ModalSwitch>
                    <PrivateRoute
                      exact
                      path="/edit-profile"
                      component={EditProfileContainer}
                    />
                    <PrivateRoute
                      exact
                      path="/settings"
                      component={SettingsContainer}
                    />
                    <Route exact path="/" component={PrivateHomepage} />
                    <Route exact path="/signin" component={SignInContainer} />
                    <Route exact path="/signup" component={SignUpContainer} />
                    <Route
                      exact
                      path="/profiles"
                      component={ProfilesContainer}
                    />
                    <Route
                      path="/profile/:userId"
                      component={ProfileContainer}
                    />
                    <Route component={NotFoundPage} />
                  </ModalSwitch>
                </Content>
              </Wrapper>
            </Router>
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
