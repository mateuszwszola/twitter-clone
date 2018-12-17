function logoutUser(auth) {
  localStorage.removeItem('jwtToken');
  auth();
}

export default logoutUser;
