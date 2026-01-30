import { useState } from 'react';

/**
 * Composant DepartmentTree - Arborescence hiérarchique des départements
 * 
 * @param {Object} props
 * @param {Array} props.departments - Liste des départements avec structure hiérarchique
 * @param {number|null} props.selectedId - ID du département sélectionné
 * @param {Function} props.onSelect - Callback appelé lors de la sélection d'un département
 * @param {boolean} props.includeSubDepts - État de la checkbox "Inclure sous-départements"
 * @param {Function} props.onIncludeSubDeptsChange - Callback pour la checkbox
 * @param {string} props.primaryColor - Couleur principale (défaut: #2c767c)
 */
export default function DepartmentTree({
  departments = [],
  selectedId = null,
  onSelect,
  includeSubDepts = true,
  onIncludeSubDeptsChange,
  primaryColor = '#2c767c',
}) {
  const [expandedIds, setExpandedIds] = useState(new Set([1])); // Direction Générale ouverte par défaut

  const toggleExpand = (id, e) => {
    e.stopPropagation();
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

  const handleSelect = (id) => {
    if (onSelect) onSelect(id);
  };

  const renderDepartment = (dept, level = 0) => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedIds.has(dept.id);
    const isSelected = dept.id === selectedId;

    return (
      <div key={dept.id}>
        <div
          className="dept-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            paddingLeft: `${12 + level * 20}px`,
            cursor: 'pointer',
            borderLeft: isSelected ? `3px solid ${primaryColor}` : '3px solid transparent',
            backgroundColor: isSelected ? `${primaryColor}10` : 'transparent',
            transition: 'all 0.2s ease',
            borderRadius: '0 8px 8px 0',
            marginBottom: '2px',
          }}
          onClick={() => handleSelect(dept.id)}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          {/* Bouton expand/collapse */}
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(dept.id, e)}
              style={{
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '14px',
                marginRight: '8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <i className={`bi bi-${isExpanded ? 'dash' : 'plus'}`}></i>
            </button>
          ) : (
            <span style={{ width: '28px' }}></span>
          )}

          {/* Icône département */}
          <i
            className="bi bi-building"
            style={{
              color: isSelected ? primaryColor : '#6b7280',
              marginRight: '10px',
              fontSize: '14px',
            }}
          ></i>

          {/* Nom du département */}
          <span
            style={{
              flex: 1,
              fontSize: '13px',
              fontWeight: isSelected ? '600' : '400',
              color: isSelected ? primaryColor : '#2c3e50',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {dept.nom}
          </span>

          {/* Badge code */}
          {dept.code && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                backgroundColor: isSelected ? `${primaryColor}20` : '#f3f4f6',
                color: isSelected ? primaryColor : '#6b7280',
                borderRadius: '4px',
                fontWeight: '500',
              }}
            >
              {dept.code}
            </span>
          )}
        </div>

        {/* Enfants */}
        {hasChildren && isExpanded && (
          <div className="dept-children">
            {dept.children.map((child) => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="department-tree"
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
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fafafa',
        }}
      >
        <h6
          style={{
            margin: 0,
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <i className="bi bi-diagram-3" style={{ color: primaryColor }}></i>
          Départements
        </h6>

        {/* Checkbox inclure sous-départements */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#6b7280',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={includeSubDepts}
            onChange={(e) => onIncludeSubDeptsChange?.(e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: primaryColor,
              cursor: 'pointer',
            }}
          />
          Inclure les sous-départements
        </label>
      </div>

      {/* Liste des départements */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
        }}
        className="dept-list-scroll"
      >
        {departments.map((dept) => renderDepartment(dept))}
      </div>

      {/* Style scrollbar */}
      <style>{`
        .dept-list-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .dept-list-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .dept-list-scroll::-webkit-scrollbar-thumb {
          background: ${primaryColor};
          border-radius: 3px;
        }
        .dept-list-scroll::-webkit-scrollbar-thumb:hover {
          background: ${primaryColor}dd;
        }
      `}</style>
    </div>
  );
}
