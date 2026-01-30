import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { anomaliesCNSS } from '../../data/mockData';

export default function ControlesCNSS() {
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'Type', accessor: 'type' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Description', accessor: 'description' },
    { header: 'Date détection', accessor: 'dateDetection' },
    { header: 'Priorité', accessor: 'priorite', render: (v) => (
      <span className={`badge bg-${v === 'Haute' ? 'danger' : v === 'Moyenne' ? 'warning' : 'secondary'}`}>{v}</span>
    )},
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Résolu' ? 'success' : v === 'En cours' ? 'info' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-success"><i className="bi bi-check"></i></button>
        <button className="btn btn-outline-primary"><i className="bi bi-eye"></i></button>
      </div>
    )},
  ];

  const filters = [
    { label: 'Type', type: 'select', options: [
      { value: 'Matricule manquant', label: 'Matricule manquant' },
      { value: 'Écart de salaire', label: 'Écart de salaire' },
      { value: 'Date incorrecte', label: 'Date incorrecte' },
    ]},
    { label: 'Priorité', type: 'select', options: [
      { value: 'Haute', label: 'Haute' },
      { value: 'Moyenne', label: 'Moyenne' },
      { value: 'Basse', label: 'Basse' },
    ]},
    { label: 'Statut', type: 'select', options: [
      { value: 'En attente', label: 'En attente' },
      { value: 'En cours', label: 'En cours' },
      { value: 'Résolu', label: 'Résolu' },
    ]},
  ];

  const actions = [
    { label: 'Lancer contrôle', icon: 'play', variant: 'primary' },
    { label: 'Exporter anomalies', icon: 'download', variant: 'outline-secondary' },
  ];

  return (
    <div>
      <PageHeader
        title="Contrôles & Anomalies CNSS"
        subtitle="Détection et résolution des anomalies CNSS"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Contrôles' }]}
      />

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-danger">
            <div className="card-body">
              <h6 className="text-muted">Anomalies critiques</h6>
              <h3 className="text-danger">1</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body">
              <h6 className="text-muted">En cours de traitement</h6>
              <h3 className="text-warning">1</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body">
              <h6 className="text-muted">Résolues ce mois</h6>
              <h3 className="text-success">1</h3>
            </div>
          </div>
        </div>
      </div>

      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={anomaliesCNSS} />
        </div>
      </div>
    </div>
  );
}
