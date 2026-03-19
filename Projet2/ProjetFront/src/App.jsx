import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navigation from './Acceuil/Navigation';

import Dashboard from './Acceuil/Dashboard';
import DepartementManager from './Zakaria/Employe/DepartementManager';
import CNSS from './Zakaria/cnss';
import CNSSDashboard from './Zakaria/cnss/CNSSDashboard';
import DeclarationsCNSS from './Zakaria/cnss/DeclarationsCNSS';
import DossierCNSS from './Zakaria/cnss/DossierCNSS';
import EmpHistorique from './Zakaria/EmpHistorique.jsx';
import CareerDashboard from './Zakaria/CarriereFormation/CareerDashboard';
import PositionsGrades from './Zakaria/CarriereFormation/PositionsGrades';
import TrainingDashboard from './Zakaria/CarriereFormation/TrainingDashboard';
import CarrieresPage from './Zakaria/CarriereFormation/CarrieresPage';
import FormationsPage from './Zakaria/CarriereFormation/FormationsPage';
import FormationParticipantsPage from './Zakaria/CarriereFormation/FormationParticipantsPage';
import DemandeMobilitePage from './Zakaria/CarriereFormation/DemandeMobilitePage';
import DemandeFormationPage from './Zakaria/CarriereFormation/DemandeFormationPage';


import { OpenProvider } from './Acceuil/OpenProvider.jsx';





// HeaderProvider import for global header state
import { HeaderProvider } from './Acceuil/HeaderContext';
import Societe from './Zakaria/Societe/Societe.jsx';
import Login from './Login/Login.jsx';

const App = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== '/login';
  return (
    <AuthProvider>
      <OpenProvider>
        <HeaderProvider>
          {showNavigation && <Navigation />}
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/login" element={<Login />} />

            <Route path="/employes" element={<DepartementManager />} />
            <Route path="/cnss" element={<CNSS />} />
            <Route path="/cnss/dashboard" element={<CNSSDashboard />} />
            <Route path="/cnss/declarations" element={<DeclarationsCNSS />} />
            <Route path="/cnss/dossiers" element={<DossierCNSS />} />

            <Route path="/emphistorique" element={<EmpHistorique />} />

            <Route path="/carrieres-formations/dashboard-carrieres" element={<CareerDashboard />} />
            <Route path="/carrieres-formations/carrieres" element={<CarrieresPage />} />
            <Route path="/carrieres-formations/postes-grades" element={<PositionsGrades />} />
            <Route path="/carrieres-formations/dashboard-formations" element={<TrainingDashboard />} />
            <Route path="/carrieres-formations/formations" element={<FormationsPage />} />
            <Route path="/carrieres-formations/formations/:id/participants" element={<FormationParticipantsPage />} />
            <Route path="/carrieres-formations/demandes-mobilite" element={<DemandeMobilitePage />} />
            <Route path="/carrieres-formations/demandes-formation" element={<DemandeFormationPage />} />





            <Route path="/societes" element={<Societe />} />




          </Routes>
        </HeaderProvider>
      </OpenProvider>
    </AuthProvider>
  );
};

export default App;
