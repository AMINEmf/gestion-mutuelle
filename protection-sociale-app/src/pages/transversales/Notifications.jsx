import { PageHeader, ActionBar, Filters, DataTable } from '../../components';
import { notifications } from '../../data/mockData';

export default function Notifications() {
  const columns = [
    { header: '', accessor: 'lue', render: (v) => (
      <i className={`bi bi-circle-fill ${v ? 'text-secondary' : 'text-primary'}`} style={{ fontSize: '8px' }}></i>
    )},
    { header: 'Type', accessor: 'type', render: (v) => {
      const config = {
        'Alerte': { icon: 'exclamation-triangle', color: 'warning' },
        'Erreur': { icon: 'x-circle', color: 'danger' },
        'Succès': { icon: 'check-circle', color: 'success' },
        'Info': { icon: 'info-circle', color: 'info' },
      };
      const c = config[v] || config['Info'];
      return <span className={`badge bg-${c.color}`}><i className={`bi bi-${c.icon}`}></i> {v}</span>;
    }},
    { header: 'Titre', accessor: 'titre' },
    { header: 'Message', accessor: 'message' },
    { header: 'Date', accessor: 'dateCreation' },
    { header: 'Actions', accessor: 'id', render: (_, row) => (
      <div className="btn-group btn-group-sm">
        {!row.lue && <button className="btn btn-outline-primary" title="Marquer comme lue"><i className="bi bi-check"></i></button>}
        <button className="btn btn-outline-secondary" title="Archiver"><i className="bi bi-archive"></i></button>
      </div>
    )},
  ];

  const filters = [
    { label: 'Type', type: 'select', options: [
      { value: 'Alerte', label: 'Alerte' },
      { value: 'Erreur', label: 'Erreur' },
      { value: 'Succès', label: 'Succès' },
      { value: 'Info', label: 'Info' },
    ]},
    { label: 'Statut', type: 'select', options: [
      { value: 'non-lue', label: 'Non lues' },
      { value: 'lue', label: 'Lues' },
    ]},
    { label: 'Rechercher', type: 'text', placeholder: 'Mot-clé...' },
  ];

  const actions = [
    { label: 'Tout marquer comme lu', icon: 'check-all', variant: 'primary' },
    { label: 'Configurer alertes', icon: 'gear', variant: 'outline-secondary' },
  ];

  const nonLues = notifications.filter(n => !n.lue).length;

  return (
    <div>
      <PageHeader
        title="Centre Notifications & Relances"
        subtitle="Gestion des notifications et alertes"
        breadcrumb={[{ label: 'Transversales' }, { label: 'Notifications' }]}
      />

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <h3 className="text-primary">{nonLues}</h3>
              <small>Non lues</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h3 className="text-warning">{notifications.filter(n => n.type === 'Alerte').length}</h3>
              <small>Alertes</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <h3 className="text-danger">{notifications.filter(n => n.type === 'Erreur').length}</h3>
              <small>Erreurs</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h3 className="text-success">{notifications.filter(n => n.type === 'Succès').length}</h3>
              <small>Succès</small>
            </div>
          </div>
        </div>
      </div>

      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={notifications} />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h6 className="mb-0">Configuration des relances automatiques</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="relanceCNSS" defaultChecked />
                <label className="form-check-label" htmlFor="relanceCNSS">
                  Relance échéance paiement CNSS (7 jours avant)
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="relanceDeclaration" defaultChecked />
                <label className="form-check-label" htmlFor="relanceDeclaration">
                  Rappel déclaration mensuelle CNSS
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="relanceRemb" defaultChecked />
                <label className="form-check-label" htmlFor="relanceRemb">
                  Notification nouvelles demandes remboursement
                </label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="relanceAnomalie" defaultChecked />
                <label className="form-check-label" htmlFor="relanceAnomalie">
                  Alerte anomalies détectées
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
