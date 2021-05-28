import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Wrapper, Content } from 'shared/layout';

import SignInPage from 'pages/SignIn';
import SignUpPage from 'pages/SignUp';
import Homepage from 'pages/Homepage';
import ProfilesPage from 'pages/Profiles';
import ProfilePage from 'pages/Profile';
import SettingsPage from 'pages/Settings';
import EditProfilePage from 'pages/EditProfile';
import Header from 'components/Header';
import PrivateRoute from 'components/PrivateRoute';
import Alert from 'components/Alert';
import ModalSwitch from 'components/ModalSwitch';
import NotFoundPage from 'components/NotFoundPage';
import TweetPage from 'pages/Tweet';
import CreateTweetPage from 'pages/CreateTweet';

function App() {
  return (
    <Router>
      <Wrapper>
        <Content>
          <Alert />
          <Header />
          <ModalSwitch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route path="/compose/tweet">
              <CreateTweetPage />
            </Route>
            <Route path="/:userId/status/:tweetId">
              <TweetPage />
            </Route>
            <PrivateRoute exact path="/edit-profile">
              <EditProfilePage />
            </PrivateRoute>
            <PrivateRoute exact path="/settings">
              <SettingsPage />
            </PrivateRoute>
            <Route exact path="/signin">
              <SignInPage />
            </Route>
            <Route exact path="/signup">
              <SignUpPage />
            </Route>
            <Route exact path="/profiles">
              <ProfilesPage />
            </Route>
            <Route path="/profile/:userId">
              <ProfilePage />
            </Route>
            <Route>
              <NotFoundPage />
            </Route>
          </ModalSwitch>
        </Content>
      </Wrapper>
    </Router>
  );
}

export default App;
