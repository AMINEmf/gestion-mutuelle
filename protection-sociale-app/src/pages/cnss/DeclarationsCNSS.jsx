import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { declarationsCNSS } from '../../data/mockData';

export default function DeclarationsCNSS() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { header: 'Période', accessor: 'periode' },
    { header: 'Date déclaration', accessor: 'dateDeclaration' },
    { header: 'Nb Employés', accessor: 'nbEmployes' },
    { header: 'Masse salariale', accessor: 'montantBrut', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Cotisation Patronale', accessor: 'cotisationPatronale', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Cotisation Salariale', accessor: 'cotisationSalariale', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Total', accessor: 'id', render: (_, row) => `${(row.cotisationPatronale + row.cotisationSalariale).toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: (id) => (
      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/cnss/declaration/${id}`)}>
        <i className="bi bi-eye"></i>
      </button>
    )},
  ];

  const filters = [
    { label: 'Année', type: 'select', options: [
      { value: '2026', label: '2026' },
      { value: '2025', label: '2025' },
      { value: '2024', label: '2024' },
    ]},
    { label: 'Statut', type: 'select', options: [
      { value: 'Payée', label: 'Payée' },
      { value: 'Validée', label: 'Validée' },
      { value: 'En préparation', label: 'En préparation' },
    ]},
  ];

  const actions = [
    { label: 'Nouvelle déclaration', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Générer déclaration mois', icon: 'calendar', variant: 'success' },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'periode', label: 'Période', type: 'month', required: true },
    { name: 'type', label: 'Type de déclaration', type: 'select', required: true, options: [
      { value: 'mensuelle', label: 'Mensuelle' },
      { value: 'trimestrielle', label: 'Trimestrielle' },
    ]},
  ];

  return (
    <div>
      <PageHeader
        title="Déclarations CNSS"
        subtitle="Liste des déclarations CNSS par période"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Déclarations' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={declarationsCNSS} onRowClick={(row) => navigate(`/cnss/declaration/${row.id}`)} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle déclaration CNSS"
        fields={formFields}
        onSubmit={(data) => console.log('Déclaration:', data)}
      />
    </div>
  );
}
