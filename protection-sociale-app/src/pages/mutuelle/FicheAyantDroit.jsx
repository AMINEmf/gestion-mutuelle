import { useParams } from 'react-router-dom';
import { PageHeader, ActionBar } from '../../components';
import { ayantsDroit, adhesionsMutuelle, employes, contratsMutuelle } from '../../data/mockData';

export default function FicheAyantDroit() {
  const { id } = useParams();
  const ayant = ayantsDroit.find(a => a.id === parseInt(id)) || ayantsDroit[0];
  const adhesion = adhesionsMutuelle.find(a => a.id === ayant?.adhesionId);
  const adherent = employes.find(e => e.id === adhesion?.employeId);
  const contrat = contratsMutuelle.find(c => c.id === adhesion?.contratId);

  const actions = [
    { label: 'Modifier', icon: 'pencil', variant: 'primary' },
    { label: 'Générer carte', icon: 'credit-card', variant: 'success' },
    { label: 'Supprimer', icon: 'trash', variant: 'outline-danger' },
  ];

  return (
    <div>
      <PageHeader
        title={`Ayant Droit - ${ayant?.nom} ${ayant?.prenom}`}
        subtitle="Détails de l'ayant droit"
        breadcrumb={[
          { label: 'Mutuelle', path: '/mutuelle/dashboard' },
          { label: 'Ayants Droit', path: '/mutuelle/ayants-droit' },
          { label: `${ayant?.nom} ${ayant?.prenom}` }
        ]}
      />
      <ActionBar actions={actions} />

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h6 className="mb-0">Informations personnelles</h6></div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><th width="40%">Nom</th><td>{ayant?.nom}</td></tr>
                  <tr><th>Prénom</th><td>{ayant?.prenom}</td></tr>
                  <tr><th>Date de naissance</th><td>{ayant?.dateNaissance}</td></tr>
                  <tr><th>CIN</th><td>{ayant?.cin || <span className="text-muted">Non applicable (mineur)</span>}</td></tr>
                  <tr><th>Lien de parenté</th><td><span className="badge bg-primary">{ayant?.lienParente}</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h6 className="mb-0">Informations adhérent principal</h6></div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><th width="40%">Adhérent</th><td>{adherent?.nom} {adherent?.prenom}</td></tr>
                  <tr><th>Matricule</th><td>{adherent?.matricule}</td></tr>
                  <tr><th>Régime</th><td>{contrat?.nom}</td></tr>
                  <tr><th>Taux couverture</th><td>{contrat?.tauxCouverture}%</td></tr>
                  <tr><th>Date adhésion</th><td>{adhesion?.dateAdhesion}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header"><h6 className="mb-0">Couverture santé</h6></div>
        <div className="card-body">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Cet ayant droit bénéficie de la même couverture que l'adhérent principal ({contrat?.nom}).
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="border rounded p-3 text-center">
                <h4 className="text-primary">{contrat?.tauxCouverture}%</h4>
                <small className="text-muted">Taux de remboursement</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 text-center">
                <h4 className="text-success">{contrat?.plafondAnnuel?.toLocaleString()} DH</h4>
                <small className="text-muted">Plafond annuel</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 text-center">
                <h4 className="text-info">Actif</h4>
                <small className="text-muted">Statut</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
