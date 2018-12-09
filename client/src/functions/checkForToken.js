import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

function checkForToken() {
  const { jwtToken } = localStorage;
  if (jwtToken) {
    // Decode token and get user info and exp date
    const decoded = jwt_decode(jwtToken);

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Logout user
      localStorage.removeItem('jwtToken');
      setAuthToken(false);
      // return current user - empty object
      return {};
    }

    // Set auth token for axios requests
    setAuthToken(jwtToken);
    return decoded;
  }

  setAuthToken(false);
  return {};
}

export default checkForToken;
