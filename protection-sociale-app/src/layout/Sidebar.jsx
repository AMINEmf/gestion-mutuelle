import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const [cnssOpen, setCnssOpen] = useState(true);
  const [mutuelleOpen, setMutuelleOpen] = useState(false);
  const [transOpen, setTransOpen] = useState(false);

  const menuItems = {
    cnss: [
      { path: '/cnss/dashboard', label: 'Dashboard CNSS', icon: 'speedometer2' },
      { path: '/cnss/dossiers', label: 'Dossiers CNSS', icon: 'folder' },
      { path: '/cnss/affiliation', label: 'Affiliation / Immatriculation', icon: 'person-plus' },
      { path: '/cnss/declarations', label: 'Déclarations CNSS', icon: 'file-earmark-text' },
      { path: '/cnss/controles', label: 'Contrôles & Anomalies', icon: 'exclamation-triangle' },
      { path: '/cnss/paiements', label: 'Paiements & Échéancier', icon: 'credit-card' },
      { path: '/cnss/attestations', label: 'Attestations CNSS', icon: 'file-earmark-check' },
      { path: '/cnss/documents', label: 'Centre Documents', icon: 'archive' },
      { path: '/cnss/import-export', label: 'Import / Export', icon: 'arrow-left-right' },
    ],
    mutuelle: [
      { path: '/mutuelle/dashboard', label: 'Dashboard Mutuelle', icon: 'speedometer2' },
      { path: '/mutuelle/contrats', label: 'Contrats / Régimes', icon: 'file-earmark-ruled' },
      { path: '/mutuelle/adhesions', label: 'Adhésions Mutuelle', icon: 'people' },
      { path: '/mutuelle/ayants-droit', label: 'Ayants Droit', icon: 'person-heart' },
      { path: '/mutuelle/remboursements', label: 'Demandes Remboursement', icon: 'receipt' },
      { path: '/mutuelle/remboursement/nouveau', label: 'Nouvelle Demande', icon: 'plus-circle' },
      { path: '/mutuelle/validation', label: 'Validation Remboursements', icon: 'check-circle' },
      { path: '/mutuelle/paiements', label: 'Paiements Remboursements', icon: 'cash-stack' },
      { path: '/mutuelle/baremes', label: 'Barèmes & Plafonds', icon: 'sliders' },
      { path: '/mutuelle/documents', label: 'Documents Mutuelle', icon: 'files' },
      { path: '/mutuelle/import-export', label: 'Import / Export', icon: 'arrow-left-right' },
    ],
    transversales: [
      { path: '/', label: 'Dashboard Global', icon: 'house' },
      { path: '/employe/protection-sociale', label: 'Fiche Employé PS', icon: 'person-badge' },
      { path: '/rapports', label: 'Rapports', icon: 'bar-chart' },
      { path: '/notifications', label: 'Notifications & Relances', icon: 'bell' },
      { path: '/audit', label: 'Historique & Audit', icon: 'clock-history' },
    ],
  };

  const sidebarStyle = {
    width: '260px',
    minHeight: '100vh',
    backgroundColor: '#00695c',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    zIndex: 1000
  };

  const menuToggleStyle = {
    background: 'transparent',
    border: 'none',
    color: '#e8f4f8',
    width: '100%',
    padding: '12px 16px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'all 0.2s ease'
  };

  const submenuStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderLeft: '3px solid rgba(255, 255, 255, 0.2)',
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  return (
    <div className="sidebar" style={sidebarStyle}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h5 style={{ color: '#e8f4f8', margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="bi bi-shield-check"></i>
          Protection Sociale
        </h5>
      </div>

      <nav style={{ padding: '8px' }}>
        {/* Transversales */}
        <div style={{ marginBottom: '4px' }}>
          <button
            style={menuToggleStyle}
            onClick={() => setTransOpen(!transOpen)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
              e.target.style.borderLeft = '4px solid #fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderLeft = 'none';
            }}
          >
            <span><i className="bi bi-globe me-2"></i>Transversales</span>
            <i className={`bi bi-chevron-${transOpen ? 'down' : 'right'}`}></i>
          </button>
          {transOpen && (
            <ul style={submenuStyle}>
              {menuItems.transversales.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    style={({ isActive }) => ({
                      padding: '8px 16px 8px 32px',
                      color: isActive ? '#ffffff' : '#b8dce5',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      borderLeft: isActive ? '4px solid #00bcd4' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    })}
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CNSS */}
        <div style={{ marginBottom: '4px' }}>
          <button
            style={menuToggleStyle}
            onClick={() => setCnssOpen(!cnssOpen)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
              e.target.style.borderLeft = '4px solid #fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderLeft = 'none';
            }}
          >
            <span><i className="bi bi-building me-2"></i>CNSS</span>
            <i className={`bi bi-chevron-${cnssOpen ? 'down' : 'right'}`}></i>
          </button>
          {cnssOpen && (
            <ul style={submenuStyle}>
              {menuItems.cnss.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    style={({ isActive }) => ({
                      padding: '8px 16px 8px 32px',
                      color: isActive ? '#ffffff' : '#b8dce5',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      borderLeft: isActive ? '4px solid #00bcd4' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    })}
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mutuelle */}
        <div style={{ marginBottom: '4px' }}>
          <button
            style={menuToggleStyle}
            onClick={() => setMutuelleOpen(!mutuelleOpen)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0,0,0,0.1)';
              e.target.style.borderLeft = '4px solid #fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderLeft = 'none';
            }}
          >
            <span><i className="bi bi-heart-pulse me-2"></i>Mutuelle</span>
            <i className={`bi bi-chevron-${mutuelleOpen ? 'down' : 'right'}`}></i>
          </button>
          {mutuelleOpen && (
            <ul style={submenuStyle}>
              {menuItems.mutuelle.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    style={({ isActive }) => ({
                      padding: '8px 16px 8px 32px',
                      color: isActive ? '#ffffff' : '#b8dce5',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      borderLeft: isActive ? '4px solid #00bcd4' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    })}
                  >
                    <i className={`bi bi-${item.icon}`}></i>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
