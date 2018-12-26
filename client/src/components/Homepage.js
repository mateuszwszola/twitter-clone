import React from 'react';
import Landing from './Landing';

function Homepage(props) {
  if (!props.isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="container">
      <h1>Homepage for authenticated users</h1>
    </div>
  );
}

export default Homepage;
