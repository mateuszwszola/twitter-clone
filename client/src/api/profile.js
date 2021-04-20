import client from './client';

function getProfiles() {
  return client.get('/profiles').then((res) => res.data);
}

export { getProfiles };
