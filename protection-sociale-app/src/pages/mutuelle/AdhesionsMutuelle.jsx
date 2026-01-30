import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { adhesionsMutuelle, employes, contratsMutuelle } from '../../data/mockData';

export default function AdhesionsMutuelle() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getData = () => {
    return adhesionsMutuelle.map(a => {
      const emp = employes.find(e => e.id === a.employeId);
      const contrat = contratsMutuelle.find(c => c.id === a.contratId);
      return { ...a, employe: emp ? `${emp.nom} ${emp.prenom}` : 'N/A', matricule: emp?.matricule, regime: contrat?.nom };
    });
  };

  const columns = [
    { header: 'Matricule', accessor: 'matricule' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Régime', accessor: 'regime' },
    { header: 'Date adhésion', accessor: 'dateAdhesion' },
    { header: 'Bénéficiaires', accessor: 'nbBeneficiaires' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Actif' ? 'success' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: (id) => (
      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/mutuelle/adhesion/${id}`)}>
        <i className="bi bi-eye"></i>
      </button>
    )},
  ];

  const filters = [
    { label: 'Rechercher', type: 'text', placeholder: 'Nom, matricule...' },
    { label: 'Régime', type: 'select', options: contratsMutuelle.map(c => ({ value: c.id, label: c.nom })) },
    { label: 'Statut', type: 'select', options: [
      { value: 'Actif', label: 'Actif' },
      { value: 'Suspendu', label: 'Suspendu' },
    ]},
  ];

  const actions = [
    { label: 'Nouvelle adhésion', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'employeId', label: 'Employé', type: 'select', required: true, col: 12, options: employes.map(e => ({ value: e.id, label: `${e.matricule} - ${e.nom} ${e.prenom}` })) },
    { name: 'contratId', label: 'Régime', type: 'select', required: true, options: contratsMutuelle.map(c => ({ value: c.id, label: c.nom })) },
    { name: 'dateAdhesion', label: 'Date d\'adhésion', type: 'date', required: true },
  ];

  return (
    <div>
      <PageHeader
        title="Adhésions Mutuelle"
        subtitle="Liste des adhésions à la mutuelle"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Adhésions' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={getData()} onRowClick={(row) => navigate(`/mutuelle/adhesion/${row.id}`)} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle adhésion mutuelle"
        fields={formFields}
        onSubmit={(data) => console.log('Adhésion:', data)}
      />
    </div>
  );
}
