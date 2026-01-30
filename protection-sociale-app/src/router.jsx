import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layout';

// CNSS Pages
import {
  DashboardCNSS,
  DossiersCNSS,
  FicheDossierCNSS,
  AffiliationCNSS,
  HistoriqueCNSS,
  DeclarationsCNSS,
  DetailDeclarationCNSS,
  ControlesCNSS,
  PaiementsCNSS,
  AttestationsCNSS,
  DocumentsCNSS,
  ImportExportCNSS,
} from './pages/cnss';

// Mutuelle Pages
import {
  DashboardMutuelle,
  ContratsMutuelle,
  AdhesionsMutuelle,
  FicheAdhesionMutuelle,
  AyantsDroit,
  FicheAyantDroit,
  DemandesRemboursement,
  NouvelleDemandeRemboursement,
  ValidationRemboursements,
  PaiementsRemboursements,
  BaremesMutuelle,
  DocumentsMutuelle,
  ImportExportMutuelle,
} from './pages/mutuelle';

// Transversales Pages
import {
  DashboardGlobal,
  FicheEmployePS,
  Rapports,
  Notifications,
  HistoriqueAudit,
} from './pages/transversales';

import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Dashboard Global
      { index: true, element: <DashboardGlobal /> },

      // CNSS Routes
      { path: 'cnss', element: <Navigate to="/cnss/dashboard" replace /> },
      { path: 'cnss/dashboard', element: <DashboardCNSS /> },
      { path: 'cnss/dossiers', element: <DossiersCNSS /> },
      { path: 'cnss/dossier/:id', element: <FicheDossierCNSS /> },
      { path: 'cnss/affiliation', element: <AffiliationCNSS /> },
      { path: 'cnss/historique/:employeId', element: <HistoriqueCNSS /> },
      { path: 'cnss/declarations', element: <DeclarationsCNSS /> },
      { path: 'cnss/declaration/:id', element: <DetailDeclarationCNSS /> },
      { path: 'cnss/controles', element: <ControlesCNSS /> },
      { path: 'cnss/paiements', element: <PaiementsCNSS /> },
      { path: 'cnss/attestations', element: <AttestationsCNSS /> },
      { path: 'cnss/documents', element: <DocumentsCNSS /> },
      { path: 'cnss/import-export', element: <ImportExportCNSS /> },

      // Mutuelle Routes
      { path: 'mutuelle', element: <Navigate to="/mutuelle/dashboard" replace /> },
      { path: 'mutuelle/dashboard', element: <DashboardMutuelle /> },
      { path: 'mutuelle/contrats', element: <ContratsMutuelle /> },
      { path: 'mutuelle/adhesions', element: <AdhesionsMutuelle /> },
      { path: 'mutuelle/adhesion/:id', element: <FicheAdhesionMutuelle /> },
      { path: 'mutuelle/ayants-droit', element: <AyantsDroit /> },
      { path: 'mutuelle/ayant-droit/:id', element: <FicheAyantDroit /> },
      { path: 'mutuelle/remboursements', element: <DemandesRemboursement /> },
      { path: 'mutuelle/remboursement/nouveau', element: <NouvelleDemandeRemboursement /> },
      { path: 'mutuelle/validation', element: <ValidationRemboursements /> },
      { path: 'mutuelle/paiements', element: <PaiementsRemboursements /> },
      { path: 'mutuelle/baremes', element: <BaremesMutuelle /> },
      { path: 'mutuelle/documents', element: <DocumentsMutuelle /> },
      { path: 'mutuelle/import-export', element: <ImportExportMutuelle /> },

      // Transversales Routes
      { path: 'employe/protection-sociale', element: <FicheEmployePS /> },
      { path: 'rapports', element: <Rapports /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'audit', element: <HistoriqueAudit /> },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);
