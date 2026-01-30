import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { paiementsCNSS } from '../../data/mockData';

export default function PaiementsCNSS() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Période', accessor: 'periode' },
    { header: 'Montant', accessor: 'montant', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Échéance', accessor: 'dateEcheance' },
    { header: 'Date paiement', accessor: 'datePaiement', render: (v) => v || '-' },
    { header: 'Mode', accessor: 'modePaiement', render: (v) => v || '-' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payé' ? 'success' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      row.statut !== 'Payé' && (
        <button className="btn btn-sm btn-success" onClick={() => setShowModal(true)}>
          <i className="bi bi-credit-card me-1"></i>Payer
        </button>
      )
    )},
  ];

  const filters = [
    { label: 'Année', type: 'select', options: [
      { value: '2026', label: '2026' },
      { value: '2025', label: '2025' },
    ]},
    { label: 'Statut', type: 'select', options: [
      { value: 'Payé', label: 'Payé' },
      { value: 'En attente', label: 'En attente' },
    ]},
  ];

  const actions = [
    { label: 'Nouveau paiement', icon: 'plus', variant: 'success', onClick: () => setShowModal(true) },
    { label: 'Historique', icon: 'clock-history', variant: 'outline-primary' },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'periode', label: 'Période', type: 'select', required: true, options: [
      { value: 'dec2025', label: 'Décembre 2025' },
    ]},
    { name: 'montant', label: 'Montant', type: 'number', required: true },
    { name: 'modePaiement', label: 'Mode de paiement', type: 'select', required: true, options: [
      { value: 'Virement', label: 'Virement bancaire' },
      { value: 'Chèque', label: 'Chèque' },
    ]},
    { name: 'datePaiement', label: 'Date de paiement', type: 'date', required: true },
    { name: 'reference', label: 'Référence bancaire', type: 'text' },
  ];

  const totalAPayer = paiementsCNSS.filter(p => p.statut !== 'Payé').reduce((sum, p) => sum + p.montant, 0);
  const totalPaye = paiementsCNSS.filter(p => p.statut === 'Payé').reduce((sum, p) => sum + p.montant, 0);

  return (
    <div>
      <PageHeader
        title="Paiements CNSS & Échéancier"
        subtitle="Gestion des paiements et échéances CNSS"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Paiements' }]}
      />

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body">
              <h6 className="text-muted">À payer</h6>
              <h3 className="text-warning">{totalAPayer.toLocaleString()} DH</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body">
              <h6 className="text-muted">Payé (année en cours)</h6>
              <h3 className="text-success">{totalPaye.toLocaleString()} DH</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-info">
            <div className="card-body">
              <h6 className="text-muted">Prochaine échéance</h6>
              <h3 className="text-info">15/01/2026</h3>
            </div>
          </div>
        </div>
      </div>

      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={paiementsCNSS} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Enregistrer un paiement"
        fields={formFields}
        onSubmit={(data) => console.log('Paiement:', data)}
      />
    </div>
  );
}
