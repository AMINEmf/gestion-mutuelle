export default function Filters({ filters = [], onFilter }) {
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: 'none',
    marginBottom: '16px'
  };

  const inputStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '0.875rem',
    backgroundColor: 'rgb(250, 250, 250)',
    color: '#2c3e50'
  };

  return (
    <div style={cardStyle}>
      <div style={{ padding: '16px 20px' }}>
        <div className="row g-3 align-items-end">
          {filters.map((filter, index) => (
            <div key={index} className="col-md-3 col-sm-6">
              <label style={{ fontWeight: 500, fontSize: '0.875rem', color: '#2c3e50', marginBottom: '4px', display: 'block' }}>
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select 
                  className="form-select form-select-sm" 
                  style={inputStyle}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                >
                  <option value="">Tous</option>
                  {filter.options?.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type || 'text'}
                  className="form-control form-control-sm"
                  style={inputStyle}
                  placeholder={filter.placeholder}
                  onChange={(e) => filter.onChange?.(e.target.value)}
                />
              )}
            </div>
          ))}
          {onFilter && (
            <div className="col-md-3 col-sm-6">
              <button 
                className="btn btn-sm" 
                onClick={onFilter}
                style={{
                  backgroundColor: '#26a69a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px'
                }}
              >
                <i className="bi bi-search me-1"></i>Rechercher
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
