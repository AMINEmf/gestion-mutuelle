import { useState } from 'react';
import { PageHeader, ActionBar } from '../../components';

export default function ImportExportMutuelle() {
  const [importFile, setImportFile] = useState(null);

  const actions = [
    { label: 'Télécharger modèle adhésions', icon: 'file-earmark-excel', variant: 'success' },
    { label: 'Télécharger modèle remboursements', icon: 'file-earmark-text', variant: 'outline-success' },
  ];

  return (
    <div>
      <PageHeader
        title="Import / Export Mutuelle"
        subtitle="Import et export de données Mutuelle (Excel/CSV)"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Import/Export' }]}
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
                  <option value="adhesions">Adhésions mutuelle</option>
                  <option value="ayants-droit">Ayants droit</option>
                  <option value="remboursements">Demandes de remboursement</option>
                  <option value="baremes">Barèmes</option>
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
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="updateExisting" />
                <label className="form-check-label" htmlFor="updateExisting">Mettre à jour les enregistrements existants</label>
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
                  <option value="adhesions">Liste des adhésions</option>
                  <option value="ayants-droit">Liste des ayants droit</option>
                  <option value="remboursements">Historique remboursements</option>
                  <option value="paiements">Paiements effectués</option>
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
                <label className="form-label">Régime</label>
                <select className="form-select">
                  <option value="">Tous les régimes</option>
                  <option value="standard">Régime Standard</option>
                  <option value="premium">Régime Premium</option>
                  <option value="famille">Régime Famille</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Format</label>
                <div className="btn-group w-100">
                  <input type="radio" className="btn-check" name="format" id="excel" defaultChecked />
                  <label className="btn btn-outline-success" htmlFor="excel">Excel</label>
                  <input type="radio" className="btn-check" name="format" id="csv" />
                  <label className="btn btn-outline-success" htmlFor="csv">CSV</label>
                  <input type="radio" className="btn-check" name="format" id="pdf" />
                  <label className="btn btn-outline-success" htmlFor="pdf">PDF</label>
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
                <td>Modèle adhésions</td>
                <td>Template pour import des adhésions mutuelle</td>
                <td><span className="badge bg-success">Excel</span></td>
                <td><button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button></td>
              </tr>
              <tr>
                <td>Modèle ayants droit</td>
                <td>Template pour import des bénéficiaires</td>
                <td><span className="badge bg-success">Excel</span></td>
                <td><button className="btn btn-sm btn-outline-primary"><i className="bi bi-download"></i></button></td>
              </tr>
              <tr>
                <td>Modèle remboursements</td>
                <td>Template pour import des demandes</td>
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
