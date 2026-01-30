import { useEffect, useRef } from 'react';

/**
 * Composant SidebarForm - Formulaire en overlay qui slide depuis la droite
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture du formulaire
 * @param {Function} props.onClose - Callback pour fermer le formulaire
 * @param {string} props.title - Titre du formulaire
 * @param {Object} props.employee - Informations de l'employé concerné
 * @param {React.ReactNode} props.children - Contenu du formulaire
 * @param {Function} props.onSubmit - Callback pour soumettre le formulaire
 * @param {string} props.submitLabel - Texte du bouton submit
 * @param {boolean} props.isLoading - État de chargement
 * @param {string} props.primaryColor - Couleur principale
 * @param {string} props.width - Largeur du panneau (défaut: 45%)
 */
export default function SidebarForm({
  isOpen,
  onClose,
  title = "Formulaire",
  employee,
  children,
  onSubmit,
  submitLabel = "Enregistrer",
  isLoading = false,
  primaryColor = '#2c767c',
  width = '45%',
}) {
  const formRef = useRef(null);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Empêcher le scroll du body quand ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getInitials = (nom, prenom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay fond */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <div
        ref={formRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: width,
          minWidth: '400px',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fafafa',
          }}
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#2c3e50';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '14px' }}></i>
          </button>

          {/* Titre */}
          <h5
            style={{
              margin: 0,
              marginBottom: employee ? '16px' : 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <i className="bi bi-pencil-square" style={{ color: primaryColor }}></i>
            {title}
          </h5>

          {/* Info employé */}
          {employee && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: primaryColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginRight: '12px',
                }}
              >
                {getInitials(employee.nom, employee.prenom)}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#2c3e50',
                  }}
                >
                  {employee.prenom} {employee.nom}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{employee.matricule}</span>
                  {employee.poste && (
                    <>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      <span>{employee.poste}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contenu du formulaire */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
            }}
            className="sidebar-form-scroll"
          >
            {children}
          </div>

          {/* Footer avec boutons */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#fafafa',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '10px 24px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: primaryColor,
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.opacity = '1';
              }}
            >
              {isLoading && (
                <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1s linear infinite' }}></i>
              )}
              {submitLabel}
            </button>
          </div>
        </form>

        {/* Styles */}
        <style>{`
          .sidebar-form-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .sidebar-form-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .sidebar-form-scroll::-webkit-scrollbar-thumb {
            background: ${primaryColor};
            border-radius: 3px;
          }
          .sidebar-form-scroll::-webkit-scrollbar-thumb:hover {
            background: ${primaryColor}dd;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
