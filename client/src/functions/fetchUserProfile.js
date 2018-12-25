import axios from 'axios';

function fetchUserProfile(setUserProfile, handleErrors, cb) {
  axios
    .get('/api/profiles')
    .then(res => {
      setUserProfile(res.data);
      cb();
    })
    .catch(err => handleErrors(err.response.data));
}

export default fetchUserProfile;
