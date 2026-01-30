import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { dossiersCNSS, employes } from '../../data/mockData';

export default function DossiersCNSS() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getDossierData = () => {
    return dossiersCNSS.map(d => {
      const emp = employes.find(e => e.id === d.employeId);
      return { ...d, employe: emp ? `${emp.nom} ${emp.prenom}` : 'N/A', matricule: emp?.matricule };
    });
  };

  const columns = [
    { header: 'Matricule', accessor: 'matricule' },
    { header: 'Employé', accessor: 'employe' },
    { header: 'N° CNSS', accessor: 'numeroCNSS', render: (v) => v || <span className="text-muted">Non attribué</span> },
    { header: 'Date Affiliation', accessor: 'dateAffiliation', render: (v) => v || '-' },
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge bg-${v === 'Actif' ? 'success' : 'warning'}`}>{v}</span>
    )},
    { header: 'Dernière MAJ', accessor: 'derniereMaj' },
    { header: 'Actions', accessor: 'id', render: (id) => (
      <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); navigate(`/cnss/dossier/${id}`); }}>
        <i className="bi bi-eye"></i>
      </button>
    )},
  ];

  const filters = [
    { label: 'Rechercher', type: 'text', placeholder: 'Nom, matricule...' },
    { label: 'Statut', type: 'select', options: [
      { value: 'Actif', label: 'Actif' },
      { value: 'En cours', label: 'En cours d\'affiliation' },
    ]},
  ];

  const actions = [
    { label: 'Nouveau dossier', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
    { label: 'Imprimer', icon: 'printer', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'employeId', label: 'Employé', type: 'select', required: true, options: employes.map(e => ({ value: e.id, label: `${e.nom} ${e.prenom}` })) },
    { name: 'numeroCNSS', label: 'Numéro CNSS', type: 'text' },
    { name: 'dateAffiliation', label: 'Date d\'affiliation', type: 'date' },
  ];

  return (
    <div>
      <PageHeader
        title="Dossiers CNSS"
        subtitle="Gestion des dossiers CNSS des employés"
        breadcrumb={[{ label: 'CNSS', path: '/cnss/dashboard' }, { label: 'Dossiers' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />
      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={getDossierData()} onRowClick={(row) => navigate(`/cnss/dossier/${row.id}`)} />
        </div>
      </div>
      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Nouveau dossier CNSS"
        fields={formFields}
        onSubmit={(data) => console.log('Nouveau dossier:', data)}
      />
    </div>
  );
}
