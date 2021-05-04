import React, { useEffect, useRef, useMemo } from 'react';
import {
  Route,
  Switch,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { CreateTweetModal } from './CreateTweet';
import { TweetModal } from './Tweet';

function useModalSwitch() {
  const location = useLocation();
  const history = useHistory();
  const previousLocationRef = useRef(location);
  const tweetModalMatch = useRouteMatch('/:userId/status/:tweetId');
  const createTweetModalMatch = useRouteMatch('/compose/tweet');

  const isModal = useMemo(
    () => !!(location.state?.modal || tweetModalMatch || createTweetModalMatch),
    [createTweetModalMatch, location, tweetModalMatch]
  );

  useEffect(() => {
    // set previous location if new location is not a modal
    if (history.action !== 'POP' && !isModal) {
      previousLocationRef.current = location;
    }
  }, [history.action, isModal, location]);

  return { isModal, previousLocation: previousLocationRef.current, location };
}

/* 
  ModalSwitch component allows to have a modal displayed with a new url, 
  keeping previous (not modal) location route component in the background
*/
function ModalSwitch({ children }) {
  const { isModal, previousLocation, location } = useModalSwitch();

  return (
    <>
      <Switch location={isModal ? previousLocation : location}>
        {children}
      </Switch>
      {isModal ? (
        <Switch>
          <Route path="/:userId/status/:tweetId">
            <TweetModal />
          </Route>
          <Route path="/compose/tweet">
            <CreateTweetModal />
          </Route>
        </Switch>
      ) : null}
    </>
  );
}

export default ModalSwitch;

/*
class ModalSwitch extends Component {
  previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    let { location } = this.props;

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    let { location } = this.props;

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return (
      <>
        <Switch location={isModal ? this.previousLocation : location}>
          {this.props.children}
        </Switch>
        {isModal ? (
          <Route path="/:username/status/:status_id" component={TweetModal} />
        ) : null}
      </>
    );
  }
}
*/
