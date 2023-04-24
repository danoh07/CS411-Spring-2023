import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PlaylistsContextProvider } from './context/playlistContext';
import { AuthContextProvider } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <AuthContextProvider>
      <PlaylistsContextProvider>
        <App />
      </PlaylistsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
