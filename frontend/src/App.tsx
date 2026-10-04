import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import { router } from './router';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
