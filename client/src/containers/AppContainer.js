import React, { Component } from 'react';
import App from '../components/App';

import checkForToken from '../functions/checkForToken';
import isEmpty from '../utils/isEmpty';

class AppContainer extends Component {
  state = {
    isAuthenticated: false,
    user: {},
    profile: {}
  };

  handleAuthentication = () => {
    const decoded = checkForToken();

    if (isEmpty(decoded)) {
      this.setState(() => ({
        isAuthenticated: false,
        user: {},
        profile: {} // clear current profile
      }));
    } else {
      this.setState(() => ({
        isAuthenticated: true,
        user: decoded
      }));
    }
  };

  setUserProfile = profile => {
    this.setState(() => ({
      profile: {
        ...profile
      }
    }));
  };

  componentDidMount() {
    console.log('AppContainer did mount! \n Handle authentication');
    this.handleAuthentication();
  }

  render() {
    return (
      <App
        auth={this.handleAuthentication}
        setUserProfile={this.setUserProfile}
        {...this.state}
      />
    );
  }
}

export default AppContainer;
