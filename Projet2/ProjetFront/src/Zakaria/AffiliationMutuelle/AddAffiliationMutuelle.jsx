import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { Box, Typography, IconButton, Button as MuiButton } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, CreditCard, Calendar, MessageSquare, X, FileText } from "lucide-react";
import './AddAffiliationMutuelle.css';

// Configuration de l'instance axios avec credentials
const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
  const [loading, setLoading] = useState(false);

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

      <div className={isSidebar ? "add-affiliation-sidebar" : "add-affiliation-panel"}>
        <div className="panel-container">
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', minHeight: 0 }}>
            {/* Header */}
            <Box className="panel-header" sx={{
              p: 2.5,
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              flexShrink: 0
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FileText size={20} color="#3a8a90" />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '1.1rem' }}>
                  {selectedAffiliation ? 'Modifier Affiliation' : 'Nouvelle Affiliation'}
                </Typography>
              </Box>
              <IconButton
                onClick={toggleAffiliationForm}
                size="small"
                sx={{
                  color: '#6b7280',
                  '&:hover': { backgroundColor: '#f3f4f6' }
                }}
                aria-label="Fermer"
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Body - Scrollable */}
            <Box className="panel-body" sx={{ flex: 1, overflowY: 'auto', p: 3, minHeight: 0 }}>
              <Form onSubmit={handleSubmit}>

                {/* Section: INFORMATIONS EMPLOYÉ */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <User size={16} color="#3a8a90" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Informations Employé
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
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
                            borderColor: errors.employe_id ? '#dc2626' : '#e5e7eb',
                            fontSize: '0.875rem',
                            minHeight: '38px',
                            '&:hover': { borderColor: '#14b8a6' }
                          })
                        }}
                      />
                      {errors.employe_id && (
                        <small className="text-danger">{errors.employe_id}</small>
                      )}
                    </Form.Group>
                  </Box>
                </Box>

                {/* Section: MUTUELLE ET RÉGIME */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <CreditCard size={16} color="#3a8a90" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Mutuelle et Régime
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
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
                            borderColor: errors.mutuelle_id ? '#dc2626' : '#e5e7eb',
                            fontSize: '0.875rem',
                            minHeight: '38px',
                            '&:hover': { borderColor: '#14b8a6' }
                          })
                        }}
                      />
                      {errors.mutuelle_id && (
                        <small className="text-danger">{errors.mutuelle_id}</small>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
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
                            borderColor: errors.regime_mutuelle_id ? '#dc2626' : '#e5e7eb',
                            fontSize: '0.875rem',
                            minHeight: '38px',
                            '&:hover': { borderColor: '#14b8a6' }
                          })
                        }}
                      />
                      {errors.regime_mutuelle_id && (
                        <small className="text-danger">{errors.regime_mutuelle_id}</small>
                      )}
                    </Form.Group>

                    <Form.Group>
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
                        Numéro d'adhérent
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.numero_adherent}
                        onChange={(e) => handleInputChange('numero_adherent', e.target.value)}
                        placeholder="Ex: 12345678"
                        className={errors.numero_adherent ? 'is-invalid' : ''}
                        style={{ fontSize: '0.875rem', height: '38px' }}
                      />
                      {errors.numero_adherent && (
                        <small className="text-danger">{errors.numero_adherent}</small>
                      )}
                    </Form.Group>
                  </Box>
                </Box>

                {/* Section: DATES D'AF FILIATION */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <Calendar size={16} color="#3a8a90" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Dates d'affiliation
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
                          Date d'adhésion *
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.date_adhesion}
                          onChange={(e) => handleInputChange('date_adhesion', e.target.value)}
                          className={errors.date_adhesion ? 'is-invalid' : ''}
                          style={{ fontSize: '0.875rem', height: '38px' }}
                        />
                        {errors.date_adhesion && (
                          <small className="text-danger">{errors.date_adhesion}</small>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
                          Date de résiliation
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.date_resiliation}
                          onChange={(e) => {
                            handleInputChange('date_resiliation', e.target.value);
                            if (e.target.value) {
                              handleInputChange('statut', 'RESILIE');
                            } else {
                              handleInputChange('statut', 'ACTIVE');
                            }
                          }}
                          min={formData.date_adhesion}
                          className={errors.date_resiliation ? 'is-invalid' : ''}
                          style={{ fontSize: '0.875rem', height: '38px' }}
                        />
                        {errors.date_resiliation && (
                          <small className="text-danger d-block">{errors.date_resiliation}</small>
                        )}
                      </Form.Group>
                    </Box>
                    <small className="text-muted" style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.5rem' }}>
                      Laisser la date de résiliation vide si l'affiliation est toujours active
                    </small>
                  </Box>
                </Box>

                {/* Section: STATUT ET AYANTS DROIT */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <FileText size={16} color="#3a8a90" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Statut et Ayants Droit
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
                        Statut
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.date_resiliation ? 'RESILIE' : 'ACTIVE'}
                        disabled
                        style={{
                          backgroundColor: formData.date_resiliation ? '#fef2f2' : '#f0fdf4',
                          color: formData.date_resiliation ? '#dc2626' : '#16a34a',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: '38px'
                        }}
                      />
                      <small className="text-muted" style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.25rem' }}>
                        Le statut est automatique selon la date de résiliation
                      </small>
                    </Form.Group>

                    {/* Section Ayants Droit (Enfants) */}
                    {employeDetails && employeDetails.nb_enfants > 0 && (
                      <div className="mb-3 p-2 bg-white border rounded" style={{ borderColor: '#e5e7eb' }}>
                        <h6 className="mb-2" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                          Ayants droits (Enfants)
                        </h6>
                        <p className="mb-2 text-muted" style={{ fontSize: '0.75rem' }}>
                          Nombre d'enfants : <strong>{employeDetails.nb_enfants}</strong>
                        </p>
                        <Form.Check
                          type="switch"
                          id="ayant-droit-switch"
                          label="Inclure les enfants dans l'affiliation"
                          checked={formData.ayant_droit == 1 || formData.ayant_droit === true}
                          onChange={(e) => handleInputChange('ayant_droit', e.target.checked ? 1 : 0)}
                          style={{ fontWeight: 500, fontSize: '0.8rem' }}
                        />
                      </div>
                    )}

                    {/* Section Situation Familiale (Conjoint) */}
                    {employeDetails && employeDetails.situation_fm === 'married' && employeDetails.nb_enfants === 0 && (
                      <div className="mb-3 p-2 bg-white border rounded" style={{ borderColor: '#e5e7eb' }}>
                        <h6 className="mb-2" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                          Situation Familiale
                        </h6>
                        <p className="mb-2 text-muted" style={{ fontSize: '0.75rem' }}>
                          Situation : <strong>Marié(e)</strong>
                        </p>
                        <Form.Check
                          type="switch"
                          id="conjoint-ayant-droit-switch"
                          label="Inclure le conjoint dans l'affiliation"
                          checked={formData.conjoint_ayant_droit == 1 || formData.conjoint_ayant_droit === true}
                          onChange={(e) => handleInputChange('conjoint_ayant_droit', e.target.checked ? 1 : 0)}
                          style={{ fontWeight: 500, fontSize: '0.8rem' }}
                        />
                      </div>
                    )}
                  </Box>
                </Box>

                {/* Section: COMMENTAIRE */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <MessageSquare size={16} color="#3a8a90" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Commentaire
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.commentaire}
                      onChange={(e) => handleInputChange('commentaire', e.target.value)}
                      placeholder="Commentaire optionnel..."
                      className={errors.commentaire ? 'is-invalid' : ''}
                      style={{ fontSize: '0.875rem' }}
                    />
                    {errors.commentaire && (
                      <small className="text-danger">{errors.commentaire}</small>
                    )}
                  </Box>
                </Box>
              </Form>
            </Box>

            {/* Footer - Sticky Actions */}
            <Box className="panel-footer" sx={{
              position: 'sticky',
              bottom: 0,
              p: 2.5,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              backgroundColor: '#ffffff',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
              zIndex: 10
            }}>
              <MuiButton
                variant="text"
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  color: '#6b7280',
                  '&:hover': {
                    backgroundColor: '#f3f4f6'
                  }
                }}
              >
                Annuler
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#007580ff',
                  color: '#ffffff',
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#3a8a90'
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
                    {selectedAffiliation ? 'Mettre à jour' : 'Enregistrer'}
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