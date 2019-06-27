import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import { logoutUser } from '../actions/authActions';
import store from '../store';

function checkForToken() {
  const token = localStorage.getItem('token');

  // Set auth token for axios requests, if it exists, or not
  setAuthToken(token);

  if (token) {
    // Decode token and get user info and exp date
    const decoded = jwt_decode(token);
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
