import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

// The panel keeps the data router (including unsaved-change blocking) in its own
// entry bundle. Public visits do not need to initialize its loader/action engine.
const client = new QueryClient();
const router = createBrowserRouter([{ path: '*', element: <App /> }]);
createRoot(document.getElementById('root')).render(<React.StrictMode>
  <QueryClientProvider client={client}><RouterProvider router={router} /></QueryClientProvider>
</React.StrictMode>);
