import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import { useAuth } from './AuthContext';
import client from 'api/client';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

const UserContext = createContext();

function UserProvider(props) {
  const { user } = useAuth();
  const { isLoading, data, error } = useQuery(
    ['users', user?._id],
    () => client.get(`/users/${user?._id}`).then((res) => res.data),
    {
      enabled: !!user?._id,
    }
  );

  if (error) {
    return <DisplayError error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <UserContext.Provider value={data?.user || null} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserProvider;
