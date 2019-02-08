import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { setCurrentUser, logoutUser } from '../actions/authActions';
import store from '../store';

function checkForToken() {
  const { jwtToken } = localStorage;
  if (jwtToken) {
    // Set auth token for axios requests
    setAuthToken(jwtToken);
    // Decode token and get user info and exp date
    const decoded = jwt_decode(jwtToken);
    store.dispatch(setCurrentUser(decoded));
    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect user to login page
      window.location.href = '/signin';
    }
  }
}

export default checkForToken;
