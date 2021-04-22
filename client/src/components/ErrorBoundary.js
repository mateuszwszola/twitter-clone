import React, { Component } from 'react';
import { DisplayError } from 'shared/components';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }
  render() {
    if (this.state.hasError) {
      return <DisplayError>Something went wrong.</DisplayError>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
