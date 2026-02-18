import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './app/context/AppContext';
import { router } from './app/router';
import { Toaster } from './app/components/ui/sonner';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <RouterProvider router={router} />
    <Toaster />
  </AppProvider>
);
