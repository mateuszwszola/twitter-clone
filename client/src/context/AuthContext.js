import { createContext, useContext, useEffect, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const AuthContext = createContext();

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  loading: true,
};

const reducer = (state, newState) => ({
  ...state,
  ...newState,
});

function AuthProvider(props) {
  const [state, setState] = useReducer(reducer, initialState);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setState(initialState);
  };

  const login = async (userData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(userData);

    try {
      const res = await axios.post('/api/auth/login', body, config);
      setState({ ...res.data });
      return res.data;
    } catch (error) {
      Promise.reject(error);
    }
  };

  const register = async (userData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(userData);

    try {
      const res = await axios.post('/api/auth/register', body, config);
      setState({ ...res.data });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');

      if (!token) {
        return logout();
      }

      setAuthToken(token);

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        logout();
        window.location.href = '/signin';
      } else {
        try {
          const res = await axios.get(`/api/users/${decoded.sub}`);

          setState({ user: res.data.user });
        } catch (error) {
          console.error(error.message);
        }
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout }}
      {...props}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export default AuthProvider;
