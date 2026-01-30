import { PageHeader, ActionBar, Filters, DataTable } from '../../components';
import { historiqueAudit } from '../../data/mockData';

export default function HistoriqueAudit() {
  const columns = [
    { header: 'Date/Heure', accessor: 'dateAction' },
    { header: 'Action', accessor: 'action' },
    { header: 'Utilisateur', accessor: 'utilisateur' },
    { header: 'Entité', accessor: 'entite', render: (v) => <span className="badge bg-secondary">{v}</span> },
    { header: 'Détails', accessor: 'details' },
    { header: 'Actions', accessor: 'id', render: () => (
      <button className="btn btn-sm btn-outline-primary"><i className="bi bi-eye"></i></button>
    )},
  ];

  const filters = [
    { label: 'Utilisateur', type: 'text', placeholder: 'Email...' },
    { label: 'Entité', type: 'select', options: [
      { value: 'Dossier CNSS', label: 'Dossier CNSS' },
      { value: 'Déclaration CNSS', label: 'Déclaration CNSS' },
      { value: 'Paiement CNSS', label: 'Paiement CNSS' },
      { value: 'Adhésion Mutuelle', label: 'Adhésion Mutuelle' },
      { value: 'Remboursement', label: 'Remboursement' },
    ]},
    { label: 'Date du', type: 'date' },
    { label: 'Date au', type: 'date' },
  ];

  const actions = [
    { label: 'Exporter logs', icon: 'download', variant: 'primary' },
    { label: 'Purger anciens logs', icon: 'trash', variant: 'outline-danger' },
  ];

  return (
    <div>
      <PageHeader
        title="Historique & Audit"
        subtitle="Journal des actions et traçabilité"
        breadcrumb={[{ label: 'Transversales' }, { label: 'Historique & Audit' }]}
      />

      <div className="alert alert-info mb-4">
        <i className="bi bi-info-circle me-2"></i>
        Cet écran présente l'historique de toutes les actions effectuées sur le module Protection Sociale. 
        Les données sont conservées pendant 5 ans conformément à la réglementation.
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-primary">{historiqueAudit.length}</h3>
              <small>Actions aujourd'hui</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-success">3</h3>
              <small>Utilisateurs actifs</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-info">156</h3>
              <small>Actions ce mois</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-secondary">1 842</h3>
              <small>Total actions 2026</small>
            </div>
          </div>
        </div>
      </div>

      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={historiqueAudit} />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h6 className="mb-0">Activité par type d'action</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>CNSS</h6>
              <div className="mb-2">
                <div className="d-flex justify-content-between"><span>Créations</span><span>12</span></div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between"><span>Modifications</span><span>28</span></div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between"><span>Validations</span><span>8</span></div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h6>Mutuelle</h6>
              <div className="mb-2">
                <div className="d-flex justify-content-between"><span>Demandes</span><span>18</span></div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '55%' }}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between"><span>Validations</span><span>15</span></div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between"><span>Paiements</span><span>12</span></div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
