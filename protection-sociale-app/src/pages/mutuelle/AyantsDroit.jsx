import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, ActionBar, Filters, DataTable, ModalForm } from '../../components';
import { ayantsDroit, adhesionsMutuelle, employes } from '../../data/mockData';

export default function AyantsDroit() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getData = () => {
    return ayantsDroit.map(a => {
      const adhesion = adhesionsMutuelle.find(ad => ad.id === a.adhesionId);
      const emp = employes.find(e => e.id === adhesion?.employeId);
      return { ...a, adherent: emp ? `${emp.nom} ${emp.prenom}` : 'N/A' };
    });
  };

  const columns = [
    { header: 'Adhérent', accessor: 'adherent' },
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'Lien de parenté', accessor: 'lienParente', render: (v) => (
      <span className={`badge bg-${v === 'Conjoint' ? 'primary' : 'info'}`}>{v}</span>
    )},
    { header: 'Date naissance', accessor: 'dateNaissance' },
    { header: 'CIN', accessor: 'cin', render: (v) => v || <span className="text-muted">Mineur</span> },
    { header: 'Actions', accessor: 'id', render: (id) => (
      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/mutuelle/ayant-droit/${id}`)}>
        <i className="bi bi-eye"></i>
      </button>
    )},
  ];

  const filters = [
    { label: 'Adhérent', type: 'text', placeholder: 'Rechercher...' },
    { label: 'Lien', type: 'select', options: [
      { value: 'Conjoint', label: 'Conjoint' },
      { value: 'Enfant', label: 'Enfant' },
      { value: 'Parent', label: 'Parent' },
    ]},
  ];

  const actions = [
    { label: 'Ajouter ayant droit', icon: 'plus', variant: 'primary', onClick: () => setShowModal(true) },
    { label: 'Exporter', icon: 'download', variant: 'outline-secondary' },
  ];

  const formFields = [
    { name: 'adhesionId', label: 'Adhérent', type: 'select', required: true, col: 12, options: adhesionsMutuelle.map(a => {
      const emp = employes.find(e => e.id === a.employeId);
      return { value: a.id, label: emp ? `${emp.nom} ${emp.prenom}` : 'N/A' };
    })},
    { name: 'nom', label: 'Nom', type: 'text', required: true },
    { name: 'prenom', label: 'Prénom', type: 'text', required: true },
    { name: 'lienParente', label: 'Lien de parenté', type: 'select', required: true, options: [
      { value: 'Conjoint', label: 'Conjoint' },
      { value: 'Enfant', label: 'Enfant' },
      { value: 'Parent', label: 'Parent' },
    ]},
    { name: 'dateNaissance', label: 'Date de naissance', type: 'date', required: true },
    { name: 'cin', label: 'CIN (si majeur)', type: 'text' },
  ];

  return (
    <div>
      <PageHeader
        title="Ayants Droit / Bénéficiaires"
        subtitle="Liste des ayants droit des adhérents"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle/dashboard' }, { label: 'Ayants Droit' }]}
      />
      <ActionBar actions={actions} />
      <Filters filters={filters} />

      <div className="card">
        <div className="card-body">
          <DataTable columns={columns} data={getData()} />
        </div>
      </div>

      <ModalForm
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Ajouter un ayant droit"
        fields={formFields}
        onSubmit={(data) => console.log('Ayant droit:', data)}
      />
    </div>
  );
}
