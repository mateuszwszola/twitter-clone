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

  componentDidMount() {
    // Check if token exists
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
  }

  render() {
    return <App {...this.state} />;
  }
}

export default AppContainer;
