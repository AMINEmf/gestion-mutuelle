import { useState } from 'react';
import { PageHeader, ActionBar, DataTable, ModalForm } from '../../components';
import { baremesMutuelle } from '../../data/mockData';

export default function BaremesMutuelle() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Type de soin', accessor: 'typeSoin' },
    { header: 'Taux remboursement', accessor: 'tauxRemboursement', render: (v) => (
      <span className="badge bg-primary">{v}%</span>
    )},
    { header: 'Plafond annuel', accessor: 'plafond', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Franchise', accessor: 'franchise', render: (v) => v > 0 ? `${v} DH` : <span className="text-muted">Aucune</span> },
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-pencil"></i></button>
        <button className="btn btn-outline-danger"><i className="bi bi-trash"></i></button>
      </div>
    )},
  ];

  const actions = [
    { label: 'Nouveau barème', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Importer barèmes', icon: 'upload', variant: 'outline-primary' },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'typeSoin', label: 'Type de soin', type: 'text', required: true, col: 12 },
    { name: 'tauxRemboursement', label: 'Taux de remboursement (%)', type: 'number', required: true },
    { name: 'plafond', label: 'Plafond annuel (DH)', type: 'number', required: true },
    { name: 'franchise', label: 'Franchise (DH)', type: 'number' },
  ];

  return (
    <div>
      <PageHeader
        title="Barèmes & Plafonds Mutuelle"
        subtitle="Configuration des taux de remboursement et plafonds"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Barèmes' }]}
      />
      <ActionBar actions={actions} />

      <div className="alert alert-info mb-4">
        <i className="bi bi-info-circle me-2"></i>
        Les barèmes définissent les règles de remboursement applicables à chaque type de soin. Toute modification sera effective immédiatement.
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={baremesMutuelle} />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h6 className="mb-0">Résumé des plafonds</h6>
        </div>
        <div className="card-body">
          <div className="row">
            {baremesMutuelle.slice(0, 4).map(b => (
              <div key={b.id} className="col-md-3">
                <div className="border rounded p-3 text-center mb-3">
                  <h6 className="text-muted">{b.typeSoin}</h6>
                  <h4 className="text-primary">{b.tauxRemboursement}%</h4>
                  <small>Plafond: {b.plafond.toLocaleString()} DH</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Nouveau barème"
        fields={formFields}
        onSubmit={(data) => console.log('Barème:', data)}
      />
    </div>
  );
}
