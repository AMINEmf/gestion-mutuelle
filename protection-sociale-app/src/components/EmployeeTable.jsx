import { useState } from 'react';

/**
 * Composant EmployeeTable - Liste des employés avec accordion expandable
 * 
 * @param {Object} props
 * @param {Array} props.employees - Liste des employés à afficher
 * @param {string} props.title - Titre de la section
 * @param {string} props.dataLabel - Label pour les données liées (ex: "déclarations", "remboursements")
 * @param {Function} props.getDataCount - Fonction pour obtenir le nombre de données liées par employé
 * @param {Function} props.onAdd - Callback pour ajouter une entrée
 * @param {Function} props.onEdit - Callback pour modifier une entrée
 * @param {Function} props.onDelete - Callback pour supprimer une entrée
 * @param {Function} props.onExportPDF - Callback export PDF
 * @param {Function} props.onExportExcel - Callback export Excel
 * @param {Function} props.onPrint - Callback imprimer
 * @param {Function} props.renderDetails - Fonction pour rendre les détails d'un employé
 * @param {string} props.primaryColor - Couleur principale
 * @param {string} props.emptyMessage - Message quand aucun employé
 */
export default function EmployeeTable({
  employees = [],
  title = "Employés",
  dataLabel = "entrées",
  getDataCount,
  onAdd,
  onEdit,
  onDelete,
  onExportPDF,
  onExportExcel,
  onPrint,
  renderDetails,
  primaryColor = '#2c767c',
  emptyMessage = "Sélectionnez un département pour afficher les employés",
}) {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getInitials = (nom, prenom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e91e63', '#00bcd4'];
    return colors[id % colors.length];
  };

  return (
    <div
      className="employee-table"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h6
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="bi bi-people" style={{ color: primaryColor }}></i>
            {title}
            <span
              style={{
                fontSize: '12px',
                padding: '2px 8px',
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
                borderRadius: '12px',
                fontWeight: '500',
              }}
            >
              {employees.length}
            </span>
          </h6>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Menu Actions */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#6b7280',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              <i className="bi bi-three-dots-vertical"></i>
              Actions
            </button>

            {showActionsMenu && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                  }}
                  onClick={() => setShowActionsMenu(false)}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e5e7eb',
                    zIndex: 1000,
                    minWidth: '160px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => { onExportPDF?.(); setShowActionsMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      color: '#2c3e50',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <i className="bi bi-file-pdf" style={{ color: '#e74c3c' }}></i>
                    Exporter PDF
                  </button>
                  <button
                    onClick={() => { onExportExcel?.(); setShowActionsMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      color: '#2c3e50',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <i className="bi bi-file-excel" style={{ color: '#2ecc71' }}></i>
                    Exporter Excel
                  </button>
                  <button
                    onClick={() => { onPrint?.(); setShowActionsMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      color: '#2c3e50',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <i className="bi bi-printer" style={{ color: '#6b7280' }}></i>
                    Imprimer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Liste des employés */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
        }}
        className="employee-list-scroll"
      >
        {employees.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9ca3af',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            <i className="bi bi-people" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
            <p style={{ margin: 0, fontSize: '14px' }}>{emptyMessage}</p>
          </div>
        ) : (
          employees.map((emp) => {
            const isExpanded = expandedIds.has(emp.id);
            const dataCount = getDataCount?.(emp) || 0;

            return (
              <div
                key={emp.id}
                style={{
                  marginBottom: '8px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* En-tête employé */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: isExpanded ? '#fafafa' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onClick={() => toggleExpand(emp.id)}
                  onMouseEnter={(e) => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: getAvatarColor(emp.id),
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginRight: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(emp.nom, emp.prenom)}
                  </div>

                  {/* Infos employé */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '2px',
                      }}
                    >
                      {emp.prenom} {emp.nom}
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
                      <span>{emp.matricule}</span>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      <span>{emp.poste}</span>
                    </div>
                  </div>

                  {/* Badge compteur */}
                  {dataCount > 0 && (
                    <span
                      style={{
                        padding: '4px 10px',
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginRight: '12px',
                      }}
                    >
                      {dataCount} {dataLabel}
                    </span>
                  )}

                  {/* Bouton ajouter */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd?.(emp);
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: primaryColor,
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    title="Ajouter"
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>

                  {/* Chevron expand */}
                  <i
                    className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}
                    style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      transition: 'transform 0.2s ease',
                    }}
                  ></i>
                </div>

                {/* Détails expandés */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid #e5e7eb',
                      backgroundColor: '#fafafa',
                      padding: '16px',
                    }}
                  >
                    {renderDetails ? (
                      renderDetails(emp, { onEdit, onDelete, primaryColor })
                    ) : (
                      <div style={{ color: '#6b7280', fontSize: '13px' }}>
                        Aucun détail disponible
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Style scrollbar */}
      <style>{`
        .employee-list-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .employee-list-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .employee-list-scroll::-webkit-scrollbar-thumb {
          background: ${primaryColor};
          border-radius: 3px;
        }
        .employee-list-scroll::-webkit-scrollbar-thumb:hover {
          background: ${primaryColor}dd;
        }
      `}</style>
    </div>
  );
}
