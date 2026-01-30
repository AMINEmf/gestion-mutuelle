import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { documentsCNSS } from '../../data/mockData';

export default function DocumentsCNSS() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Nom du document', accessor: 'nom' },
    { header: 'Type', accessor: 'type' },
    { header: 'Catégorie', accessor: 'categorie', render: (v) => <span className="badge bg-secondary">{v}</span> },
    { header: 'Date upload', accessor: 'dateUpload' },
    { header: 'Taille', accessor: 'taille' },
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-eye"></i></button>
        <button className="btn btn-outline-success"><i className="bi bi-download"></i></button>
        <button className="btn btn-outline-danger"><i className="bi bi-trash"></i></button>
      </div>
    )},
  ];

  const filters = [
    { label: 'Catégorie', type: 'select', options: [
      { value: 'Déclarations', label: 'Déclarations' },
      { value: 'Paiements', label: 'Paiements' },
      { value: 'Affiliations', label: 'Affiliations' },
      { value: 'Attestations', label: 'Attestations' },
    ]},
    { label: 'Rechercher', type: 'text', placeholder: 'Nom du document...' },
  ];

  const actions = [
    { label: 'Uploader document', icon: 'upload', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Créer dossier', icon: 'folder-plus', variant: 'outline-primary' },
  ];

  const formFields = [
    { name: 'nom', label: 'Nom du document', type: 'text', required: true, col: 12 },
    { name: 'categorie', label: 'Catégorie', type: 'select', required: true, options: [
      { value: 'Déclarations', label: 'Déclarations' },
      { value: 'Paiements', label: 'Paiements' },
      { value: 'Affiliations', label: 'Affiliations' },
      { value: 'Attestations', label: 'Attestations' },
    ]},
    { name: 'fichier', label: 'Fichier', type: 'file', required: true },
    { name: 'description', label: 'Description', type: 'textarea', col: 12 },
  ];

  return (
    <div>
      <PageHeader
        title="Centre Documents CNSS"
        subtitle="Gestion électronique des documents CNSS (GED)"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Documents' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-folder text-primary fs-1"></i>
              <h6 className="mt-2">Déclarations</h6>
              <small className="text-muted">12 fichiers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-folder text-success fs-1"></i>
              <h6 className="mt-2">Paiements</h6>
              <small className="text-muted">8 fichiers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-folder text-warning fs-1"></i>
              <h6 className="mt-2">Affiliations</h6>
              <small className="text-muted">5 fichiers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <i className="bi bi-folder text-info fs-1"></i>
              <h6 className="mt-2">Attestations</h6>
              <small className="text-muted">15 fichiers</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Documents récents</h6>
        </div>
        <div className="card-body">
          <DataTable columns={columns} data={documentsCNSS} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Uploader un document"
        fields={formFields}
        onSubmit={(data) => console.log('Document:', data)}
      />
    </div>
  );
}
