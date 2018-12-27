import React, { Component } from 'react';

import checkForToken from './functions/checkForToken';
import isEmpty from './utils/isEmpty';

const { Provider, Consumer } = React.createContext();

class UserProvider extends Component {
  state = {
    isAuthenticated: false,
    user: {}
  };

  handleAuthentication = () => {
    const decoded = checkForToken();

    this.setState(() => ({
      isAuthenticated: !isEmpty(decoded),
      user: decoded
    }));
  };

  // Check authentication when app loads
  componentDidMount() {
    this.handleAuthentication();
  }

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          authenticateUser: this.handleAuthentication
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { UserProvider, Consumer as UserConsumer };
