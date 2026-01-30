import { PageHeader, ActionBar } from '../../components';
import { statsCNSS, statsMutuelle, statsGlobales, declarationsCNSS, demandesRemboursement } from '../../data/mockData';

export default function Rapports() {
  const actions = [
    { label: 'Générer rapport CNSS', icon: 'file-earmark-pdf', variant: 'danger' },
    { label: 'Générer rapport Mutuelle', icon: 'file-earmark-pdf', variant: 'info' },
    { label: 'Rapport consolidé', icon: 'file-earmark-bar-graph', variant: 'primary' },
  ];

  return (
    <div>
      <PageHeader
        title="Rapports CNSS / Mutuelle"
        subtitle="Synthèse et génération de rapports"
        breadcrumb={[{ label: 'Transversales' }, { label: 'Rapports' }]}
      />
      <ActionBar actions={actions} />

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h6 className="mb-0">Rapports CNSS disponibles</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    État des affiliations
                  </div>
                  <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    Récapitulatif des déclarations
                  </div>
                  <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    Historique des paiements
                  </div>
                  <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-danger"></i>
                    Anomalies détectées
                  </div>
                  <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">Rapports Mutuelle disponibles</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-info"></i>
                    Liste des adhérents
                  </div>
                  <button className="btn btn-sm btn-outline-info"><i className="bi bi-download"></i></button>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-info"></i>
                    Remboursements du mois
                  </div>
                  <button className="btn btn-sm btn-outline-info"><i className="bi bi-download"></i></button>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-info"></i>
                    Consommation par régime
                  </div>
                  <button className="btn btn-sm btn-outline-info"><i className="bi bi-download"></i></button>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-file-earmark-text me-2 text-info"></i>
                    Statistiques ayants droit
                  </div>
                  <button className="btn btn-sm btn-outline-info"><i className="bi bi-download"></i></button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">Générer un rapport personnalisé</h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Type de rapport</label>
              <select className="form-select">
                <option value="">Sélectionner...</option>
                <option value="cnss">CNSS</option>
                <option value="mutuelle">Mutuelle</option>
                <option value="global">Global Protection Sociale</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Période - Du</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Période - Au</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Format</label>
              <select className="form-select">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
              </select>
            </div>
            <div className="col-md-12">
              <button className="btn btn-primary">
                <i className="bi bi-file-earmark-bar-graph me-2"></i>Générer le rapport
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h6 className="mb-0">Synthèse chiffrée</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6 className="border-bottom pb-2">CNSS</h6>
              <table className="table table-sm">
                <tbody>
                  <tr><td>Employés affiliés</td><td className="text-end fw-bold">{statsCNSS.totalEmployesAffities}</td></tr>
                  <tr><td>En cours d'affiliation</td><td className="text-end fw-bold">{statsCNSS.employesEnCours}</td></tr>
                  <tr><td>Cotisations mensuelles</td><td className="text-end fw-bold">{statsCNSS.montantCotisations.toLocaleString()} DH</td></tr>
                  <tr><td>Anomalies en cours</td><td className="text-end fw-bold text-danger">{statsCNSS.anomaliesEnCours}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h6 className="border-bottom pb-2">Mutuelle</h6>
              <table className="table table-sm">
                <tbody>
                  <tr><td>Adhérents actifs</td><td className="text-end fw-bold">{statsMutuelle.totalAdherents}</td></tr>
                  <tr><td>Demandes en cours</td><td className="text-end fw-bold">{statsMutuelle.demandesEnCours}</td></tr>
                  <tr><td>Montant remboursé (mois)</td><td className="text-end fw-bold">{statsMutuelle.montantRembourse.toLocaleString()} DH</td></tr>
                  <tr><td>Taux d'utilisation</td><td className="text-end fw-bold text-info">{statsMutuelle.tauxUtilisation}%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
