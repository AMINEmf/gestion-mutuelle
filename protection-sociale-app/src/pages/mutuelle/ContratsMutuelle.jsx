import { useState } from 'react';
import { PageHeader, ActionBar, DataTable, ModalForm } from '../../components';
import { contratsMutuelle } from '../../data/mockData';

export default function ContratsMutuelle() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Code', accessor: 'code' },
    { header: 'Nom du régime', accessor: 'nom' },
    { header: 'Taux couverture', accessor: 'tauxCouverture', render: (v) => `${v}%` },
    { header: 'Plafond annuel', accessor: 'plafondAnnuel', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Cotisation/mois', accessor: 'cotisationMensuelle', render: (v) => `${v} DH` },
    { header: 'Statut', accessor: 'actif', render: (v) => (
      <span className={`badge bg-${v ? 'success' : 'secondary'}`}>{v ? 'Actif' : 'Inactif'}</span>
    )},
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-pencil"></i></button>
        <button className="btn btn-outline-info"><i className="bi bi-eye"></i></button>
      </div>
    )},
  ];

  const actions = [
    { label: 'Nouveau régime', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'nom', label: 'Nom du régime', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'tauxCouverture', label: 'Taux de couverture (%)', type: 'number', required: true },
    { name: 'plafondAnnuel', label: 'Plafond annuel (DH)', type: 'number', required: true },
    { name: 'cotisationMensuelle', label: 'Cotisation mensuelle (DH)', type: 'number', required: true },
    { name: 'actif', label: 'Statut', type: 'select', options: [
      { value: true, label: 'Actif' },
      { value: false, label: 'Inactif' },
    ]},
  ];

  return (
    <div>
      <PageHeader
        title="Contrats / Régimes Mutuelle"
        subtitle="Paramétrage des régimes de mutuelle"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Contrats' }]}
      />
      <ActionBar actions={actions} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={contratsMutuelle} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Nouveau régime de mutuelle"
        fields={formFields}
        onSubmit={(data) => console.log('Régime:', data)}
      />
    </div>
  );
}
