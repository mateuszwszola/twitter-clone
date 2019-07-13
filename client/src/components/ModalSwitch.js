import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import TweetModal from './Tweet/TweetModal';

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

export default withRouter(ModalSwitch);
