import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Form, Button as BsButton } from 'react-bootstrap';
import { Box, Typography, IconButton, Button as MuiButton } from '@mui/material';
import {
  showSuccessToast,
  showErrorToast,
  showErrorFromResponse,
  STANDARD_MESSAGES
} from '../../utils/messageHelper';
import { User, CreditCard, Calendar, MessageSquare, X, FileText, Plus } from "lucide-react";
import './AddAffiliationMutuelle.css';
import EmployeInfoReadonly from './EmployeInfoReadonly';
import ManageResourceModal from '../MutuelleDossier/ManageResourceModal';

// Configuration de l'instance axios avec credentials
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const normalizeDate = (date) => (date ? date.split("T")[0] : "");

const resolveStatut = (affiliation) => {
  if (!affiliation) return "";

  const rawStatut = affiliation.statut ? affiliation.statut.toString().toUpperCase() : "";
  if (rawStatut) {
    if (rawStatut.includes("RESILI")) return "RESILIE";
    if (rawStatut.includes("ACTI")) return "ACTIVE";
    return rawStatut;
  }

  if (affiliation.date_resiliation || affiliation.date_fin) return "RESILIE";
  return "ACTIVE";
};

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
    statut: '',
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
  const [employeInfo, setEmployeInfo] = useState({});

  // État pour les détails de l'employé sélectionné (enfants, situation)
  const [employeDetails, setEmployeDetails] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modals gestion mutuelles et régimes
  const [showMutuelleModal, setShowMutuelleModal] = useState(false);
  const [showRegimeModal, setShowRegimeModal] = useState(false);

  const broadcastMutuellesUpdate = (list = []) => {
    try {
      if (Array.isArray(list)) {
        localStorage.setItem('mutuelles', JSON.stringify(list));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mutuelles:updated', { detail: list }));
      }
    } catch (err) {
      console.error('Broadcast mutuelles failed', err);
    }
  };

  // --- Handlers CRUD Mutuelle pour le modal ---
  const getMutuellesForModal = async () => {
    try {
      const res = await api.get('/mutuelles');
      const data = res.data?.data || res.data;
      const list = Array.isArray(data) ? data : [];
      return list.map(m => ({ id: m.id, nom: m.nom, label: m.nom }));
    } catch (e) { return []; }
  };

  const addMutuelleForModal = async (nom) => {
    await api.post('/mutuelles', { nom });
    await fetchMutuelles();
  };

  const editMutuelleForModal = async (id, nom) => {
    await api.put(`/mutuelles/${id}`, { nom });
    await fetchMutuelles();
  };

  const deleteMutuelleForModal = async (id) => {
    await api.delete(`/mutuelles/${id}`);
    await fetchMutuelles();
  };

  // --- Handlers CRUD Régime pour le modal ---
  const getRegimesForModal = async () => {
    if (!formData.mutuelle_id) return [];
    try {
      const res = await api.get(`/mutuelles/${formData.mutuelle_id}/regimes`);
      const data = res.data?.data || res.data;
      const list = Array.isArray(data) ? data : [];
      return list.map(r => ({ id: r.id, nom: r.libelle, label: r.libelle }));
    } catch (e) { return []; }
  };

  const addRegimeForModal = async (libelle) => {
    await api.post(`/mutuelles/${formData.mutuelle_id}/regimes`, { libelle });
    await fetchRegimes(formData.mutuelle_id);
  };

  const editRegimeForModal = async (id, libelle) => {
    await api.put(`/mutuelles/${formData.mutuelle_id}/regimes/${id}`, { libelle });
    await fetchRegimes(formData.mutuelle_id);
  };

  const deleteRegimeForModal = async (id) => {
    await api.delete(`/mutuelles/${formData.mutuelle_id}/regimes/${id}`);
    await fetchRegimes(formData.mutuelle_id);
  };

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
        date_adhesion: normalizeDate(selectedAffiliation.date_adhesion),
        date_resiliation: normalizeDate(selectedAffiliation.date_resiliation || selectedAffiliation.date_fin),
        statut: resolveStatut({
          ...selectedAffiliation,
          date_resiliation: normalizeDate(selectedAffiliation.date_resiliation || selectedAffiliation.date_fin),
        }),
        ayant_droit: selectedAffiliation.ayant_droit || 0,
        conjoint_ayant_droit: selectedAffiliation.conjoint_ayant_droit || 0,
        commentaire: selectedAffiliation.commentaire || ''
      });

      if (selectedAffiliation.employe) {
        setEmployeInfo({
          cin: selectedAffiliation.employe.cin || '',
          date_naiss: normalizeDate(selectedAffiliation.employe.date_naiss),
          situation_fm: selectedAffiliation.employe.situation_fm || '',
          adresse: selectedAffiliation.employe.adresse || '',
          date_embauche: normalizeDate(selectedAffiliation.employe.date_embauche),
          cnss: selectedAffiliation.employe.cnss || '',
          statut_affiliation: resolveStatut(selectedAffiliation)
        });

        // Add this to fill readonly fields in the form
        setFormData(prev => ({
          ...prev,
          cin: selectedAffiliation.employe.cin || '',
          date_naiss: normalizeDate(selectedAffiliation.employe.date_naiss),
          situation_fm: selectedAffiliation.employe.situation_fm || '',
          adresse: selectedAffiliation.employe.adresse || '',
          date_embauche: normalizeDate(selectedAffiliation.employe.date_embauche),
        }));
      } else {
        setEmployeInfo({});
      }

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
      showErrorToast('Erreur lors du chargement des employés');
    }
  };

  const fetchMutuelles = async () => {
    try {
      const response = await api.get('/mutuelles');
      console.log('Réponse API mutuelles:', response.data);

      let list = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        list = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        list = response.data;
      }

      setMutuelles(list);
      broadcastMutuellesUpdate(list);
      console.log('Mutuelles chargées:', list);
      return list;
    } catch (error) {
      console.error('Erreur lors de la récupération des mutuelles:', error);
      showErrorToast('Erreur lors du chargement des mutuelles', 3000);
      return [];
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
      showErrorToast('Erreur lors du chargement des mutuelles');
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

      setFormData(prev => ({
        ...prev,
        employe_id: selectedOption.value,
        ayant_droit: nbEnfants > 0 ? 1 : 0,
        conjoint_ayant_droit: 0
      }));

      setEmployeInfo({
        cin: emp?.cin || '',
        date_naiss: normalizeDate(emp?.date_naiss),
        situation_fm: emp?.situation_fm || '',
        adresse: emp?.adresse || '',
        date_embauche: normalizeDate(emp?.date_embauche),
        cnss: emp?.cnss || '',
        statut_affiliation: formData.statut || (formData.date_resiliation ? 'RESILIE' : 'ACTIVE')
      });
    } else {
      setEmployeDetails(null);
      setFormData(prev => ({
        ...prev,
        employe_id: '',
        ayant_droit: 0,
        conjoint_ayant_droit: 0
      }));
      setEmployeInfo({});
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

  // -------------------------------
  // Auto ayants droit (conjoint / enfants) selon situation familiale + nb enfants
  // -------------------------------
  useEffect(() => {
    const nbEnfants = Number(employeDetails?.nb_enfants || 0);
    const situation = (employeDetails?.situation_fm || '').toString().toLowerCase();
    const isMarried = situation.includes('mar');

    const hasExistingAyant = selectedAffiliation !== null && selectedAffiliation !== undefined &&
      selectedAffiliation.ayant_droit !== undefined && selectedAffiliation.ayant_droit !== null;
    const hasExistingConjoint = selectedAffiliation !== null && selectedAffiliation !== undefined &&
      selectedAffiliation.conjoint_ayant_droit !== undefined && selectedAffiliation.conjoint_ayant_droit !== null;

    const defaultAyant = isMarried || nbEnfants > 0 ? 1 : 0;
    const defaultConjoint = isMarried ? 1 : 0;

    const nextAyant = hasExistingAyant ? selectedAffiliation.ayant_droit : defaultAyant;
    const nextConjoint = hasExistingConjoint ? selectedAffiliation.conjoint_ayant_droit : defaultConjoint;

    setFormData(prev => {
      if (prev.ayant_droit === nextAyant && prev.conjoint_ayant_droit === nextConjoint) return prev;
      return {
        ...prev,
        ayant_droit: nextAyant,
        conjoint_ayant_droit: nextConjoint
      };
    });
  }, [employeDetails, selectedAffiliation]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employe_id) newErrors.employe_id = 'Employé requis';
    if (!formData.mutuelle_id) newErrors.mutuelle_id = 'Mutuelle requise';
    if (!formData.regime_mutuelle_id) newErrors.regime_mutuelle_id = 'Régime requis';
    if (!formData.date_adhesion) newErrors.date_adhesion = 'Date d\'adhésion requise';
    const validatedStatut = formData.statut || (formData.date_resiliation ? 'RESILIE' : 'ACTIVE');
    if (!validatedStatut) newErrors.statut = 'Statut requis';

    if (formData.ayant_droit && (isNaN(formData.ayant_droit) || formData.ayant_droit < 0)) {
      newErrors.ayant_droit = 'Nombre d\'ayants droit doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast(STANDARD_MESSAGES.VALIDATION_ERROR);
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    const payload = {
      ...formData,
      statut: formData.statut || (formData.date_resiliation ? 'RESILIE' : 'ACTIVE'),
    };

    try {
      if (selectedAffiliation) {
        const response = await api.put(`/affiliations-mutuelle/${selectedAffiliation.id}`, payload);
        onAffiliationUpdated(response.data);
        showSuccessToast(STANDARD_MESSAGES.UPDATE_SUCCESS);
      } else {
        const response = await api.post('/affiliations-mutuelle', payload);
        onAffiliationAdded(response.data);
        showSuccessToast(STANDARD_MESSAGES.CREATE_SUCCESS);
      }

      toggleAffiliationForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data?.message) {
        showErrorFromResponse(error, 'Erreur de sauvegarde');
      } else {
        showErrorToast('Erreur lors de la sauvegarde de l\'affiliation');
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

  const computedStatut = formData.statut || (formData.date_resiliation ? 'RESILIE' : 'ACTIVE');
  const isResilie = computedStatut === 'RESILIE';
  const nbEnfants = Number(employeDetails?.nb_enfants || 0);
  const situationFm = (employeDetails?.situation_fm || '').toString().toLowerCase();
  const isMarried = situationFm.includes('mar');
  const showChildren = isMarried && nbEnfants > 0;
  const showConjoint = isMarried;
  const displayDate = (d) => (d ? d : '');

  // Synchronise le statut affiché dans le bloc Employé lorsque l'utilisateur change la date de résiliation/statut
  useEffect(() => {
    if (!employeInfo) return;
    const nextStatut = formData.statut || (formData.date_resiliation ? 'RESILIE' : 'ACTIVE');
    if (employeInfo.statut_affiliation !== nextStatut) {
      setEmployeInfo(prev => ({ ...prev, statut_affiliation: nextStatut }));
    }
  }, [formData.statut, formData.date_resiliation, employeInfo]);

  // Forcer les toggles enfants / conjoint ON quand visibles, OFF sinon (lecture seule)
  useEffect(() => {
    setFormData(prev => {
      const nextAyant = showChildren ? 1 : 0;
      const nextConjoint = showConjoint ? 1 : 0;
      if (prev.ayant_droit === nextAyant && prev.conjoint_ayant_droit === nextConjoint) return prev;
      return { ...prev, ayant_droit: nextAyant, conjoint_ayant_droit: nextConjoint };
    });
  }, [showChildren, showConjoint]);

  return (
    <>
      <style>{loaderCSS}</style>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={isSidebar ? "add-affiliation-sidebar" : "add-affiliation-panel"}>
        <div className="panel-container">
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', minHeight: 0 }}>
            {/* Header */}
            <Box className="panel-header" sx={{
              p: 2,
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              flexShrink: 0,
              position: 'relative'
            }}>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: '#4b5563',
                fontSize: '1.1rem',
                textAlign: 'center',
                width: '100%'
              }}>
                {selectedAffiliation ? 'Modifier Affiliation' : 'Nouvelle Affiliation'}
              </Typography>
              <IconButton
                onClick={toggleAffiliationForm}
                size="small"
                sx={{
                  color: '#64748b',
                  position: 'absolute',
                  right: 16,
                  '&:hover': { backgroundColor: '#f1f5f9' }
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
                    <User size={16} color="#64748b" />                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4b5563', fontSize: '0.85rem', letterSpacing: '0.02em', textTransform: 'none' }}>
                      Informations Employé
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    {/* Employé - pleine largeur */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
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
                            fontSize: '0.875rem',
                            minHeight: '40px',
                            borderRadius: '6px',
                            '&:hover': { borderColor: '#9ca3af' }
                          })
                        }}
                      />
                      {errors.employe_id && (
                        <small className="text-danger">{errors.employe_id}</small>
                      )}
                    </Form.Group>

                    {/* Informations employé (lecture seule) */}
                    {employeInfo && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af', fontSize: '0.6875rem', letterSpacing: '0.05em', textTransform: 'none', display: 'block', mb: 1.5 }}>
                          Informations employé (lecture seule)
                        </Typography>
                        <EmployeInfoReadonly employeInfo={employeInfo} />
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Section: DÉTAILS AFFILIATION */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <Calendar size={16} color="#64748b" />                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4b5563', fontSize: '0.85rem', letterSpacing: '0.02em', textTransform: 'none' }}>
                      Détails Affiliation
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    {/* Mutuelle */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
                        Assurance *
                      </Form.Label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Select
                          value={selectedMutuelle}
                          onChange={handleMutuelleChange}
                          options={mutuelleOptions}
                          placeholder="Sélectionner une assurance..."
                          isClearable
                          isSearchable
                          className={errors.mutuelle_id ? 'is-invalid' : ''}
                          styles={{
                            container: (base) => ({ ...base, flex: 1 }),
                            control: (base) => ({
                              ...base,
                              borderColor: errors.mutuelle_id ? '#dc2626' : '#d1d5db',
                              fontSize: '0.875rem',
                              minHeight: '40px',
                              borderRadius: '6px',
                              '&:hover': { borderColor: '#9ca3af' }
                            })
                          }}
                        />
                        <BsButton
                          variant="outline-secondary"
                          type="button"
                          onClick={() => setShowMutuelleModal(true)}
                          style={{
                            height: '40px',
                            width: '42px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#ced4da',
                            borderRadius: '6px',
                            flexShrink: 0
                          }}
                        >
                          <Plus size={18} />
                        </BsButton>
                      </div>
                      {errors.mutuelle_id && (
                        <small className="text-danger">{errors.mutuelle_id}</small>
                      )}
                    </Form.Group>

                    {/* Régime */}
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
                        Régime *
                      </Form.Label>
                      <div style={{ display: 'flex', gap: '8px' }}>
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
                            container: (base) => ({ ...base, flex: 1 }),
                            control: (base) => ({
                              ...base,
                              borderColor: errors.regime_mutuelle_id ? '#dc2626' : '#d1d5db',
                              fontSize: '0.875rem',
                              minHeight: '40px',
                              borderRadius: '6px',
                              '&:hover': { borderColor: '#9ca3af' }
                            })
                          }}
                        />
                        <BsButton
                          variant="outline-secondary"
                          type="button"
                          onClick={() => setShowRegimeModal(true)}
                          disabled={!selectedMutuelle}
                          style={{
                            height: '40px',
                            width: '42px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#ced4da',
                            borderRadius: '6px',
                            flexShrink: 0
                          }}
                        >
                          <Plus size={18} />
                        </BsButton>
                      </div>
                      {errors.regime_mutuelle_id && (
                        <small className="text-danger">{errors.regime_mutuelle_id}</small>
                      )}
                    </Form.Group>

                    {/* Numéro d'adhérent | Date d'affiliation - 2 colonnes */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
                          Numéro d'adhérent
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.numero_adherent}
                          onChange={(e) => handleInputChange('numero_adherent', e.target.value)}
                          placeholder="Ex: 12345678"
                          className={errors.numero_adherent ? 'is-invalid' : ''}
                          style={{ fontSize: '0.875rem', height: '40px', borderRadius: '6px', borderColor: '#d1d5db' }}
                        />
                        {errors.numero_adherent && (
                          <small className="text-danger">{errors.numero_adherent}</small>
                        )}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
                          Date d'affiliation *
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.date_adhesion}
                          onChange={(e) => handleInputChange('date_adhesion', e.target.value)}
                          className={errors.date_adhesion ? 'is-invalid' : ''}
                          style={{ fontSize: '0.875rem', height: '40px', borderRadius: '6px', borderColor: '#d1d5db' }}
                        />
                        {errors.date_adhesion && (
                          <small className="text-danger">{errors.date_adhesion}</small>
                        )}
                      </Form.Group>
                    </Box>

                    {/* Date de résiliation - visible uniquement en modification */}
                    {selectedAffiliation && (
                      <Form.Group>
                        <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
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
                          style={{ fontSize: '0.875rem', height: '40px', borderRadius: '6px', borderColor: '#d1d5db' }}
                        />
                        {errors.date_resiliation && (
                          <small className="text-danger d-block">{errors.date_resiliation}</small>
                        )}
                      </Form.Group>
                    )}
                  </Box>
                </Box>

                {/* Section: STATUT ET AYANTS DROIT */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <FileText size={16} color="#64748b" />                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4b5563', fontSize: '0.85rem', letterSpacing: '0.02em', textTransform: 'none' }}>
                      Statut et Ayants Droit
                    </Typography>
                  </Box>
                  <Box sx={{ px: 0 }}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem', textTransform: 'none' }}>
                        Statut
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={computedStatut}
                        disabled
                        style={{
                          backgroundColor: isResilie ? '#fef2f2' : '#f0fdf4',
                          color: isResilie ? '#dc2626' : '#16a34a',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: '40px',
                          borderRadius: '6px'
                        }}
                      />
                      <small className="text-muted" style={{ fontSize: '0.7rem', display: 'block', marginTop: '0.25rem' }}>
                        Le statut est automatique selon la date de résiliation
                      </small>
                    </Form.Group>

                    {/* Section Ayants Droit (Enfants) */}
                    {showChildren && (
                      <div className="mb-3 p-3 bg-white border rounded" style={{ borderColor: '#d1d5db', borderRadius: '6px' }}>
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
                          checked={true}
                          disabled
                          style={{ fontWeight: 500, fontSize: '0.8rem' }}
                        />
                      </div>
                    )}

                    {/* Section Situation Familiale (Conjoint) */}
                    {showConjoint && (
                      <div className="mb-3 p-3 bg-white border rounded" style={{ borderColor: '#d1d5db', borderRadius: '6px' }}>
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
                          checked={true}
                          disabled
                          style={{ fontWeight: 500, fontSize: '0.8rem' }}
                        />
                      </div>
                    )}
                  </Box>
                </Box>

                {/* Section: COMMENTAIRE */}
                <Box sx={{ mb: 3 }}>
                  <Box className="section-header" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid #e5e7eb' }}>
                    <MessageSquare size={16} color="#64748b" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4b5563', fontSize: '0.85rem', letterSpacing: '0.02em', textTransform: 'none' }}>
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
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
              zIndex: 10
            }}>
              <MuiButton
                variant="contained"
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#2c767c',
                  color: '#ffffff',
                  px: 4,
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#2c767c',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&:disabled': { backgroundColor: '#9ca3af' }
                }}
              >
                Annuler
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#2c767c',
                  color: '#ffffff',
                  px: 3,
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#2c767c',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&:disabled': { backgroundColor: '#9ca3af' }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="loader me-1"></div>
                    Affiliation...
                  </>
                ) : (
                  <>
                    Affilier
                  </>
                )}
              </MuiButton>
            </Box>
          </Box>
        </div>
      </div>

      {/* Modal gestion des assurances */}
      <ManageResourceModal
        show={showMutuelleModal}
        onHide={() => setShowMutuelleModal(false)}
        title="Gérer les Assurances Mutuelles"
        resourceName="Assurance"
        fetchItems={getMutuellesForModal}
        onAdd={addMutuelleForModal}
        onEdit={editMutuelleForModal}
        onDelete={deleteMutuelleForModal}
      />

      {/* Modal gestion des régimes (contextuel à la mutuelle sélectionnée) */}
      <ManageResourceModal
        show={showRegimeModal}
        onHide={() => setShowRegimeModal(false)}
        title={`Gérer les Régimes${selectedMutuelle ? ` — ${selectedMutuelle.label}` : ''}`}
        resourceName="Régime"
        fetchItems={getRegimesForModal}
        onAdd={addRegimeForModal}
        onEdit={editRegimeForModal}
        onDelete={deleteRegimeForModal}
      />
    </>
  );
}

export default AddAffiliationMutuelle;
