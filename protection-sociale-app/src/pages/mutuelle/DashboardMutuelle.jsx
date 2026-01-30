import { PageHeader, StatCard, DataTable } from '../../components';
import { statsMutuelle, demandesRemboursement, adhesionsMutuelle, employes } from '../../data/mockData';

export default function DashboardMutuelle() {
  const demandesColumns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Employé', accessor: 'employeId', render: (id) => {
      const emp = employes.find(e => e.id === id);
      return emp ? `${emp.nom} ${emp.prenom}` : 'N/A';
    }},
    { header: 'Type soin', accessor: 'typeSoin' },
    { header: 'Montant', accessor: 'montant', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : 'warning'}`}>{v}</span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard Mutuelle"
        subtitle="Vue d'ensemble de la gestion Mutuelle"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle' }, { label: 'Dashboard' }]}
      />

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard title="Adhérents actifs" value={statsMutuelle.totalAdherents} icon="people-fill" color="success" />
        </div>
        <div className="col-md-3">
          <StatCard title="Demandes en cours" value={statsMutuelle.demandesEnCours} icon="hourglass-split" color="warning" />
        </div>
        <div className="col-md-3">
          <StatCard title="Montant remboursé (mois)" value={`${statsMutuelle.montantRembourse.toLocaleString()} DH`} icon="cash" color="primary" />
        </div>
        <div className="col-md-3">
          <StatCard title="Taux d'utilisation" value={`${statsMutuelle.tauxUtilisation}%`} icon="graph-up" color="info" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Dernières demandes de remboursement</h6>
              <a href="/mutuelle/remboursements" className="btn btn-sm btn-outline-primary">Voir tout</a>
            </div>
            <div className="card-body">
              <DataTable columns={demandesColumns} data={demandesRemboursement.slice(0, 5)} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Répartition par régime</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Régime Standard</span>
                  <span>3</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '43%' }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Régime Premium</span>
                  <span>2</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '29%' }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Régime Famille</span>
                  <span>2</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: '29%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
