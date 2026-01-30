import { useNavigate } from 'react-router-dom';
import { PageHeader, ActionBar, Filters, DataTable } from '../../components';
import { demandesRemboursement, employes } from '../../data/mockData';

export default function DemandesRemboursement() {
  const navigate = useNavigate();

  const getData = () => {
    return demandesRemboursement.map(d => {
      const emp = employes.find(e => e.id === d.employeId);
      return { ...d, employe: emp ? `${emp.nom} ${emp.prenom}` : 'N/A' };
    });
  };

  const columns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'Date demande', accessor: 'dateDemande' },
    { header: 'Type soin', accessor: 'typeSoin' },
    { header: 'Montant', accessor: 'montant', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Remboursé', accessor: 'montantRembourse', render: (v) => v ? `${v.toLocaleString()} DH` : '-' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : v === 'En cours' ? 'primary' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: () => (
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-eye"></i></button>
        <button className="btn btn-outline-success"><i className="bi bi-check"></i></button>
      </div>
    )},
  ];

  const filters = [
    { label: 'Employé', type: 'text', placeholder: 'Rechercher...' },
    { label: 'Type soin', type: 'select', options: [
      { value: 'Consultation', label: 'Consultation' },
      { value: 'Pharmacie', label: 'Pharmacie' },
      { value: 'Hospitalisation', label: 'Hospitalisation' },
      { value: 'Dentaire', label: 'Dentaire' },
      { value: 'Optique', label: 'Optique' },
    ]},
    { label: 'Statut', type: 'select', options: [
      { value: 'En attente', label: 'En attente' },
      { value: 'En cours', label: 'En cours' },
      { value: 'Validée', label: 'Validée' },
      { value: 'Payée', label: 'Payée' },
    ]},
  ];

  const actions = [
    { label: 'Nouvelle demande', icon: 'plus', variant: 'primary', onClick: () => navigate('/mutuelle/remboursement/nouveau') },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  return (
    <div>
      <PageHeader
        title="Demandes de Remboursement"
        subtitle="Liste des demandes de remboursement mutuelle"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Remboursements' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h4 className="text-warning">2</h4>
              <small>En attente</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <h4 className="text-primary">1</h4>
              <small>En cours</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <h4 className="text-info">1</h4>
              <small>Validées</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h4 className="text-success">2</h4>
              <small>Payées</small>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={getData()} />
        </div>
      </div>
    </div>
  );
}
