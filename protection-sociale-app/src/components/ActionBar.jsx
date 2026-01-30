const variantStyles = {
  primary: { backgroundColor: '#2c767c', borderColor: '#2c767c', color: '#fff' },
  secondary: { backgroundColor: '#37736f', borderColor: '#37736f', color: '#fff' },
  success: { backgroundColor: '#4caf50', borderColor: '#4caf50', color: '#fff' },
  warning: { backgroundColor: '#ff9800', borderColor: '#ff9800', color: '#fff' },
  danger: { backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' },
  info: { backgroundColor: '#2196f3', borderColor: '#2196f3', color: '#fff' },
  outline: { backgroundColor: 'transparent', borderColor: '#2c767c', color: '#2c767c' }
};

export default function ActionBar({ actions = [] }) {
  return (
    <div className="d-flex gap-2 mb-3 flex-wrap">
      {actions.map((action, index) => {
        const style = variantStyles[action.variant] || variantStyles.primary;
        return (
          <button
            key={index}
            className="btn btn-sm"
            style={{
              ...style,
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              border: `1px solid ${style.borderColor}`
            }}
            onClick={action.onClick}
          >
            {action.icon && <i className={`bi bi-${action.icon} me-1`}></i>}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
