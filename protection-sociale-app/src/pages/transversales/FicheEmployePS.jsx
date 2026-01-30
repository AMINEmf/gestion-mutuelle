import { useState } from 'react';
import { PageHeader, ActionBar, DataTable } from '../../components';
import { employes, dossiersCNSS, adhesionsMutuelle, contratsMutuelle, demandesRemboursement } from '../../data/mockData';

export default function FicheEmployePS() {
  const [selectedEmploye, setSelectedEmploye] = useState(employes[0]);

  const dossierCNSS = dossiersCNSS.find(d => d.employeId === selectedEmploye?.id);
  const adhesionMutuelle = adhesionsMutuelle.find(a => a.employeId === selectedEmploye?.id);
  const contrat = contratsMutuelle.find(c => c.id === adhesionMutuelle?.contratId);
  const demandes = demandesRemboursement.filter(d => d.employeId === selectedEmploye?.id);

  const demandesColumns = [
    { header: 'Référence', accessor: 'reference' },
    { header: 'Type', accessor: 'typeSoin' },
    { header: 'Montant', accessor: 'montant', render: (v) => `${v.toLocaleString()} DH` },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Payée' ? 'success' : v === 'Validée' ? 'info' : 'warning'}`}>{v}</span>
    )},
  ];

  const actions = [
    { label: 'Modifier', icon: 'pencil', variant: 'primary' },
    { label: 'Exporter fiche', icon: 'download', variant: 'outline-secondary' },
  ];

  return (
    <div>
      <PageHeader
        title="Fiche Employé - Protection Sociale"
        subtitle="Vue consolidée CNSS et Mutuelle de l'employé"
        breadcrumb={[{ label: 'Transversales' }, { label: 'Fiche Employé PS' }]}
      />

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Sélectionner un employé</label>
          <select 
            className="form-select" 
            value={selectedEmploye?.id} 
            onChange={(e) => setSelectedEmploye(employes.find(emp => emp.id === parseInt(e.target.value)))}
          >
            {employes.map(e => (
              <option key={e.id} value={e.id}>{e.matricule} - {e.nom} {e.prenom}</option>
            ))}
          </select>
        </div>
      </div>

      <ActionBar actions={actions} />

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0"><i className="bi bi-person me-2"></i>Informations employé</h6>
            </div>
            <div className="card-body">
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr><th>Matricule</th><td>{selectedEmploye?.matricule}</td></tr>
                  <tr><th>Nom complet</th><td>{selectedEmploye?.nom} {selectedEmploye?.prenom}</td></tr>
                  <tr><th>CIN</th><td>{selectedEmploye?.cin}</td></tr>
                  <tr><th>Date naissance</th><td>{selectedEmploye?.dateNaissance}</td></tr>
                  <tr><th>Date embauche</th><td>{selectedEmploye?.dateEmbauche}</td></tr>
                  <tr><th>Département</th><td>{selectedEmploye?.departement}</td></tr>
                  <tr><th>Poste</th><td>{selectedEmploye?.poste}</td></tr>
                  <tr><th>Salaire</th><td>{selectedEmploye?.salaire?.toLocaleString()} DH</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-dark text-white">
              <h6 className="mb-0"><i className="bi bi-building me-2"></i>CNSS</h6>
            </div>
            <div className="card-body">
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <th>Statut</th>
                    <td><span className={`badge bg-${selectedEmploye?.statutCNSS === 'Affilié' ? 'success' : 'warning'}`}>{selectedEmploye?.statutCNSS}</span></td>
                  </tr>
                  <tr><th>N° CNSS</th><td>{dossierCNSS?.numeroCNSS || 'Non attribué'}</td></tr>
                  <tr><th>Date affiliation</th><td>{dossierCNSS?.dateAffiliation || 'En cours'}</td></tr>
                  <tr><th>Dernière MAJ</th><td>{dossierCNSS?.derniereMaj}</td></tr>
                </tbody>
              </table>
              <hr />
              <div className="d-grid gap-2">
                <a href={`/cnss/dossier/${dossierCNSS?.id}`} className="btn btn-sm btn-outline-dark">Voir dossier CNSS</a>
                <a href={`/cnss/historique/${selectedEmploye?.id}`} className="btn btn-sm btn-outline-secondary">Historique cotisations</a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0"><i className="bi bi-heart-pulse me-2"></i>Mutuelle</h6>
            </div>
            <div className="card-body">
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <th>Statut</th>
                    <td><span className={`badge bg-${selectedEmploye?.statutMutuelle === 'Actif' ? 'success' : 'warning'}`}>{selectedEmploye?.statutMutuelle}</span></td>
                  </tr>
                  <tr><th>Régime</th><td>{contrat?.nom || 'Non adhérent'}</td></tr>
                  <tr><th>Date adhésion</th><td>{adhesionMutuelle?.dateAdhesion || '-'}</td></tr>
                  <tr><th>Bénéficiaires</th><td>{adhesionMutuelle?.nbBeneficiaires || 0}</td></tr>
                  <tr><th>Cotisation/mois</th><td>{contrat?.cotisationMensuelle || 0} DH</td></tr>
                </tbody>
              </table>
              <hr />
              <div className="d-grid gap-2">
                <a href={`/mutuelle/adhesion/${adhesionMutuelle?.id}`} className="btn btn-sm btn-outline-info">Voir adhésion Mutuelle</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Historique remboursements Mutuelle</h6>
        </div>
        <div className="card-body">
          <DataTable columns={demandesColumns} data={demandes} />
        </div>
      </div>
    </div>
  );
}
