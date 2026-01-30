import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, ActionBar } from '../../components';
import { employes, baremesMutuelle } from '../../data/mockData';

export default function NouvelleDemandeRemboursement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Demande:', formData);
    navigate('/mutuelle/remboursements');
  };

  const actions = [
    { label: 'Retour à la liste', icon: 'arrow-left', variant: 'outline-secondary', onClick: () => navigate('/mutuelle/remboursements') },
  ];

  return (
    <div>
      <PageHeader
        title="Nouvelle Demande de Remboursement"
        subtitle="Créer une demande de remboursement mutuelle"
        breadcrumb={[
          { label: 'Mutuelle', path: '/mutuelle/dashboard' },
          { label: 'Remboursements', path: '/mutuelle/remboursements' },
          { label: 'Nouvelle demande' }
        ]}
      />
      <ActionBar actions={actions} />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Employé / Adhérent *</label>
                <select className="form-select" required onChange={(e) => handleChange('employeId', e.target.value)}>
                  <option value="">Sélectionner un employé...</option>
                  {employes.map(e => (
                    <option key={e.id} value={e.id}>{e.matricule} - {e.nom} {e.prenom}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Bénéficiaire</label>
                <select className="form-select" onChange={(e) => handleChange('beneficiaire', e.target.value)}>
                  <option value="adherent">Adhérent lui-même</option>
                  <option value="conjoint">Conjoint</option>
                  <option value="enfant">Enfant</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Type de soin *</label>
                <select className="form-select" required onChange={(e) => handleChange('typeSoin', e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {baremesMutuelle.map(b => (
                    <option key={b.id} value={b.typeSoin}>{b.typeSoin} (Remb. {b.tauxRemboursement}%)</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Date des soins *</label>
                <input type="date" className="form-control" required onChange={(e) => handleChange('dateSoins', e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Montant total (DH) *</label>
                <input type="number" className="form-control" required placeholder="0.00" onChange={(e) => handleChange('montant', e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Montant pris en charge AMO</label>
                <input type="number" className="form-control" placeholder="0.00" onChange={(e) => handleChange('montantAMO', e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Reste à charge</label>
                <input type="number" className="form-control" placeholder="0.00" readOnly />
              </div>
              <div className="col-md-12">
                <label className="form-label">Prestataire de soins</label>
                <input type="text" className="form-control" placeholder="Nom du médecin, clinique, pharmacie..." onChange={(e) => handleChange('prestataire', e.target.value)} />
              </div>
              <div className="col-md-12">
                <label className="form-label">Justificatifs</label>
                <input type="file" className="form-control" multiple accept=".pdf,.jpg,.png" />
                <small className="text-muted">Ordonnances, factures, feuilles de soins (PDF, JPG, PNG)</small>
              </div>
              <div className="col-md-12">
                <label className="form-label">Observations</label>
                <textarea className="form-control" rows={3} placeholder="Informations complémentaires..." onChange={(e) => handleChange('observations', e.target.value)}></textarea>
              </div>
            </div>

            <hr className="my-4" />

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/mutuelle/remboursements')}>Annuler</button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-send me-2"></i>Soumettre la demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
