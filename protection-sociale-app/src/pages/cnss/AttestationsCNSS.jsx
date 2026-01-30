import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { attestationsCNSS, employes } from '../../data/mockData';

export default function AttestationsCNSS() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Type', accessor: 'type' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Date génération', accessor: 'dateGeneration' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Générée' ? 'success' : 'warning'}`}>{v}</span>
    )},
    { header: 'Fichier', accessor: 'fichier', render: (v) => v ? (
      <a href="#" className="btn btn-sm btn-outline-primary"><i className="bi bi-download me-1"></i>{v}</a>
    ) : '-' },
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-eye"></i></button>
        <button className="btn btn-outline-success"><i className="bi bi-printer"></i></button>
      </div>
    )},
  ];

  const filters = [
    { label: 'Type', type: 'select', options: [
      { value: 'affiliation', label: 'Attestation d\'affiliation' },
      { value: 'salaire', label: 'Attestation de salaire' },
      { value: 'carriere', label: 'Relevé de carrière' },
    ]},
    { label: 'Employé', type: 'text', placeholder: 'Rechercher...' },
  ];

  const actions = [
    { label: 'Générer attestation', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Demande groupée', icon: 'people', variant: 'outline-primary' },
  ];

  const formFields = [
    { name: 'employeId', label: 'Employé', type: 'select', required: true, col: 12, options: employes.map(e => ({ value: e.id, label: `${e.nom} ${e.prenom}` })) },
    { name: 'type', label: 'Type d\'attestation', type: 'select', required: true, options: [
      { value: 'affiliation', label: 'Attestation d\'affiliation' },
      { value: 'salaire', label: 'Attestation de salaire' },
      { value: 'carriere', label: 'Relevé de carrière' },
    ]},
    { name: 'periode', label: 'Période (si applicable)', type: 'month' },
  ];

  return (
    <div>
      <PageHeader
        title="Attestations CNSS"
        subtitle="Génération et téléchargement des attestations CNSS"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Attestations' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={attestationsCNSS} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Générer une attestation"
        fields={formFields}
        onSubmit={(data) => console.log('Attestation:', data)}
      />
    </div>
  );
}
