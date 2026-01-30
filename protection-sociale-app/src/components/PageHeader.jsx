import { Link } from 'react-router-dom';

export default function PageHeader({ title, subtitle, breadcrumb = [] }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb" style={{ marginBottom: '8px' }}>
          <li className="breadcrumb-item">
            <Link to="/" style={{ color: '#2c767c', textDecoration: 'none' }}>Accueil</Link>
          </li>
          {breadcrumb.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}`}
              style={{ color: index === breadcrumb.length - 1 ? '#6b7280' : 'inherit' }}
            >
              {index === breadcrumb.length - 1 ? (
                item.label
              ) : (
                <Link to={item.path} style={{ color: '#2c767c', textDecoration: 'none' }}>{item.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h2 style={{ color: '#2c3e50', marginBottom: '4px', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.025em' }}>{title}</h2>
      {subtitle && <p style={{ color: '#6b7280', margin: 0 }}>{subtitle}</p>}
    </div>
  );
}
