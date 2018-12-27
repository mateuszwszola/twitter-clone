import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { UserProvider } from './UserContext';
import { ProfileProvider } from './ProfileContext';
import App from './components/App';
import './index.css';

ReactDOM.render(
  <UserProvider>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </UserProvider>,
  document.getElementById('root')
);
registerServiceWorker();
