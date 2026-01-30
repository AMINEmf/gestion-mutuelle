import { PageHeader, StatCard, DataTable } from '../../components';
import { statsGlobales, statsCNSS, statsMutuelle, notifications, employes } from '../../data/mockData';

export default function DashboardGlobal() {
  const notificationsColumns = [
    { header: 'Type', accessor: 'type', render: (v) => (
      <span className={`badge bg-${v === 'Alerte' ? 'warning' : v === 'Erreur' ? 'danger' : v === 'Succès' ? 'success' : 'info'}`}>
        <i className={`bi bi-${v === 'Alerte' ? 'exclamation-triangle' : v === 'Erreur' ? 'x-circle' : v === 'Succès' ? 'check-circle' : 'info-circle'}`}></i>
      </span>
    )},
    { header: 'Titre', accessor: 'titre' },
    { header: 'Date', accessor: 'dateCreation' },
    { header: 'Statut', accessor: 'lue', render: (v) => (
      <span className={`badge bg-${v ? 'secondary' : 'primary'}`}>{v ? 'Lue' : 'Non lue'}</span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard Protection Sociale"
        subtitle="Vue d'ensemble globale CNSS et Mutuelle"
        breadcrumb={[{ label: 'Dashboard Global' }]}
      />

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard title="Total employés" value={statsGlobales.totalEmployes} icon="people-fill" color="primary" />
        </div>
        <div className="col-md-3">
          <StatCard title="Couverture CNSS" value={`${statsGlobales.couvertureCNSS}%`} icon="building" color="success" />
        </div>
        <div className="col-md-3">
          <StatCard title="Couverture Mutuelle" value={`${statsGlobales.couvertureMutuelle}%`} icon="heart-pulse" color="info" />
        </div>
        <div className="col-md-3">
          <StatCard title="Budget PS mensuel" value={`${statsGlobales.budgetProtectionSociale.toLocaleString()} DH`} icon="cash-stack" color="warning" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0"><i className="bi bi-building me-2"></i>CNSS</h6>
              <a href="/cnss/dashboard" className="btn btn-sm btn-outline-light">Voir détails</a>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <h3 className="text-success">{statsCNSS.totalEmployesAffities}</h3>
                  <small className="text-muted">Affiliés</small>
                </div>
                <div className="col-4">
                  <h3 className="text-warning">{statsCNSS.employesEnCours}</h3>
                  <small className="text-muted">En cours</small>
                </div>
                <div className="col-4">
                  <h3 className="text-primary">{statsCNSS.montantCotisations.toLocaleString()}</h3>
                  <small className="text-muted">Cotisations (DH)</small>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Anomalies en cours</span>
                <span className="badge bg-danger">{statsCNSS.anomaliesEnCours}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0"><i className="bi bi-heart-pulse me-2"></i>Mutuelle</h6>
              <a href="/mutuelle/dashboard" className="btn btn-sm btn-outline-light">Voir détails</a>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <h3 className="text-success">{statsMutuelle.totalAdherents}</h3>
                  <small className="text-muted">Adhérents</small>
                </div>
                <div className="col-4">
                  <h3 className="text-warning">{statsMutuelle.demandesEnCours}</h3>
                  <small className="text-muted">Demandes en cours</small>
                </div>
                <div className="col-4">
                  <h3 className="text-primary">{statsMutuelle.montantRembourse.toLocaleString()}</h3>
                  <small className="text-muted">Remboursé (DH)</small>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Taux d'utilisation</span>
                <div className="progress flex-grow-1 mx-3" style={{ height: '20px' }}>
                  <div className="progress-bar bg-info" style={{ width: `${statsMutuelle.tauxUtilisation}%` }}>
                    {statsMutuelle.tauxUtilisation}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Notifications récentes</h6>
              <a href="/notifications" className="btn btn-sm btn-outline-primary">Voir tout</a>
            </div>
            <div className="card-body">
              <DataTable columns={notificationsColumns} data={notifications.slice(0, 4)} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Accès rapides</h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/cnss/declarations" className="btn btn-outline-dark">
                  <i className="bi bi-file-earmark-text me-2"></i>Nouvelle déclaration CNSS
                </a>
                <a href="/mutuelle/remboursement/nouveau" className="btn btn-outline-info">
                  <i className="bi bi-plus-circle me-2"></i>Demande remboursement
                </a>
                <a href="/cnss/affiliation" className="btn btn-outline-success">
                  <i className="bi bi-person-plus me-2"></i>Affiliation CNSS
                </a>
                <a href="/rapports" className="btn btn-outline-secondary">
                  <i className="bi bi-bar-chart me-2"></i>Générer rapport
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
