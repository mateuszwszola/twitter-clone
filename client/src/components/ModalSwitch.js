import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { TweetModal } from './Tweet';
import usePrevious from 'hooks/usePrevious';

// My refactored to hook implementation of ModalSwitch component
function ModalSwitch(props) {
  const { location } = props;
  let previousLocation = usePrevious(location);

  let isModal = !!(
      location.state &&
      location.state.modal &&
      previousLocation !== location
  );

  return (
      <>
        <Switch location={isModal ? previousLocation : location}>
          {props.children}
        </Switch>
        {isModal ? (
            <Route path="/:username/status/:status_id" component={TweetModal} />
        ) : null}
      </>
  );
}

export default withRouter(ModalSwitch);

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
