import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { documentsMutuelle, employes } from '../../data/mockData';

export default function DocumentsMutuelle() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Type', accessor: 'type', render: (v) => (
      <span className={`badge bg-${v === 'Carte' ? 'primary' : v === 'Attestation' ? 'success' : 'info'}`}>{v}</span>
    )},
    { header: 'Date génération', accessor: 'dateGeneration' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Active' || v === 'Généré' ? 'success' : 'secondary'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-eye"></i></button>
        <button className="btn btn-outline-success"><i className="bi bi-download"></i></button>
        <button className="btn btn-outline-secondary"><i className="bi bi-printer"></i></button>
      </div>
    )},
  ];

  const actions = [
    { label: 'Générer carte', icon: 'credit-card', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Générer attestation', icon: 'file-earmark-check', variant: 'success' },
    { label: 'Bordereau groupé', icon: 'files', variant: 'outline-info' },
  ];

  const filters = [
    { label: 'Type', type: 'select', options: [
      { value: 'Carte', label: 'Carte mutuelle' },
      { value: 'Attestation', label: 'Attestation' },
      { value: 'Bordereau', label: 'Bordereau' },
    ]},
    { label: 'Rechercher', type: 'text', placeholder: 'Nom du document...' },
  ];

  const formFields = [
    { name: 'employeId', label: 'Employé', type: 'select', required: true, col: 12, options: employes.map(e => ({ value: e.id, label: `${e.nom} ${e.prenom}` })) },
    { name: 'type', label: 'Type de document', type: 'select', required: true, options: [
      { value: 'Carte', label: 'Carte mutuelle' },
      { value: 'Attestation', label: 'Attestation d\'adhésion' },
    ]},
    { name: 'inclureBeneficiaires', label: 'Inclure bénéficiaires', type: 'select', options: [
      { value: 'oui', label: 'Oui' },
      { value: 'non', label: 'Non' },
    ]},
  ];

  return (
    <div>
      <PageHeader
        title="Documents Mutuelle"
        subtitle="Cartes, attestations et bordereaux"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Documents' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-credit-card-2-front text-primary fs-1"></i>
              <h6 className="mt-2">Cartes Mutuelle</h6>
              <p className="text-muted mb-2">Générer les cartes adhérents</p>
              <button className="btn btn-sm btn-primary">Générer</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-file-earmark-check text-success fs-1"></i>
              <h6 className="mt-2">Attestations</h6>
              <p className="text-muted mb-2">Attestations d'adhésion</p>
              <button className="btn btn-sm btn-success">Générer</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-files text-info fs-1"></i>
              <h6 className="mt-2">Bordereaux</h6>
              <p className="text-muted mb-2">Bordereaux de remboursement</p>
              <button className="btn btn-sm btn-info">Générer</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Documents récents</h6>
        </div>
        <div className="card-body">
          <DataTable columns={columns} data={documentsMutuelle} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Générer un document"
        fields={formFields}
        onSubmit={(data) => console.log('Document:', data)}
      />
    </div>
  );
}
