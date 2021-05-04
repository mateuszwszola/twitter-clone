import client from './client';

function getProfiles() {
  return client.get('/profiles').then((res) => res.data);
}

function getProfile(userId) {
  return client.get(`/profiles/${userId}`).then((res) => res.data);
}

function followUser(userId) {
  return client.post(`/profiles/follow/${userId}`);
}

function unfollowUser(userId) {
  return client.delete(`/profiles/follow/${userId}`);
}

export { getProfiles, getProfile, followUser, unfollowUser };
