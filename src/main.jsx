import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

const queryClient = new QueryClient();

const app = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter><App /></BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
const root = document.getElementById('root');
if (window.location.pathname === '/' && root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
