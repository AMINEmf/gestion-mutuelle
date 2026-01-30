import { useParams } from 'react-router-dom';
import { PageHeader, ActionBar, DataTable } from '../../components';
import { declarationsCNSS, employes } from '../../data/mockData';

export default function DetailDeclarationCNSS() {
  const { id } = useParams();
  const declaration = declarationsCNSS.find(d => d.id === parseInt(id)) || declarationsCNSS[0];

  const detailColumns = [
    { header: 'Matricule', accessor: 'matricule' },
    { header: 'Employé', accessor: 'nom', render: (v, row) => `${v} ${row.prenom}` },
    { header: 'N° CNSS', accessor: 'id', render: () => Math.floor(1000000000 + Math.random() * 9000000000) },
    { header: 'Salaire Brut', accessor: 'salaire', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Cot. Patronale (20%)', accessor: 'salaire', render: (v) => `${(v * 0.2).toLocaleString()} DH` },
    { header: 'Cot. Salariale (4.5%)', accessor: 'salaire', render: (v) => `${(v * 0.045).toLocaleString()} DH` },
    { header: 'Total', accessor: 'salaire', render: (v) => `${(v * 0.245).toLocaleString()} DH` },
  ];

  const actions = [
    { label: 'Valider', icon: 'check-circle', variant: 'success' },
    { label: 'Modifier', icon: 'pencil', variant: 'outline-primary' },
    { label: 'Exporter PDF', icon: 'file-pdf', variant: 'outline-danger' },
    { label: 'Exporter Excel', icon: 'file-excel', variant: 'outline-success' },
  ];

  return (
    <div>
      <PageHeader
        title={`Déclaration CNSS - ${declaration.periode}`}
        subtitle="Détail de la déclaration et validation"
        breadcrumb={[
          { label: 'CNSS', path: '/cnss/dashboard' },
          { label: 'Déclarations', path: '/cnss/declarations' },
          { label: declaration.periode }
        ]}
      />
      <ActionBar actions={actions} />

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">Période</h6>
              <h4>{declaration.periode}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">Employés déclarés</h6>
              <h4>{declaration.nbEmployes}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">Masse salariale</h6>
              <h4>{declaration.montantBrut.toLocaleString()} DH</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h6>Total cotisations</h6>
              <h4>{(declaration.cotisationPatronale + declaration.cotisationSalariale).toLocaleString()} DH</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Détail par employé</h6>
          <span className={`badge bg-${declaration.statut === 'Payée' ? 'success' : 'info'}`}>{declaration.statut}</span>
        </div>
        <div className="card-body">
          <DataTable columns={detailColumns} data={employes} />
        </div>
      </div>
    </div>
  );
}
