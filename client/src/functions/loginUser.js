import axios from 'axios';

function loginUser(userData, login, setErrors) {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      console.log(res.data);
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      login();
    })
    .catch(err => {
      console.log(err.response.data);
      setErrors(err.response.data);
    });
}

export default loginUser;
