import { useMemo, useState } from 'react';
import DepartmentTree from './DepartmentTree';
import EmployeeTable from './EmployeeTable';
import SidebarForm from './SidebarForm';
import { getSubDepartmentIds } from '../data/departements';

/**
 * Composant DeptEmployeeLayout - Layout réutilisable Département → Employé
 * 
 * @param {Object} props
 * @param {Array} props.departments - Liste des départements
 * @param {Array} props.employees - Liste des employés avec departement_id
 * @param {string} props.title - Titre de la page
 * @param {string} props.dataLabel - Label des données (ex: "déclarations")
 * @param {Function} props.getDataCount - Fonction pour compter les données par employé
 * @param {Function} props.renderDetails - Fonction pour rendre les détails employé
 * @param {Function} props.renderForm - Fonction pour rendre le formulaire
 * @param {string} props.formTitle - Titre du formulaire
 * @param {Function} props.onSubmit - Callback de soumission
 * @param {string} props.primaryColor - Couleur principale
 */
export default function DeptEmployeeLayout({
  departments = [],
  employees = [],
  title = "Gestion",
  dataLabel = "entrées",
  getDataCount,
  renderDetails,
  renderForm,
  formTitle = "Nouveau",
  onSubmit,
  onExportPDF,
  onExportExcel,
  onPrint,
  primaryColor = '#2c767c',
}) {
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [includeSubDepts, setIncludeSubDepts] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingData, setEditingData] = useState(null);

  // Filtrer les employés par département sélectionné
  const filteredEmployees = useMemo(() => {
    if (!selectedDeptId) return [];

    if (includeSubDepts) {
      const subIds = getSubDepartmentIds(departments, selectedDeptId);
      return employees.filter((emp) => subIds.includes(emp.departement_id));
    }
    return employees.filter((emp) => emp.departement_id === selectedDeptId);
  }, [selectedDeptId, employees, includeSubDepts, departments]);

  const handleAdd = (employee) => {
    setSelectedEmployee(employee);
    setEditingData(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee, data) => {
    setSelectedEmployee(employee);
    setEditingData(data);
    setIsFormOpen(true);
  };

  const handleDelete = (employee, data) => {
    // Logique de suppression (à implémenter via callback)
    console.log('Delete', employee, data);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
    setEditingData(null);
  };

  const handleFormSubmit = () => {
    onSubmit?.(selectedEmployee, editingData);
    handleFormClose();
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        height: 'calc(100vh - 140px)',
        minHeight: '500px',
      }}
    >
      {/* Colonne gauche - Départements (20%) */}
      <div style={{ width: '22%', minWidth: '250px', maxWidth: '320px' }}>
        <DepartmentTree
          departments={departments}
          selectedId={selectedDeptId}
          onSelect={setSelectedDeptId}
          includeSubDepts={includeSubDepts}
          onIncludeSubDeptsChange={setIncludeSubDepts}
          primaryColor={primaryColor}
        />
      </div>

      {/* Colonne droite - Employés (80%) */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <EmployeeTable
          employees={filteredEmployees}
          title={title}
          dataLabel={dataLabel}
          getDataCount={getDataCount}
          onAdd={handleAdd}
          onEdit={(emp, data) => handleEdit(emp, data)}
          onDelete={(emp, data) => handleDelete(emp, data)}
          onExportPDF={onExportPDF}
          onExportExcel={onExportExcel}
          onPrint={onPrint}
          renderDetails={(emp, callbacks) =>
            renderDetails?.(emp, { ...callbacks, onEdit: (data) => handleEdit(emp, data), onDelete: (data) => handleDelete(emp, data) })
          }
          primaryColor={primaryColor}
          emptyMessage={
            selectedDeptId
              ? "Aucun employé dans ce département"
              : "Sélectionnez un département pour afficher les employés"
          }
        />
      </div>

      {/* Formulaire latéral */}
      <SidebarForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingData ? `Modifier ${formTitle}` : `Nouveau ${formTitle}`}
        employee={selectedEmployee}
        onSubmit={handleFormSubmit}
        submitLabel={editingData ? "Mettre à jour" : "Enregistrer"}
        primaryColor={primaryColor}
      >
        {renderForm?.({ employee: selectedEmployee, data: editingData, primaryColor })}
      </SidebarForm>
    </div>
  );
}
