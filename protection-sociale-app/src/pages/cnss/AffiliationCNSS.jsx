import { useState } from 'react';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { employes, dossiersCNSS } from '../../data/mockData';

export default function AffiliationCNSS() {
  const [showModal, setShowModal] = useState(false);

  const employesNonAffilies = employes.filter(e => {
    const dossier = dossiersCNSS.find(d => d.employeId === e.id);
    return !dossier || !dossier.numeroCNSS;
  });

  const columns = [
    { header: 'Matricule', accessor: 'matricule' },
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'CIN', accessor: 'cin' },
    { header: 'Date embauche', accessor: 'dateEmbauche' },
    { header: 'Poste', accessor: 'poste' },
    { header: 'Statut CNSS', accessor: 'statutCNSS', render: (v) => (
      <span className={`badge bg-${v === 'Affilié' ? 'success' : 'warning'}`}>{v}</span>
    )},
    { header: 'Actions', accessor: 'id', render: () => (
      <button className="btn btn-sm btn-success" onClick={() => setShowModal(true)}>
        <i className="bi bi-person-plus me-1"></i>Affilier
      </button>
    )},
  ];

  const allEmployesColumns = [
    { header: 'Matricule', accessor: 'matricule' },
    { header: 'Employé', accessor: 'nom', render: (v, row) => `${v} ${row.prenom}` },
    { header: 'CIN', accessor: 'cin' },
    { header: 'Date embauche', accessor: 'dateEmbauche' },
    { header: 'N° CNSS', accessor: 'id', render: (id) => {
      const dossier = dossiersCNSS.find(d => d.employeId === id);
      return dossier?.numeroCNSS || <span className="text-muted">Non attribué</span>;
    }},
    { header: 'Statut', accessor: 'statutCNSS', render: (v) => (
      <span className={`badge bg-${v === 'Affilié' ? 'success' : 'warning'}`}>{v}</span>
    )},
  ];

  const filters = [
    { label: 'Rechercher', type: 'text', placeholder: 'Nom, CIN...' },
    { label: 'Département', type: 'select', options: [
      { value: 'IT', label: 'IT' },
      { value: 'Finance', label: 'Finance' },
      { value: 'RH', label: 'RH' },
    ]},
    { label: 'Statut', type: 'select', options: [
      { value: 'non-affilie', label: 'Non affilié' },
      { value: 'en-cours', label: 'En cours' },
    ]},
  ];

  const actions = [
    { label: 'Nouvelle affiliation', icon: 'person-plus', variant: 'success', onClick: () => setShowModal(true) },
    { label: 'Import fichier CNSS', icon: 'upload', variant: 'outline-primary' },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'employeId', label: 'Employé', type: 'select', required: true, col: 12, options: employes.map(e => ({ value: e.id, label: `${e.matricule} - ${e.nom} ${e.prenom}` })) },
    { name: 'numeroCNSS', label: 'Numéro CNSS', type: 'text', required: true },
    { name: 'dateAffiliation', label: 'Date d\'affiliation', type: 'date', required: true },
    { name: 'typeContrat', label: 'Type de contrat', type: 'select', options: [
      { value: 'CDI', label: 'CDI' },
      { value: 'CDD', label: 'CDD' },
    ]},
  ];

  return (
    <div>
      <PageHeader
        title="Affiliation / Immatriculation CNSS"
        subtitle="Gestion des affiliations CNSS des employés"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Affiliation' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <a className="nav-link active" href="#">À affilier ({employesNonAffilies.length})</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Tous les employés</a>
        </li>
      </ul>

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={employesNonAffilies} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle affiliation CNSS"
        fields={formFields}
        onSubmit={(data) => console.log('Affiliation:', data)}
      />
    </div>
  );
}
