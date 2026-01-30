import { useParams } from 'react-router-dom';
import { PageHeader, DataTable } from '../../components';
import { employes, declarationsCNSS } from '../../data/mockData';

export default function HistoriqueCNSS() {
  const { employeId } = useParams();
  const employe = employes.find(e => e.id === parseInt(employeId)) || employes[0];

  const columns = [
    { header: 'Période', accessor: 'periode' },
    { header: 'Date déclaration', accessor: 'dateDeclaration' },
    { header: 'Salaire Brut', accessor: 'montantBrut', render: (v) => `${(v / 8).toLocaleString()} DH` },
    { header: 'Cotisation Patronale', accessor: 'cotisationPatronale', render: (v) => `${(v / 8).toLocaleString()} DH` },
    { header: 'Cotisation Salariale', accessor: 'cotisationSalariale', render: (v) => `${(v / 8).toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : 'warning'}`}>{v}</span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title={`Historique CNSS - ${employe.nom} ${employe.prenom}`}
        subtitle="Historique des déclarations et cotisations CNSS"
        breadcrumb={[
          { label: 'CNSS', path: '/cnss/dashboard' },
          { label: 'Dossiers', path: '/cnss/dossiers' },
          { label: 'Historique' }
        ]}
      />

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6>Total cotisations 2025</h6>
              <h3>45 600 DH</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6>Mois déclarés</h6>
              <h3>12 / 12</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6>Années d'ancienneté CNSS</h6>
              <h3>7 ans</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Détail des déclarations</h6>
        </div>
        <div className="card-body">
          <DataTable columns={columns} data={declarationsCNSS} />
        </div>
      </div>
    </div>
  );
}
