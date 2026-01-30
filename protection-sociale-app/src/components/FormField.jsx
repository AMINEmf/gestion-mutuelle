/**
 * Composant FormField - Champ de formulaire réutilisable avec style cohérent
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [],
  rows = 3,
  error,
  helpText,
  disabled = false,
  primaryColor = '#2c767c',
}) {
  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: `1px solid ${error ? '#e74c3c' : '#e5e7eb'}`,
    borderRadius: '6px',
    backgroundColor: disabled ? '#f9fafb' : '#ffffff',
    color: '#2c3e50',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 3px ${primaryColor}20`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? '#e74c3c' : '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            style={{ ...inputStyle, cursor: disabled ? 'not-allowed' : 'pointer' }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="">{placeholder || 'Sélectionner...'}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );

      case 'checkbox':
        return (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <input
              type="checkbox"
              name={name}
              checked={!!value}
              onChange={onChange}
              disabled={disabled}
              style={{
                width: '18px',
                height: '18px',
                accentColor: primaryColor,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            />
            <span style={{ fontSize: '14px', color: '#2c3e50' }}>{label}</span>
          </label>
        );

      case 'file':
        return (
          <div
            style={{
              border: '2px dashed #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.backgroundColor = `${primaryColor}05`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          >
            <input
              type="file"
              name={name}
              onChange={onChange}
              disabled={disabled}
              style={{ display: 'none' }}
              id={`file-${name}`}
            />
            <label
              htmlFor={`file-${name}`}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <i className="bi bi-cloud-upload" style={{ fontSize: '24px', color: primaryColor }}></i>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {placeholder || 'Cliquez pour sélectionner un fichier'}
              </span>
            </label>
          </div>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );
    }
  };

  // Pour checkbox, le label est dans l'input
  if (type === 'checkbox') {
    return (
      <div style={{ marginBottom: '16px' }}>
        {renderInput()}
        {error && (
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#e74c3c' }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      {renderInput()}
      {helpText && !error && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: '#9ca3af' }}>
          {helpText}
        </div>
      )}
      {error && (
        <div style={{ marginTop: '4px', fontSize: '12px', color: '#e74c3c' }}>
          {error}
        </div>
      )}
    </div>
  );
}
