import { useState } from 'react';
import { PageHeader, ActionBar } from '../../components';

export default function ImportExportCNSS() {
  const [importFile, setImportFile] = useState(null);

  const actions = [
    { label: 'Télécharger modèle Excel', icon: 'file-earmark-excel', variant: 'success' },
    { label: 'Télécharger modèle CSV', icon: 'file-earmark-text', variant: 'outline-success' },
  ];

  return (
    <div>
      <PageHeader
        title="Import / Export CNSS"
        subtitle="Import et export de données CNSS (Excel/CSV)"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Import/Export' }]}
      />

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0"><i className="bi bi-upload me-2"></i>Import de données</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Type de données</label>
                <select className="form-select">
                  <option value="">Sélectionner...</option>
                  <option value="employes">Liste des employés</option>
                  <option value="affiliations">Affiliations CNSS</option>
                  <option value="declarations">Déclarations</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Fichier (Excel ou CSV)</label>
                <input type="file" className="form-control" accept=".xlsx,.xls,.csv" onChange={(e) => setImportFile(e.target.files[0])} />
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="skipFirst" />
                <label className="form-check-label" htmlFor="skipFirst">Ignorer la première ligne (en-têtes)</label>
              </div>
              <button className="btn btn-primary w-100" disabled={!importFile}>
                <i className="bi bi-upload me-2"></i>Importer
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0"><i className="bi bi-download me-2"></i>Export de données</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Type de données</label>
                <select className="form-select">
                  <option value="">Sélectionner...</option>
                  <option value="employes">Liste des employés CNSS</option>
                  <option value="declarations">Déclarations CNSS</option>
                  <option value="paiements">Historique paiements</option>
                  <option value="anomalies">Liste anomalies</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Période</label>
                <div className="row">
                  <div className="col-6">
                    <input type="date" className="form-control" placeholder="Du" />
                  </div>
                  <div className="col-6">
                    <input type="date" className="form-control" placeholder="Au" />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Format</label>
                <div className="btn-group w-100">
                  <input type="radio" className="btn-check" name="format" id="excel" defaultChecked />
                  <label className="btn btn-outline-success" htmlFor="excel">Excel (.xlsx)</label>
                  <input type="radio" className="btn-check" name="format" id="csv" />
                  <label className="btn btn-outline-success" htmlFor="csv">CSV</label>
                </div>
              </div>
              <button className="btn btn-success w-100">
                <i className="bi bi-download me-2"></i>Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h6 className="mb-0">Modèles disponibles</h6>
        </div>
        <div className="card-body">
          <ActionBar actions={actions} />
          <table className="table">
            <thead>
              <tr>
                <th>Modèle</th>
                <th>Description</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Modèle employés CNSS</td>
                <td>Template pour import des données employés</td>
                <td><span className="badge bg-success">Excel</span></td>
                <td><button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button></td>
              </tr>
              <tr>
                <td>Modèle déclarations</td>
                <td>Template pour import des déclarations mensuelles</td>
                <td><span className="badge bg-success">Excel</span></td>
                <td><button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
