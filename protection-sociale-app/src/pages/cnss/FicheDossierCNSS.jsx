import { useParams } from 'react-router-dom';
import { PageHeader, ActionBar, DataTable } from '../../components';
import { dossiersCNSS, employes, declarationsCNSS } from '../../data/mockData';

export default function FicheDossierCNSS() {
  const { id } = useParams();
  const dossier = dossiersCNSS.find(d => d.id === parseInt(id)) || dossiersCNSS[0];
  const employe = employes.find(e => e.id === dossier?.employeId);

  const historiqueColumns = [
    { header: 'Période', accessor: 'periode' },
    { header: 'Salaire Brut', accessor: 'montantBrut', render: (v) => `${(v / 8).toLocaleString()} DH` },
    { header: 'Cotisation', accessor: 'cotisationSalariale', render: (v) => `${(v / 8).toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => <span className={`badge bg-${v === 'Payée' ? 'success' : 'info'}`}>{v}</span> },
  ];

  const actions = [
    { label: 'Modifier', icon: 'pencil', variant: 'primary' },
    { label: 'Générer attestation', icon: 'file-earmark-check', variant: 'success' },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  return (
    <div>
      <PageHeader
        title={`Dossier CNSS - ${employe?.nom} ${employe?.prenom}`}
        subtitle="Détails du dossier CNSS de l'employé"
        breadcrumb={[
          { label: 'CNSS', path: '/cnss/dashboard' },
          { label: 'Dossiers', path: '/cnss/dossiers' },
          { label: `${employe?.nom} ${employe?.prenom}` }
        ]}
      />
      <ActionBar actions={actions} />

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h6 className="mb-0">Informations employé</h6></div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><th width="40%">Matricule</th><td>{employe?.matricule}</td></tr>
                  <tr><th>Nom complet</th><td>{employe?.nom} {employe?.prenom}</td></tr>
                  <tr><th>CIN</th><td>{employe?.cin}</td></tr>
                  <tr><th>Date de naissance</th><td>{employe?.dateNaissance}</td></tr>
                  <tr><th>Poste</th><td>{employe?.poste}</td></tr>
                  <tr><th>Département</th><td>{employe?.departement}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h6 className="mb-0">Informations CNSS</h6></div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr><th width="40%">N° CNSS</th><td><strong>{dossier?.numeroCNSS || 'Non attribué'}</strong></td></tr>
                  <tr><th>Date d'affiliation</th><td>{dossier?.dateAffiliation || 'En cours'}</td></tr>
                  <tr><th>Statut</th><td><span className={`badge bg-${dossier?.statut === 'Actif' ? 'success' : 'warning'}`}>{dossier?.statut}</span></td></tr>
                  <tr><th>Dernière mise à jour</th><td>{dossier?.derniereMaj}</td></tr>
                  <tr><th>Salaire déclaré</th><td>{employe?.salaire?.toLocaleString()} DH</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header"><h6 className="mb-0">Historique des déclarations</h6></div>
        <div className="card-body">
          <DataTable columns={historiqueColumns} data={declarationsCNSS.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
