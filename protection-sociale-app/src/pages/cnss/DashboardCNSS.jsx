import { PageHeader, StatCard, DataTable } from '../../components';
import { statsCNSS, declarationsCNSS, anomaliesCNSS } from '../../data/mockData';

export default function DashboardCNSS() {
  const colonnesDeclarations = [
    { header: 'Période', accessor: 'periode' },
    { header: 'Montant Brut', accessor: 'montantBrut', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Cotisations', accessor: 'cotisationPatronale', render: (v, row) => `${(v + row.cotisationSalariale).toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : 'warning'}`}>{v}</span>
    )},
  ];

  const colonnesAnomalies = [
    { header: 'Type', accessor: 'type' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Priorité', accessor: 'priorite', render: (v) => (
      <span className={`badge bg-${v === 'Haute' ? 'danger' : v === 'Moyenne' ? 'warning' : 'secondary'}`}>{v}</span>
    )},
    { header: 'Statut', accessor: 'statut' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard CNSS"
        subtitle="Vue d'ensemble de la gestion CNSS"
        breadcrumb={[{ label: 'CNSS', path: '/cnss' }, { label: 'Dashboard' }]}
      />

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard title="Employés affiliés" value={statsCNSS.totalEmployesAffities} icon="people-fill" color="success" />
        </div>
        <div className="col-md-3">
          <StatCard title="En cours d'affiliation" value={statsCNSS.employesEnCours} icon="hourglass-split" color="warning" />
        </div>
        <div className="col-md-3">
          <StatCard title="Cotisations du mois" value={`${statsCNSS.montantCotisations.toLocaleString()} DH`} icon="cash" color="primary" />
        </div>
        <div className="col-md-3">
          <StatCard title="Anomalies en cours" value={statsCNSS.anomaliesEnCours} icon="exclamation-triangle" color="danger" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Dernières déclarations</h6>
              <a href="/cnss/declarations" className="btn btn-sm btn-outline-primary">Voir tout</a>
            </div>
            <div className="card-body">
              <DataTable columns={colonnesDeclarations} data={declarationsCNSS.slice(0, 4)} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Anomalies récentes</h6>
              <a href="/cnss/controles" className="btn btn-sm btn-outline-danger">Voir tout</a>
            </div>
            <div className="card-body">
              <DataTable columns={colonnesAnomalies} data={anomaliesCNSS.slice(0, 3)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
