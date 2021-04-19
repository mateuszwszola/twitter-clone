import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import './index.css';
import AppProviders from 'context/AppProviders';

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById('root')
);
registerServiceWorker();
