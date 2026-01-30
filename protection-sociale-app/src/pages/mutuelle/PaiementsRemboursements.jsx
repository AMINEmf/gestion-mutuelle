import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { demandesRemboursement, employes } from '../../data/mockData';

export default function PaiementsRemboursements() {
  const [showModal, setShowModal] = useState(false);

  const demandesValidees = demandesRemboursement.filter(d => d.statut === 'Validée' || d.statut === 'Payée');

  const getData = () => {
    return demandesValidees.map(d => {
      const emp = employes.find(e => e.id === d.employeId);
      return { ...d, employe: emp ? `${emp.nom} ${emp.prenom}` : 'N/A', rib: 'XXXX-XXXX-XXXX-' + (1000 + d.id) };
    });
  };

  const columns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Type soin', accessor: 'typeSoin' },
    { header: 'Montant remb.', accessor: 'montantRembourse', render: (v) => `${v?.toLocaleString()} DH` },
    { header: 'RIB', accessor: 'rib' },
    { header: 'Date traitement', accessor: 'dateTraitement' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : 'info'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      row.statut !== 'Payée' && (
        <button className="btn btn-sm btn-success">
          <i className="bi bi-credit-card me-1"></i>Payer
        </button>
      )
    )},
  ];

  const filters = [
    { label: 'Employé', type: 'text', placeholder: 'Rechercher...' },
    { label: 'Statut', type: 'select', options: [
      { value: 'Validée', label: 'À payer' },
      { value: 'Payée', label: 'Payée' },
    ]},
  ];

  const actions = [
    { label: 'Générer batch paiement', icon: 'cash-stack', variant: 'success', onClick: () => setShowModal(true) },
    { label: 'Export virement', icon: 'download', variant: 'outline-primary' },
    { label: 'Historique', icon: 'clock-history', variant: 'outline-secondary' },
  ];

  const totalAPayer = demandesValidees.filter(d => d.statut === 'Validée').reduce((sum, d) => sum + (d.montantRembourse || 0), 0);
  const totalPaye = demandesValidees.filter(d => d.statut === 'Payée').reduce((sum, d) => sum + (d.montantRembourse || 0), 0);

  return (
    <div>
      <PageHeader
        title="Paiements des Remboursements"
        subtitle="Gestion des paiements par batch / virement"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Paiements' }]}
      />

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body">
              <h6 className="text-muted">À payer</h6>
              <h3 className="text-warning">{totalAPayer.toLocaleString()} DH</h3>
              <small>{demandesValidees.filter(d => d.statut === 'Validée').length} demande(s)</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body">
              <h6 className="text-muted">Payé (mois en cours)</h6>
              <h3 className="text-success">{totalPaye.toLocaleString()} DH</h3>
              <small>{demandesValidees.filter(d => d.statut === 'Payée').length} demande(s)</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-info">
            <div className="card-body">
              <h6 className="text-muted">Prochain batch</h6>
              <h3 className="text-info">31/01/2026</h3>
              <small>Virement groupé</small>
            </div>
          </div>
        </div>
      </div>

      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={getData()} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Générer un batch de paiement"
        fields={[
          { name: 'datePaiement', label: 'Date de paiement', type: 'date', required: true },
          { name: 'modePaiement', label: 'Mode de paiement', type: 'select', required: true, options: [
            { value: 'virement', label: 'Virement bancaire groupé' },
            { value: 'cheque', label: 'Chèques individuels' },
          ]},
          { name: 'reference', label: 'Référence batch', type: 'text' },
        ]}
        onSubmit={(data) => console.log('Batch:', data)}
      />
    </div>
  );
}
