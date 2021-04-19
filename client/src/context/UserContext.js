import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

function UserProvider(props) {
  const { user } = useAuth();

  return <UserContext.Provider value={user} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserProvider;
