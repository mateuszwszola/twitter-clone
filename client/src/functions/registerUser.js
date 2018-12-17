import axios from 'axios';

function registerUser(userData, register, setErrors) {
  axios
    .post('/api/users/register', userData)
    .then(res => {
      console.log(res.data);
      register();
    })
    .catch(err => {
      console.log(err.response.data);
      setErrors(err.response.data);
    });
}

export default registerUser;
