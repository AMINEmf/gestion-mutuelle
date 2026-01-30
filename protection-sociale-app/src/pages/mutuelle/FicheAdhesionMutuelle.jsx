import { useParams } from 'react-router-dom';
import { PageHeader, ActionBar, DataTable } from '../../components';
import { adhesionsMutuelle, employes, contratsMutuelle, ayantsDroit, demandesRemboursement } from '../../data/mockData';

export default function FicheAdhesionMutuelle() {
  const { id } = useParams();
  const adhesion = adhesionsMutuelle.find(a => a.id === parseInt(id)) || adhesionsMutuelle[0];
  const employe = employes.find(e => e.id === adhesion?.employeId);
  const contrat = contratsMutuelle.find(c => c.id === adhesion?.contratId);
  const beneficiaires = ayantsDroit.filter(a => a.adhesionId === adhesion?.id);
  const demandes = demandesRemboursement.filter(d => d.employeId === adhesion?.employeId);

  const beneficiairesColumns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'Lien', accessor: 'lienParente' },
    { header: 'Date naissance', accessor: 'dateNaissance' },
    { header: 'CIN', accessor: 'cin', render: (v) => v || '-' },
  ];

  const demandesColumns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Type soin', accessor: 'typeSoin' },
    { header: 'Montant', accessor: 'montant', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Remboursé', accessor: 'montantRembourse', render: (v) => v ? `${v.toLocaleString()} DH` : '-' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : 'warning'}`}>{v}</span>
    )},
  ];

  const actions = [
    { label: 'Modifier', icon: 'pencil', variant: 'primary' },
    { label: 'Ajouter ayant droit', icon: 'person-plus', variant: 'success' },
    { label: 'Générer carte', icon: 'credit-card', variant: 'outline-info' },
  ];

  return (
    <div>
      <PageHeader
        title={`Adhésion Mutuelle - ${employe?.nom} ${employe?.prenom}`}
        subtitle="Détails de l'adhésion mutuelle"
        breadcrumb={[
          { label: 'Mutuelle', path: '/mutuelle/dashboard' },
          { label: 'Adhésions', path: '/mutuelle/adhesions' },
          { label: `${employe?.nom} ${employe?.prenom}` }
        ]}
      />
      <ActionBar actions={actions} />

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header"><h6 className="mb-0">Informations adhérent</h6></div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><th width="40%">Matricule</th><td>{employe?.matricule}</td></tr>
                  <tr><th>Nom complet</th><td>{employe?.nom} {employe?.prenom}</td></tr>
                  <tr><th>CIN</th><td>{employe?.cin}</td></tr>
                  <tr><th>Département</th><td>{employe?.departement}</td></tr>
                  <tr><th>Poste</th><td>{employe?.poste}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header"><h6 className="mb-0">Informations adhésion</h6></div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><th width="40%">Régime</th><td><strong>{contrat?.nom}</strong></td></tr>
                  <tr><th>Date adhésion</th><td>{adhesion?.dateAdhesion}</td></tr>
                  <tr><th>Taux couverture</th><td>{contrat?.tauxCouverture}%</td></tr>
                  <tr><th>Plafond annuel</th><td>{contrat?.plafondAnnuel?.toLocaleString()} DH</td></tr>
                  <tr><th>Cotisation/mois</th><td>{contrat?.cotisationMensuelle} DH</td></tr>
                  <tr><th>Statut</th><td><span className="badge bg-success">{adhesion?.statut}</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Ayants droit / Bénéficiaires ({beneficiaires.length})</h6>
          <button className="btn btn-sm btn-success"><i className="bi bi-plus me-1"></i>Ajouter</button>
        </div>
        <div className="card-body">
          <DataTable columns={beneficiairesColumns} data={beneficiaires} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Historique des remboursements</h6>
        </div>
        <div className="card-body">
          <DataTable columns={demandesColumns} data={demandes} />
        </div>
      </div>
    </div>
  );
}
