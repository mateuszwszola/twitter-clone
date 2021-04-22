import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Wrapper, Content } from 'shared/layout';

import { Header } from './components/layout';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import Home from './pages/Home';
import RenderCreateTweetModal from './components/CreateTweetModal';
import ProfileContainer from './containers/ProfileContainer';
import ProfilesContainer from './containers/ProfilesContainer';
import SettingsContainer from './containers/SettingsContainer';
import EditProfileContainer from './containers/EditProfileContainer';
import PrivateRoute from './components/PrivateRoute';
import Alert from 'components/Alert';
import ModalSwitch from './components/ModalSwitch';
import NotFoundPage from 'components/NotFoundPage';

import store from './store';

function App() {
  return (
    <Provider store={store}>
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
              <Route exact path="/" component={Home} />
              <Route exact path="/signin" component={SignInPage} />
              <Route exact path="/signup" component={SignUpPage} />
              <Route exact path="/profiles" component={ProfilesContainer} />
              <Route path="/profile/:userId" component={ProfileContainer} />
              <Route component={NotFoundPage} />
            </ModalSwitch>
          </Content>
        </Wrapper>
      </Router>
    </Provider>
  );
}

export default App;
