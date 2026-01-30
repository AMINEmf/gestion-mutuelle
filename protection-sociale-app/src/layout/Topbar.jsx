import { notifications } from '../data/mockData';

export default function Topbar() {
  const unreadCount = notifications.filter(n => !n.lue).length;

  const topbarStyle = {
    backgroundColor: '#f9fafb',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: '0 24px',
    height: '64px'
  };

  const searchStyle = {
    width: '400px',
    backgroundColor: 'rgba(0,0,0,0.05)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#2c3e50'
  };

  const avatarStyle = {
    width: '36px',
    height: '36px',
    backgroundColor: '#00695c',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <nav className="navbar navbar-expand" style={topbarStyle}>
      <div className="container-fluid">
        <span style={{ color: '#2c3e50', fontWeight: 600, fontSize: '1.1rem' }}>
          Module Protection Sociale RH
        </span>

        {/* Search Bar */}
        <div className="d-none d-md-block mx-4">
          <div className="position-relative">
            <i className="bi bi-search position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}></i>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              style={{ ...searchStyle, paddingLeft: '40px' }}
              onFocus={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
              onBlur={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="dropdown">
            <button
              className="btn btn-link position-relative"
              type="button"
              data-bs-toggle="dropdown"
              style={{ color: '#2c3e50' }}
            >
              <i className="bi bi-bell fs-5"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: '#f44336' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{ width: '320px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <li className="dropdown-header" style={{ color: '#2c3e50', fontWeight: 600 }}>Notifications</li>
              {notifications.slice(0, 5).map((notif) => (
                <li key={notif.id}>
                  <a className="dropdown-item" href="#" style={{ backgroundColor: !notif.lue ? '#f9fafb' : 'transparent', padding: '12px 16px' }}>
                    <small style={{ color: '#6b7280' }}>{notif.dateCreation}</small>
                    <div style={{ color: '#2c3e50', fontWeight: 500 }}>{notif.titre}</div>
                  </a>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item text-center" href="/notifications" style={{ color: '#00695c', fontWeight: 500 }}>Voir toutes les notifications</a></li>
            </ul>
          </div>

          {/* User */}
          <div className="dropdown">
            <button
              className="btn btn-link d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
              style={{ color: '#2c3e50', textDecoration: 'none' }}
            >
              <div style={avatarStyle}>
                <i className="bi bi-person"></i>
              </div>
              <span className="ms-2 d-none d-md-inline">Admin RH</span>
              <i className="bi bi-chevron-down ms-1"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <li><a className="dropdown-item" href="#" style={{ padding: '10px 16px' }}><i className="bi bi-person me-2" style={{ color: '#00695c' }}></i>Mon profil</a></li>
              <li><a className="dropdown-item" href="#" style={{ padding: '10px 16px' }}><i className="bi bi-gear me-2" style={{ color: '#00695c' }}></i>Paramètres</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#" style={{ padding: '10px 16px', color: '#f44336' }}><i className="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
