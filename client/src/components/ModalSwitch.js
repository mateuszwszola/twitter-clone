import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { CreateTweetModal } from './CreateTweet';
import { TweetModal } from './Tweet';

function ModalSwitch({ children }) {
  const location = useLocation();

  const background = location.state && location.state.background;

  return (
    <>
      <Switch location={background || location}>{children}</Switch>

      {background && (
        <>
          <Route path="/:userId/status/:tweetId">
            <TweetModal />
          </Route>
          <Route path="/compose/tweet">
            <CreateTweetModal />
          </Route>
        </>
      )}
    </>
  );
}

export default ModalSwitch;
