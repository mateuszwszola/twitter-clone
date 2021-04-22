import React from 'react';
import Landing from './Landing';
import Homepage from './Homepage';
import { useUser } from 'context/UserContext';

const Home = (props) => {
  const user = useUser();

  return user ? <Homepage {...props} /> : <Landing {...props} />;
};

export default Home;
