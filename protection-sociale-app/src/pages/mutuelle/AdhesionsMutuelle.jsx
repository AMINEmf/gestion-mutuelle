import { useState } from 'react';
import { PageHeader, DeptEmployeeLayout, FormField } from '../../components';
import { departements, employesWithDept, mutuelleData } from '../../data/departements';
import { contratsMutuelle, ayantsDroit } from '../../data/mockData';

export default function AdhesionsMutuelle() {
  const primaryColor = '#2c767c'; // Couleur principale

  // État du formulaire pour gérer la validation conditionnelle
  const [formData, setFormData] = useState({
    statut: 'actif',
    dateResiliation: ''
  });

  // Obtenir les données Mutuelle d'un employé
  const getMutuelleInfo = (employee) => {
    return mutuelleData.find((m) => m.employeId === employee.id);
  };

  // Obtenir les ayants droit d'un employé
  const getAyantsDroit = (employeeId) => {
    const adhesion = mutuelleData.find(m => m.employeId === employeeId);
    if (!adhesion) return { conjoint: null, enfants: [] };
    
    const allAyants = ayantsDroit.filter(a => a.adhesionId === adhesion.id);
    return {
      conjoint: allAyants.find(a => a.lienParente === 'Conjoint'),
      enfants: allAyants.filter(a => a.lienParente === 'Enfant')
    };
  };

  // Compter les ayants droit
  const getDataCount = (employee) => {
    const mut = getMutuelleInfo(employee);
    return mut?.nbBeneficiaires || 0;
  };

  // Badge de statut
  const renderStatutBadge = (statut) => {
    const isActif = statut?.toLowerCase() === 'actif';
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: isActif ? '#d1fae5' : '#fee2e2',
        color: isActif ? '#059669' : '#dc2626'
      }}>
        <i className={`bi ${isActif ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
        {isActif ? 'Actif' : 'Résilié'}
      </span>
    );
  };

  // Rendu des détails dans l'accordion
  const renderDetails = (employee, { onEdit, onDelete }) => {
    const mut = getMutuelleInfo(employee);
    const { conjoint, enfants } = getAyantsDroit(employee.id);

    if (!mut || !mut.numeroAdherent) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
          <i className="bi bi-heart-pulse" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
          <p style={{ margin: 0 }}>Aucune affiliation mutuelle trouvée</p>
          <button
            onClick={() => onEdit(null)}
            style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            <i className="bi bi-plus me-2"></i>Créer une affiliation
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* Informations principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Employé (ID)</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: primaryColor }}>{employee.matricule} - {employee.nom} {employee.prenom}</div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Mutuelle (Régime)</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#2c3e50' }}>{mut.contratType}</div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Statut</div>
            {renderStatutBadge(mut.statut || 'Actif')}
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Date d'adhésion</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#2c3e50' }}>
              <i className="bi bi-calendar-check me-2" style={{ color: '#059669' }}></i>
              {mut.dateAdhesion ? new Date(mut.dateAdhesion).toLocaleDateString('fr-FR') : '-'}
            </div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Date de résiliation</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: mut.dateResiliation ? '#dc2626' : '#9ca3af' }}>
              <i className="bi bi-calendar-x me-2"></i>
              {mut.dateResiliation ? new Date(mut.dateResiliation).toLocaleDateString('fr-FR') : 'Non résilié'}
            </div>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>Cotisation mensuelle</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#2c3e50' }}>{mut.cotisationMensuelle?.toLocaleString('fr-FR')} DH</div>
          </div>
        </div>

        {/* Section Ayants Droit */}
        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h6 style={{ margin: 0, marginBottom: '12px', fontSize: '13px', color: primaryColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-people-fill"></i>Ayants Droit
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Conjoint */}
            <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>
                <i className="bi bi-heart me-1"></i>Conjoint
              </div>
              {conjoint ? (
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                  {conjoint.prenom} {conjoint.nom}
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    Né(e) le {new Date(conjoint.dateNaissance).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>Non renseigné</div>
              )}
            </div>
            {/* Enfants */}
            <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>
                <i className="bi bi-person-badge me-1"></i>Enfants ({enfants.length})
              </div>
              {enfants.length > 0 ? (
                <div style={{ fontSize: '14px' }}>
                  {enfants.map((e, idx) => (
                    <div key={e.id} style={{ fontWeight: '500', color: '#1f2937', marginBottom: idx < enfants.length - 1 ? '4px' : 0 }}>
                      {e.prenom} {e.nom}
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                        ({new Date(e.dateNaissance).toLocaleDateString('fr-FR')})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>Aucun enfant</div>
              )}
            </div>
          </div>
        </div>

        {/* Commentaire */}
        {mut.commentaire && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fefce8', borderRadius: '8px', border: '1px solid #fef08a' }}>
            <div style={{ fontSize: '11px', color: '#a16207', marginBottom: '4px', textTransform: 'uppercase' }}>
              <i className="bi bi-chat-left-text me-1"></i>Commentaire
            </div>
            <div style={{ fontSize: '14px', color: '#713f12' }}>{mut.commentaire}</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={() => onEdit(mut)} style={{ padding: '8px 16px', backgroundColor: primaryColor, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <i className="bi bi-pencil"></i>Modifier
          </button>
          <button onClick={() => onDelete(mut)} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#e74c3c', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <i className="bi bi-trash"></i>Supprimer
          </button>
        </div>
      </div>
    );
  };

  // Gestion du changement de statut dans le formulaire
  const handleStatutChange = (e) => {
    setFormData(prev => ({
      ...prev,
      statut: e.target.value,
      dateResiliation: e.target.value === 'actif' ? '' : prev.dateResiliation
    }));
  };

  // Formulaire complet d'affiliation
  const renderForm = ({ employee, data }) => {
    const currentStatut = data?.statut?.toLowerCase() || formData.statut;
    const isResilie = currentStatut === 'résilié' || currentStatut === 'resilie';

    return (
      <div>
        {/* En-tête du formulaire */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f0fdfa', borderRadius: '8px', border: `1px solid ${primaryColor}30` }}>
          <h6 style={{ margin: 0, marginBottom: '8px', fontSize: '13px', color: primaryColor, fontWeight: '600' }}>
            <i className="bi bi-heart-pulse me-2"></i>Affiliation Mutuelle
          </h6>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
            {data ? "Modifiez les informations de l'affiliation." : 'Créez une nouvelle affiliation mutuelle.'}
          </p>
        </div>

        {/* Employé (lecture seule) */}
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
          <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
            <i className="bi bi-person-badge me-1"></i>Employé (employe_id)
          </label>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            #{employee?.id} - {employee?.matricule} - {employee?.nom} {employee?.prenom}
          </div>
        </div>

        {/* Sélection Mutuelle/Régime */}
        <FormField
          label="Mutuelle / Régime (mutuelle_id)"
          name="mutuelle_id"
          type="select"
          value={data?.contratType || 'Régime Standard'}
          options={contratsMutuelle.map(c => ({ 
            value: c.id.toString(), 
            label: `${c.nom} - Couverture ${c.tauxCouverture}% - ${c.cotisationMensuelle} DH/mois` 
          }))}
          required
          primaryColor={primaryColor}
          icon="bi-shield-plus"
        />

        {/* Date d'adhésion */}
        <FormField 
          label="Date d'adhésion (date_adhesion)" 
          name="date_adhesion" 
          type="date" 
          value={data?.dateAdhesion || employee?.dateEmbauche || ''} 
          required 
          primaryColor={primaryColor}
          icon="bi-calendar-check"
        />

        {/* Statut avec validation conditionnelle */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            <i className="bi bi-toggle-on me-1" style={{ color: primaryColor }}></i>
            Statut (statut) <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 16px', 
              border: `2px solid ${!isResilie ? primaryColor : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: !isResilie ? `${primaryColor}10` : '#fff',
              transition: 'all 0.2s'
            }}>
              <input 
                type="radio" 
                name="statut" 
                value="actif" 
                checked={!isResilie}
                onChange={handleStatutChange}
                style={{ accentColor: primaryColor }}
              />
              <i className="bi bi-check-circle-fill" style={{ color: '#059669' }}></i>
              <span style={{ fontWeight: '500' }}>Actif</span>
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 16px', 
              border: `2px solid ${isResilie ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: isResilie ? '#fef2f2' : '#fff',
              transition: 'all 0.2s'
            }}>
              <input 
                type="radio" 
                name="statut" 
                value="résilié" 
                checked={isResilie}
                onChange={handleStatutChange}
                style={{ accentColor: '#dc2626' }}
              />
              <i className="bi bi-x-circle-fill" style={{ color: '#dc2626' }}></i>
              <span style={{ fontWeight: '500' }}>Résilié</span>
            </label>
          </div>
        </div>

        {/* Date de résiliation (obligatoire si statut = résilié) */}
        <div style={{ 
          marginBottom: '16px',
          opacity: isResilie ? 1 : 0.5,
          pointerEvents: isResilie ? 'auto' : 'none'
        }}>
          <FormField 
            label={`Date de résiliation (date_resiliation) ${isResilie ? '*' : ''}`}
            name="date_resiliation" 
            type="date" 
            value={data?.dateResiliation || formData.dateResiliation || ''} 
            required={isResilie}
            primaryColor={primaryColor}
            icon="bi-calendar-x"
          />
          {isResilie && !formData.dateResiliation && !data?.dateResiliation && (
            <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '-12px', marginBottom: '16px' }}>
              <i className="bi bi-exclamation-triangle me-1"></i>
              La date de résiliation est obligatoire si le statut est "Résilié"
            </div>
          )}
        </div>

        {/* Séparateur Ayants Droit */}
        <div style={{ margin: '24px 0', borderTop: '2px dashed #e5e7eb', paddingTop: '24px' }}>
          <h6 style={{ margin: 0, marginBottom: '16px', fontSize: '14px', color: '#374151', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-people-fill" style={{ color: primaryColor }}></i>
            Ayants Droit (ayant_droit)
          </h6>

          {/* Conjoint */}
          <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <i className="bi bi-heart" style={{ color: '#ec4899' }}></i>
              Conjoint
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField 
                label="Nom du conjoint" 
                name="conjoint_nom" 
                type="text" 
                placeholder="Nom de famille"
                primaryColor={primaryColor}
              />
              <FormField 
                label="Prénom du conjoint" 
                name="conjoint_prenom" 
                type="text" 
                placeholder="Prénom"
                primaryColor={primaryColor}
              />
              <FormField 
                label="CIN" 
                name="conjoint_cin" 
                type="text" 
                placeholder="Ex: AB123456"
                primaryColor={primaryColor}
              />
              <FormField 
                label="Date de naissance" 
                name="conjoint_date_naissance" 
                type="date" 
                primaryColor={primaryColor}
              />
            </div>
          </div>

          {/* Enfants */}
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', color: '#374151', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="bi bi-person-badge" style={{ color: '#3b82f6' }}></i>
                Enfants
              </label>
              <button 
                type="button"
                style={{ 
                  padding: '6px 12px', 
                  backgroundColor: primaryColor, 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <i className="bi bi-plus"></i>Ajouter enfant
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <FormField 
                label="Prénom" 
                name="enfant_1_prenom" 
                type="text" 
                placeholder="Prénom de l'enfant"
                primaryColor={primaryColor}
              />
              <FormField 
                label="Date de naissance" 
                name="enfant_1_date_naissance" 
                type="date" 
                primaryColor={primaryColor}
              />
              <FormField 
                label="Lien" 
                name="enfant_1_lien" 
                type="select"
                value="Enfant"
                options={[{ value: 'Enfant', label: 'Enfant' }]}
                primaryColor={primaryColor}
              />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>
              <i className="bi bi-info-circle me-1"></i>
              Vous pourrez ajouter d'autres enfants après la création de l'affiliation.
            </p>
          </div>
        </div>

        {/* Commentaire */}
        <FormField 
          label="Commentaire (commentaire)" 
          name="commentaire" 
          type="textarea" 
          placeholder="Notes, observations ou remarques sur cette affiliation..." 
          rows={4} 
          primaryColor={primaryColor}
          icon="bi-chat-left-text"
        />

        {/* Résumé des champs */}
        <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>
            <i className="bi bi-info-circle me-1"></i>CHAMPS DE L'AFFILIATION
          </div>
          <div style={{ fontSize: '11px', color: '#0c4a6e' }}>
            employe_id • mutuelle_id • date_adhesion • date_resiliation • ayant_droit (conjoint/enfants) • statut (actif/résilié) • commentaire
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Affiliations Mutuelle"
        subtitle="Gestion des affiliations mutuelle par département et employé"
        breadcrumb={[{ label: 'Affiliations Mutuelle' }]}
      />
      <DeptEmployeeLayout
        departments={departements}
        employees={employesWithDept}
        title="Employés - Affiliations Mutuelle"
        dataLabel="ayants droit"
        getDataCount={getDataCount}
        renderDetails={renderDetails}
        renderForm={renderForm}
        formTitle="Affiliation Mutuelle"
        onSubmit={(emp, data) => {
          // Validation: si statut = résilié, date_resiliation obligatoire
          if (data.statut === 'résilié' && !data.date_resiliation) {
            alert('La date de résiliation est obligatoire si le statut est "Résilié"');
            return;
          }
          console.log('Affiliation soumise:', { employe_id: emp.id, ...data });
        }}
        primaryColor={primaryColor}
      />
    </div>
  );
}
