import React, { Component } from 'react';

const { Provider, Consumer } = React.createContext();

class ProfileContext extends Component {
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

export { ProfileContext, Consumer as ProfileConsumer };
