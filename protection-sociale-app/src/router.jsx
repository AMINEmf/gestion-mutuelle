import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layout';

// Seule page conservée : Affiliations Mutuelle
import { AdhesionsMutuelle } from './pages/mutuelle';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Redirection de la racine vers Affiliations Mutuelle
      { index: true, element: <Navigate to="/mutuelle/adhesions" replace /> },

      // Route unique : Affiliations Mutuelle
      { path: 'mutuelle', element: <Navigate to="/mutuelle/adhesions" replace /> },
      { path: 'mutuelle/adhesions', element: <AdhesionsMutuelle /> },

      // Toute autre route redirige vers Affiliations Mutuelle
      { path: '*', element: <Navigate to="/mutuelle/adhesions" replace /> },
    ],
  },
]);
