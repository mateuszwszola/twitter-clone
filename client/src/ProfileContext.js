import React, { Component } from 'react';

let ProfileContext;
const { Provider, Consumer } = ProfileContext = React.createContext();

class ProfileProvider extends Component {
  state = {
    currentProfile: null,
    profiles: []
  };

  setCurrentUserProfile = profile => {
    this.setState(() => ({
      currentProfile: profile
    }));
  };

  setProfiles = profiles => {
    this.setState(() => ({ profiles }));
  };

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          setCurrentUserProfile: this.setCurrentUserProfile,
          setProfiles: this.setProfiles
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

function withProfileContext(Component) {
  return function (props) {
    return (
      <Consumer>
        {profileProps => <Component {...props} {...profileProps} />}
      </Consumer>
    );
  };
}

export {
  ProfileProvider,
  Consumer as ProfileConsumer,
  ProfileContext,
  withProfileContext
};
