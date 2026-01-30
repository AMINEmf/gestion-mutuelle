const colorMap = {
  primary: { bg: '#00695c', light: 'rgba(0, 105, 92, 0.1)', text: '#00695c' },
  secondary: { bg: '#26a69a', light: 'rgba(38, 166, 154, 0.1)', text: '#26a69a' },
  success: { bg: '#4caf50', light: 'rgba(76, 175, 80, 0.1)', text: '#4caf50' },
  warning: { bg: '#ff9800', light: 'rgba(255, 152, 0, 0.1)', text: '#ff9800' },
  danger: { bg: '#f44336', light: 'rgba(244, 67, 54, 0.1)', text: '#f44336' },
  info: { bg: '#2196f3', light: 'rgba(33, 150, 243, 0.1)', text: '#2196f3' },
  cyan: { bg: '#00bcd4', light: 'rgba(0, 188, 212, 0.1)', text: '#00bcd4' }
};

export default function StatCard({ title, value, icon, color = 'primary', subtitle }) {
  const colors = colorMap[color] || colorMap.primary;

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: 'none',
    transition: 'transform 0.2s ease',
    height: '100%'
  };

  const iconContainerStyle = {
    backgroundColor: colors.light,
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className="stat-card" style={cardStyle}>
      <div style={{ padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 style={{ color: '#6b7280', marginBottom: '8px', fontSize: '0.875rem' }}>{title}</h6>
            <h3 style={{ color: colors.text, marginBottom: '4px', fontWeight: 700, fontSize: '1.75rem' }}>{value}</h3>
            {subtitle && <small style={{ color: '#6b7280' }}>{subtitle}</small>}
          </div>
          {icon && (
            <div style={iconContainerStyle}>
              <i className={`bi bi-${icon}`} style={{ color: colors.text, fontSize: '1.5rem' }}></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
