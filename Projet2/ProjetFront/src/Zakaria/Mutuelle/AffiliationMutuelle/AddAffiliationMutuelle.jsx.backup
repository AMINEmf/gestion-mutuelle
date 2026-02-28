import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { Box, Typography, Divider, IconButton, Button as MuiButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, CreditCard, Tag, Calendar, CalendarX, Flag, Users, MessageSquare, Save, X, Info, FileText } from "lucide-react";
import './AddAffiliationMutuelle.css';

// Configuration de l'instance axios avec credentials
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

const loaderCSS = `
.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

function AddAffiliationMutuelle({
  toggleAffiliationForm, 
  onAffiliationAdded = () => { },
  selectedAffiliation,
  onAffiliationUpdated,
  fetchAffiliations,
  isSidebar = false
}) {
  const [key, setKey] = useState('home');
  const [loading, setLoading] = useState(false);

  // États pour les champs d'affiliation mutuelle
  const [formData, setFormData] = useState({
    employe_id: '',
    mutuelle_id: '',
    regime_mutuelle_id: '',
    numero_adherent: '',
    date_adhesion: '',
    date_resiliation: '',
    statut: 'ACTIVE',
    ayant_droit: 0,
    conjoint_ayant_droit: 0,
    commentaire: ''
  });

  // États pour les listes déroulantes
  const [employes, setEmployes] = useState([]);
  const [mutuelles, setMutuelles] = useState([]);
  const [regimes, setRegimes] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [selectedMutuelle, setSelectedMutuelle] = useState(null);
  const [selectedRegime, setSelectedRegime] = useState(null);
  
  // État pour les détails de l'employé sélectionné (enfants, situation)
  const [employeDetails, setEmployeDetails] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployes();
    fetchMutuelles();
    
    if (selectedAffiliation) {
      // Mode édition
      setFormData({
        employe_id: selectedAffiliation.employe_id || '',
        mutuelle_id: selectedAffiliation.mutuelle_id || '',
        regime_mutuelle_id: selectedAffiliation.regime_mutuelle_id || '',
        numero_adherent: selectedAffiliation.numero_adherent || '',
        date_adhesion: selectedAffiliation.date_adhesion || '',
        statut: selectedAffiliation.statut || 'Actif',
        ayant_droit: selectedAffiliation.ayant_droit || 0,
        conjoint_ayant_droit: selectedAffiliation.conjoint_ayant_droit || 0,
        commentaire: selectedAffiliation.commentaire || ''
      });

      // Mettre à jour les selects
      if (selectedAffiliation.employe) {
        setSelectedEmploye({
          value: selectedAffiliation.employe_id,
          label: `${selectedAffiliation.employe.matricule} - ${selectedAffiliation.employe.nom} ${selectedAffiliation.employe.prenom}`
        });
        
        // Charger les détails de l'employé pour l'UI conditionnelle
        setEmployeDetails({
          nb_enfants: selectedAffiliation.employe.nb_enfants || 0,
          situation_fm: selectedAffiliation.employe.situation_fm || ''
        });
      }
      
      if (selectedAffiliation.mutuelle) {
        setSelectedMutuelle({
          value: selectedAffiliation.mutuelle_id,
          label: selectedAffiliation.mutuelle.nom
        });
        fetchRegimes(selectedAffiliation.mutuelle_id);
      }

      if (selectedAffiliation.regime) {
        setSelectedRegime({
          value: selectedAffiliation.regime_mutuelle_id,
          label: selectedAffiliation.regime.libelle
        });
      }
    }
  }, [selectedAffiliation]);

  const fetchEmployes = async () => {
    try {
      const response = await api.get('/employes/eligibles-mutuelle');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setEmployes(response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setEmployes(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
      toast.error('Erreur lors du chargement des employés');
    }
  };

  const fetchMutuelles = async () => {
    try {
      const response = await api.get('/mutuelles');
      console.log('Réponse API mutuelles:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setMutuelles(response.data.data);
        console.log('Mutuelles chargées:', response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setMutuelles(response.data);
        console.log('Mutuelles chargées (format direct):', response.data);
      } else {
        setMutuelles([]);
        console.log('Format inattendu:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des mutuelles:', error);
      toast.error('Erreur lors du chargement des mutuelles');
    }
  };

  const fetchRegimes = async (mutuelleId) => {
    try {
      const response = await api.get(`/mutuelles/${mutuelleId}/regimes`);
      console.log('Réponse API régimes:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setRegimes(response.data.data);
        console.log('Régimes chargés:', response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        setRegimes(response.data);
        console.log('Régimes chargés (format direct):', response.data);
      } else {
        setRegimes([]);
        console.log('Format régimes inattendu:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des régimes:', error);
      toast.error('Erreur lors du chargement des régimes');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleEmployeChange = (selectedOption) => {
    setSelectedEmploye(selectedOption);
    if (selectedOption) {
      // Récupérer les détails de l'employé sélectionné
      const emp = employes.find(e => e.id === selectedOption.value);
      const nbEnfants = emp ? (emp.nb_enfants || 0) : 0;
      const situationFm = emp ? (emp.situation_fm || '') : '';

      setEmployeDetails({
        nb_enfants: nbEnfants,
        situation_fm: situationFm
      });

      // Logique automatique pour Ayant Droit
      let autoAyantDroit = 0;
      // Si enfants > 0, on active par défaut (recommandé)
      if (nbEnfants > 0) {
        autoAyantDroit = 1;
      }

      setFormData(prev => ({
        ...prev,
        employe_id: selectedOption.value,
        ayant_droit: autoAyantDroit,
        conjoint_ayant_droit: 0 // Par défaut non coché pour le conjoint
      }));
    } else {
      setEmployeDetails(null);
      setFormData(prev => ({
        ...prev,
        employe_id: '',
        ayant_droit: 0,
        conjoint_ayant_droit: 0
      }));
    }
  };

  const handleMutuelleChange = (selectedOption) => {
    setSelectedMutuelle(selectedOption);
    setSelectedRegime(null);
    setRegimes([]);
    
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        mutuelle_id: selectedOption.value,
        regime_mutuelle_id: ''
      }));
      fetchRegimes(selectedOption.value);
    } else {
      setFormData(prev => ({
        ...prev,
        mutuelle_id: '',
        regime_mutuelle_id: ''
      }));
    }
  };

  const handleRegimeChange = (selectedOption) => {
    setSelectedRegime(selectedOption);
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        regime_mutuelle_id: selectedOption.value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        regime_mutuelle_id: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employe_id) newErrors.employe_id = 'Employé requis';
    if (!formData.mutuelle_id) newErrors.mutuelle_id = 'Mutuelle requise';
    if (!formData.regime_mutuelle_id) newErrors.regime_mutuelle_id = 'Régime requis';
    if (!formData.date_adhesion) newErrors.date_adhesion = 'Date d\'adhésion requise';
    if (!formData.statut) newErrors.statut = 'Statut requis';

    if (formData.ayant_droit && (isNaN(formData.ayant_droit) || formData.ayant_droit < 0)) {
      newErrors.ayant_droit = 'Nombre d\'ayants droit doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      if (selectedAffiliation) {
        const response = await api.put(`/affiliations-mutuelle/${selectedAffiliation.id}`, formData);
        onAffiliationUpdated(response.data);
        toast.success('Affiliation mise à jour avec succès');
      } else {
        const response = await api.post('/affiliations-mutuelle', formData);
        onAffiliationAdded(response.data);
        toast.success('Affiliation créée avec succès');
      }
      
      toggleAffiliationForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erreur lors de la sauvegarde de l\'affiliation');
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    toggleAffiliationForm();
  };

  const employeOptions = employes.map(emp => ({
    value: emp.id,
    label: `${emp.matricule} - ${emp.nom} ${emp.prenom}`
  }));

  const mutuelleOptions = mutuelles.map(mut => ({
    value: mut.id,
    label: mut.nom
  }));

  const regimeOptions = regimes.map(reg => {
    const taux = reg.taux_couverture || reg.taux_remboursement;
    const montant = reg.cotisation_mensuelle || reg.montant;
    
    let label = reg.libelle;
    if (taux) {
      label += ` – ${taux}%`;
    }
    if (montant) {
      label += ` – ${montant} DH/mois`;
    }
    
    return {
      value: reg.id,
      label: label
    };
  });

  return (
    <>
      <style>{loaderCSS}</style>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={isSidebar ? "add-affiliation-sidebar" : "add-affiliation-overlay"}>
        <button
            type="button"
            onClick={toggleAffiliationForm}
            style={{
              position: isSidebar ? "absolute" : "fixed",
              top: isSidebar ? "15px" : "10%",
              right: isSidebar ? "15px" : "20px",
              background: "transparent",
              border: "none",
              fontSize: "2rem",
              color: "#4b5563",
              cursor: "pointer",
              zIndex: 9999,
            }}
            aria-label="Fermer le formulaire"
            title="Fermer"
          >
            &times;
        </button>

        <div className="addper">
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            {/* Header */}
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8f9fa'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={24} color="#00afaa" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                  {selectedAffiliation ? 'Modifier l\'affiliation' : 'Nouvelle affiliation'}
                </Typography>
              </Box>
            </Box>

            {/* Body - Scrollable */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Form onSubmit={handleSubmit}>
                
                {/* Section: Informations Employé */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <User size={18} color="#00afaa" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                      Informations Employé
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Employé *
                      </Form.Label>
                      <Select
                        value={selectedEmploye}
                        onChange={handleEmployeChange}
                        options={employeOptions}
                        placeholder="Sélectionner un employé non affilié..."
                        isClearable
                        isSearchable
                        isDisabled={!!selectedAffiliation}
                        className={errors.employe_id ? 'is-invalid' : ''}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: errors.employe_id ? '#dc2626' : '#d1d5db',
                            '&:hover': { borderColor: '#00afaa' }
                          })
                        }}
                      />
                      {errors.employe_id && (
                        <small className="text-danger">{errors.employe_id}</small>
                      )}
                    </Form.Group>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Section: Mutuelle et Régime */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CreditCard size={18} color="#00afaa" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                      Mutuelle et Régime
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Mutuelle *
                      </Form.Label>
                      <Select
                        value={selectedMutuelle}
                        onChange={handleMutuelleChange}
                        options={mutuelleOptions}
                        placeholder="Sélectionner une mutuelle..."
                        isClearable
                        isSearchable
                        className={errors.mutuelle_id ? 'is-invalid' : ''}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: errors.mutuelle_id ? '#dc2626' : '#d1d5db',
                            '&:hover': { borderColor: '#00afaa' }
                          })
                        }}
                      />
                      {errors.mutuelle_id && (
                        <small className="text-danger">{errors.mutuelle_id}</small>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Régime *
                      </Form.Label>
                      <Select
                        value={selectedRegime}
                        onChange={handleRegimeChange}
                        options={regimeOptions}
                        placeholder="Sélectionner un régime..."
                        isClearable
                        isSearchable
                        isDisabled={!selectedMutuelle}
                        className={errors.regime_mutuelle_id ? 'is-invalid' : ''}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: errors.regime_mutuelle_id ? '#dc2626' : '#d1d5db',
                            '&:hover': { borderColor: '#00afaa' }
                          })
                        }}
                      />
                      {errors.regime_mutuelle_id && (
                        <small className="text-danger">{errors.regime_mutuelle_id}</small>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Numéro d'adhérent
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.numero_adherent}
                        onChange={(e) => handleInputChange('numero_adherent', e.target.value)}
                        placeholder="Ex: 12345678"
                        className={errors.numero_adherent ? 'is-invalid' : ''}
                      />
                      {errors.numero_adherent && (
                        <small className="text-danger">{errors.numero_adherent}</small>
                      )}
                    </Form.Group>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Section: Dates d'affiliation */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Calendar size={18} color="#00afaa" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                      Dates d'affiliation
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Date d'adhésion *
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.date_adhesion}
                        onChange={(e) => handleInputChange('date_adhesion', e.target.value)}
                        className={errors.date_adhesion ? 'is-invalid' : ''}
                      />
                      {errors.date_adhesion && (
                        <small className="text-danger">{errors.date_adhesion}</small>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Date de résiliation
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.date_resiliation}
                        onChange={(e) => {
                          handleInputChange('date_resiliation', e.target.value);
                          // Mettre à jour le statut automatiquement
                          if (e.target.value) {
                            handleInputChange('statut', 'RESILIE');
                          } else {
                            handleInputChange('statut', 'ACTIVE');
                          }
                        }}
                        min={formData.date_adhesion}
                        className={errors.date_resiliation ? 'is-invalid' : ''}
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Laisser vide si l'affiliation est toujours active
                      </small>
                      {errors.date_resiliation && (
                        <small className="text-danger d-block">{errors.date_resiliation}</small>
                      )}
                    </Form.Group>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Section: Statut et Ayants Droit */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Info size={18} color="#00afaa" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                      Statut et Ayants Droit
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        Statut
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.date_resiliation ? 'RESILIE' : 'ACTIVE'}
                        disabled
                        style={{ 
                          backgroundColor: formData.date_resiliation ? '#fef2f2' : '#f0fdf4',
                          color: formData.date_resiliation ? '#dc2626' : '#16a34a',
                          fontWeight: 600
                        }}
                      />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Le statut est automatique selon la date de résiliation
                      </small>
                    </Form.Group>

                    {/* Section Ayants Droit (Enfants) */}
                    {employeDetails && employeDetails.nb_enfants > 0 && (
                      <div className="mb-3 p-3 bg-white border rounded">
                        <h6 className="text-primary mb-2" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          Ayants droits (Enfants)
                        </h6>
                        <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                          Nombre d'enfants : <strong>{employeDetails.nb_enfants}</strong>
                        </p>
                        <Form.Check
                          type="switch"
                          id="ayant-droit-switch"
                          label="Inclure les enfants dans l'affiliation"
                          checked={formData.ayant_droit == 1 || formData.ayant_droit === true}
                          onChange={(e) => handleInputChange('ayant_droit', e.target.checked ? 1 : 0)}
                          style={{ fontWeight: 500 }}
                        />
                      </div>
                    )}

                    {/* Section Situation Familiale (Conjoint) */}
                    {employeDetails && employeDetails.situation_fm === 'married' && employeDetails.nb_enfants === 0 && (
                      <div className="mb-3 p-3 bg-white border rounded">
                        <h6 className="text-primary mb-2" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          Situation Familiale
                        </h6>
                        <p className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
                          Situation : <strong>Marié(e)</strong>
                        </p>
                        <Form.Check
                          type="switch"
                          id="conjoint-ayant-droit-switch"
                          label="Inclure le conjoint dans l'affiliation"
                          checked={formData.conjoint_ayant_droit == 1 || formData.conjoint_ayant_droit === true}
                          onChange={(e) => handleInputChange('conjoint_ayant_droit', e.target.checked ? 1 : 0)}
                          style={{ fontWeight: 500 }}
                        />
                      </div>
                    )}
                    
                    {/* Fallback si pas de données spécifiques mais peut-être modification manuelle voulue
                        Ou laisser vide. Le prompt dit "Si single ET nb_enfants === 0 => pas de sections automatiques".
                    */}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Section: Commentaire */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <MessageSquare size={18} color="#00afaa" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                      Commentaire
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.commentaire}
                      onChange={(e) => handleInputChange('commentaire', e.target.value)}
                      placeholder="Commentaire optionnel..."
                      className={errors.commentaire ? 'is-invalid' : ''}
                    />
                    {errors.commentaire && (
                      <small className="text-danger">{errors.commentaire}</small>
                    )}
                  </Box>
                </Box>
              </Form>
            </Box>

            {/* Footer - Actions */}
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              backgroundColor: '#f8f9fa'
            }}>
              <MuiButton
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb'
                  }
                }}
              >
                <X size={16} style={{ marginRight: '8px' }} />
                Annuler
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#00afaa',
                  '&:hover': {
                    backgroundColor: '#009691'
                  },
                  '&:disabled': {
                    backgroundColor: '#9ca3af'
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="loader me-1"></div>
                    {selectedAffiliation ? 'Mise à jour...' : 'Création...'}
                  </>
                ) : (
                  <>
                    <Save size={16} style={{ marginRight: '8px' }} />
                    {selectedAffiliation ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </MuiButton>
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}

export default AddAffiliationMutuelle;