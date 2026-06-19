import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CarsProvider } from './context/CarsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CarsProvider>
        <App />
      </CarsProvider>
    </AuthProvider>
  </StrictMode>
);



