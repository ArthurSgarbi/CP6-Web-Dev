import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

// O painel mantém o roteador de dados (incluindo o bloqueio por alterações não salvas) em seu próprio
// pacote de entrada. Visitas públicas não precisam inicializar seu mecanismo de carregamento e ações.
const client = new QueryClient();
const router = createBrowserRouter([{ path: '*', element: <App /> }]);
createRoot(document.getElementById('root')).render(<React.StrictMode>
  <QueryClientProvider client={client}><RouterProvider router={router} /></QueryClientProvider>
</React.StrictMode>);
