import React, { Component } from 'react';

import checkForToken from './utils/checkForToken';
import isEmpty from './utils/isEmpty';

let UserContext;
const { Provider, Consumer } = UserContext = React.createContext();

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

function withUserContext(Component) {
  return function (props) {
    return (
      <Consumer>
        {authProps => <Component {...props} {...authProps} />}
      </Consumer>
    );
  };
}

export { UserProvider, Consumer as UserConsumer, withUserContext, UserContext };
