import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const sidebarStyle = {
    width: '13%',
    minWidth: '220px',
    maxWidth: '260px',
    minHeight: '100vh',
    backgroundColor: '#2c767c',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    zIndex: 1000,
    scrollbarColor: '#2c767c #e0e0e0'
  };

  const linkStyle = {
    padding: '14px 20px',
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderLeft: '4px solid #00bcd4',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  };

  return (
    <div className="sidebar" style={sidebarStyle}>
      {/* Header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h5 style={{ color: '#e8f4f8', margin: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="bi bi-heart-pulse"></i>
          Affiliation Mutuelle
        </h5>
      </div>

      {/* Menu unique */}
      <nav style={{ padding: '16px 8px' }}>
        <NavLink
          to="/mutuelle/adhesions"
          style={linkStyle}
        >
          <i className="bi bi-person-plus"></i>
          Affiliations Mutuelle
        </NavLink>
      </nav>

      {/* Footer */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '16px', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
          Module Affiliation Mutuelle
        </div>
      </div>
    </div>
  );
}
