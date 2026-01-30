import { useState } from 'react';

export default function ModalForm({ show, onClose, title, fields = [], onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({});
    onClose();
  };

  if (!show) return null;

  const modalStyle = {
    backgroundColor: 'rgba(0,0,0,0.5)',
    animation: 'fadeIn 0.3s ease'
  };

  const contentStyle = {
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    border: 'none',
    maxWidth: '60%',
    margin: '5vh auto'
  };

  const headerStyle = {
    borderBottom: '1px solid #e0e0e0',
    padding: '16px 24px',
    backgroundColor: '#f9fafb'
  };

  const bodyStyle = {
    padding: '24px',
    maxHeight: '60vh',
    overflowY: 'auto',
    backgroundColor: 'rgb(250, 250, 250)'
  };

  const footerStyle = {
    borderTop: '1px solid #e0e0e0',
    padding: '16px 24px',
    backgroundColor: '#f9fafb'
  };

  const inputStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '0.875rem',
    backgroundColor: 'rgb(250, 250, 250)',
    color: '#2c3e50'
  };

  return (
    <div className="modal show d-block" style={modalStyle}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '60%' }}>
        <div className="modal-content" style={contentStyle}>
          <div className="modal-header" style={headerStyle}>
            <h5 className="modal-title" style={{ color: '#2c3e50', fontWeight: 600 }}>{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              style={{ opacity: 0.5 }}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={bodyStyle}>
              <div className="row g-3">
                {fields.map((field, index) => (
                  <div key={index} className={`col-md-${field.col || 6}`}>
                    <label className="form-label" style={{ fontWeight: 500, fontSize: '0.875rem', color: '#2c3e50' }}>
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        className="form-select"
                        style={inputStyle}
                        required={field.required}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      >
                        <option value="">Sélectionner...</option>
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="form-control"
                        style={inputStyle}
                        rows={3}
                        required={field.required}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        className="form-control"
                        style={inputStyle}
                        required={field.required}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer" style={footerStyle}>
              <button 
                type="button" 
                className="btn" 
                onClick={onClose}
                style={{ 
                  backgroundColor: '#f1f5f9', 
                  color: '#4b5563', 
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px'
                }}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn"
                style={{ 
                  backgroundColor: '#2c767c', 
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px'
                }}
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
