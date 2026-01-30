import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable } from '../../components';
import { demandesRemboursement, employes } from '../../data/mockData';

export default function ValidationRemboursements() {
  const demandesAValider = demandesRemboursement.filter(d => d.statut === 'En attente' || d.statut === 'En cours');

  const getData = () => {
    return demandesAValider.map(d => {
      const emp = employes.find(e => e.id === d.employeId);
      return { ...d, employe: emp ? `${emp.nom} ${emp.prenom}` : 'N/A' };
    });
  };

  const columns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Date', accessor: 'dateDemande' },
    { header: 'Type soin', accessor: 'typeSoin' },
    { header: 'Montant demandé', accessor: 'montant', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'En cours' ? 'primary' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-success" title="Valider"><i className="bi bi-check-lg"></i></button>
        <button className="btn btn-danger" title="Rejeter"><i className="bi bi-x-lg"></i></button>
        <button className="btn btn-outline-primary" title="Voir"><i className="bi bi-eye"></i></button>
      </div>
    )},
  ];

  const filters = [
    { label: 'Employé', type: 'text', placeholder: 'Rechercher...' },
    { label: 'Type soin', type: 'select', options: [
      { value: 'Pharmacie', label: 'Pharmacie' },
      { value: 'Consultation', label: 'Consultation' },
      { value: 'Analyses', label: 'Analyses' },
    ]},
  ];

  const actions = [
    { label: 'Valider sélection', icon: 'check-all', variant: 'success' },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  return (
    <div>
      <PageHeader
        title="Validation des Remboursements"
        subtitle="Workflow de validation des demandes de remboursement"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Validation' }]}
      />

      <div className="alert alert-info d-flex align-items-center mb-4">
        <i className="bi bi-info-circle me-2 fs-4"></i>
        <div>
          <strong>{demandesAValider.length} demande(s)</strong> en attente de validation
        </div>
      </div>

      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={getData()} />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h6 className="mb-0">Détail de la demande sélectionnée</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Informations demande</h6>
              <table className="table table-sm">
                <tbody>
                  <tr><th>Référence</th><td>RMB-2026-002</td></tr>
                  <tr><th>Employé</th><td>OUAZZANI Fatima</td></tr>
                  <tr><th>Type soin</th><td>Pharmacie</td></tr>
                  <tr><th>Montant</th><td>350 DH</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h6>Calcul remboursement</h6>
              <table className="table table-sm">
                <tbody>
                  <tr><th>Taux applicable</th><td>80%</td></tr>
                  <tr><th>Plafond</th><td>5 000 DH</td></tr>
                  <tr><th>Franchise</th><td>0 DH</td></tr>
                  <tr><th className="text-success">Montant à rembourser</th><td className="text-success fw-bold">280 DH</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success"><i className="bi bi-check-lg me-1"></i>Valider</button>
            <button className="btn btn-danger"><i className="bi bi-x-lg me-1"></i>Rejeter</button>
            <button className="btn btn-outline-warning"><i className="bi bi-arrow-return-left me-1"></i>Demander complément</button>
          </div>
        </div>
      </div>
    </div>
  );
}
