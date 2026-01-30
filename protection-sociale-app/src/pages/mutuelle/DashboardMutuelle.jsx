import { Link } from 'react-router-dom';
import { PageHeader, StatCard, DataTable } from '../../components';
import { adhesionsMutuelle, ayantsDroit, employes, contratsMutuelle } from '../../data/mockData';

export default function DashboardMutuelle() {
  const primaryColor = '#2c767c';

  // Calculer les statistiques d'affiliation
  const totalAffiliations = adhesionsMutuelle.length;
  const affiliationsActives = adhesionsMutuelle.filter(a => a.statut === 'Actif').length;
  const affiliationsResiliees = adhesionsMutuelle.filter(a => a.statut !== 'Actif').length;
  const totalAyantsDroit = ayantsDroit.length;
  const conjoints = ayantsDroit.filter(a => a.lienParente === 'Conjoint').length;
  const enfants = ayantsDroit.filter(a => a.lienParente === 'Enfant').length;

  // Colonnes pour la table des affiliations récentes
  const affiliationsColumns = [
    { header: 'Employé', accessor: 'employeId', render: (id) => {
      const emp = employes.find(e => e.id === id);
      return emp ? (
        <div>
          <strong>{emp.nom} {emp.prenom}</strong>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>{emp.matricule}</div>
        </div>
      ) : 'N/A';
    }},
    { header: 'Régime', accessor: 'contratId', render: (id) => {
      const contrat = contratsMutuelle.find(c => c.id === id);
      return contrat?.nom || 'N/A';
    }},
    { header: 'Date adhésion', accessor: 'dateAdhesion', render: (v) => new Date(v).toLocaleDateString('fr-FR') },
    { header: 'Ayants droit', accessor: 'nbBeneficiaires', render: (v) => (
      <span className="badge bg-secondary">{v} personne(s)</span>
    )},
    { header: 'Statut', accessor: 'statut', render: (v) => (
      <span className={`badge ${v === 'Actif' ? 'bg-success' : 'bg-danger'}`}>
        <i className={`bi ${v === 'Actif' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
        {v}
      </span>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard Affiliation Mutuelle"
        subtitle="Vue d'ensemble des affiliations et ayants droit"
        breadcrumb={[{ label: 'Mutuelle', path: '/mutuelle' }, { label: 'Dashboard' }]}
      />

      {/* Cartes de statistiques */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard 
            title="Affiliations actives" 
            value={affiliationsActives} 
            icon="heart-pulse-fill" 
            color="success" 
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Affiliations résiliées" 
            value={affiliationsResiliees} 
            icon="x-circle-fill" 
            color="danger" 
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Total ayants droit" 
            value={totalAyantsDroit} 
            icon="people-fill" 
            color="primary" 
          />
        </div>
        <div className="col-md-3">
          <StatCard 
            title="Taux d'affiliation" 
            value={`${Math.round((affiliationsActives / employes.length) * 100)}%`} 
            icon="graph-up-arrow" 
            color="info" 
          />
        </div>
      </div>

      {/* Actions rapides */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card" style={{ border: `1px solid ${primaryColor}20` }}>
            <div className="card-body">
              <h6 className="mb-3" style={{ color: primaryColor }}>
                <i className="bi bi-lightning-fill me-2"></i>Actions rapides
              </h6>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/mutuelle/adhesions" className="btn" style={{ backgroundColor: primaryColor, color: '#fff' }}>
                  <i className="bi bi-plus-circle me-2"></i>Nouvelle affiliation
                </Link>
                <Link to="/mutuelle/ayants-droit" className="btn btn-outline-secondary">
                  <i className="bi bi-people me-2"></i>Gérer les ayants droit
                </Link>
                <Link to="/mutuelle/contrats" className="btn btn-outline-secondary">
                  <i className="bi bi-file-earmark-text me-2"></i>Voir les régimes
                </Link>
                <Link to="/employes" className="btn btn-outline-secondary">
                  <i className="bi bi-person-lines-fill me-2"></i>Liste des employés
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Table des affiliations */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: `${primaryColor}08` }}>
              <h6 className="mb-0" style={{ color: primaryColor }}>
                <i className="bi bi-list-check me-2"></i>Affiliations récentes
              </h6>
              <Link to="/mutuelle/adhesions" className="btn btn-sm" style={{ backgroundColor: primaryColor, color: '#fff' }}>
                Voir tout
              </Link>
            </div>
            <div className="card-body">
              <DataTable columns={affiliationsColumns} data={adhesionsMutuelle.slice(0, 5)} />
            </div>
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="col-md-4">
          {/* Répartition par régime */}
          <div className="card mb-4">
            <div className="card-header" style={{ backgroundColor: `${primaryColor}08` }}>
              <h6 className="mb-0" style={{ color: primaryColor }}>
                <i className="bi bi-pie-chart-fill me-2"></i>Répartition par régime
              </h6>
            </div>
            <div className="card-body">
              {contratsMutuelle.map(contrat => {
                const count = adhesionsMutuelle.filter(a => a.contratId === contrat.id).length;
                const percentage = (count / totalAffiliations) * 100;
                return (
                  <div key={contrat.id} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>{contrat.nom}</span>
                      <span className="fw-bold">{count}</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: contrat.id === 1 ? '#3b82f6' : contrat.id === 2 ? '#10b981' : primaryColor 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ayants droit */}
          <div className="card">
            <div className="card-header" style={{ backgroundColor: `${primaryColor}08` }}>
              <h6 className="mb-0" style={{ color: primaryColor }}>
                <i className="bi bi-people-fill me-2"></i>Ayants droit
              </h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-around text-center">
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ec4899' }}>{conjoints}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    <i className="bi bi-heart me-1"></i>Conjoints
                  </div>
                </div>
                <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '20px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>{enfants}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    <i className="bi bi-person me-1"></i>Enfants
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <Link to="/mutuelle/ayants-droit" className="btn btn-sm w-100" style={{ border: `1px solid ${primaryColor}`, color: primaryColor }}>
                  <i className="bi bi-arrow-right me-1"></i>Gérer les ayants droit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé des champs d'affiliation */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div className="card-body">
              <h6 className="mb-2" style={{ color: '#0369a1' }}>
                <i className="bi bi-info-circle me-2"></i>Champs de l'affiliation mutuelle
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {['employe_id', 'mutuelle_id', 'date_adhesion', 'date_resiliation', 'ayant_droit (conjoint/enfants)', 'statut (actif/résilié)', 'commentaire'].map(field => (
                  <span key={field} className="badge" style={{ backgroundColor: '#0ea5e9', padding: '6px 12px', fontSize: '12px' }}>
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
