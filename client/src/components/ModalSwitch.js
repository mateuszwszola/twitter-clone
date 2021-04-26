import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import usePrevious from 'hooks/usePrevious';
import { CreateTweetModal } from './CreateTweet';
import { TweetModal } from './Tweet';

function ModalSwitch({ children }) {
  const location = useLocation();
  const previousLocation = usePrevious(location);
  const tweetModalMatch = useRouteMatch('/:userId/status/:tweetId');
  const createTweetMatch = useRouteMatch('/compose/tweet');

  const isModal =
    !!tweetModalMatch ||
    !!createTweetMatch ||
    !!(location.state?.modal && previousLocation !== location);

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
