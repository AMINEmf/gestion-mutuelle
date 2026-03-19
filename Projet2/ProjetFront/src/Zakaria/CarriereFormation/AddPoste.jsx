import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Form } from "react-bootstrap";
import Select from "react-dropdown-select";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { ShieldCheck, X, User } from "lucide-react";
import apiClient from "../../services/apiClient";
import ManageResourceModal from "../cnss/ManageResourceModal";
import ManageCompetencesModal from "./ManageCompetencesModal";
import "../cnss/CnssForm.css";

const emptyForm = {
  poste: "",
  grade_id: "",
  statut: "actif",
  niveau: "",
  domaine: "",
  competence_ids: [],
  competence_levels: {},
  description: "",
};

// AI suggestions are now provided by backend

function normalizeGrades(rawGrades) {
  if (!Array.isArray(rawGrades)) return [];
  return rawGrades.map((g) => ({
    id: Number(g.id ?? g.grade_id),
    code: g.code ?? g.grade_code ?? "",
    label: g.label ?? g.name ?? g.grade_label ?? "",
  }));
}

function AddPoste({
  selectedDepartementId,
  selectedDepartementName,
  togglePosteForm,
  onPosteAdded = () => { },
  selectedPoste = null,
  onPosteUpdated,
  grades = [],
  competences = [],
  loadingGrades = false,
  loadingCompetences = false,
  onCompetencesChanged = () => { },
}) {
  const [formState, setFormState] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [manageCompetencesModal, setManageCompetencesModal] = useState(false);
  const [competencesResources, setCompetencesResources] = useState([]);

  // Poste Types / Titles Logic
  const [managePosteModal, setManagePosteModal] = useState(false);
  const [posteTitles, setPosteTitles] = useState([]);
  const [loadingPosteTitles, setLoadingPosteTitles] = useState(false);
  
  // Auto-suggest logic state
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [assigningEmployeeId, setAssigningEmployeeId] = useState(null);
  const [suggestedProfiles, setSuggestedProfiles] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const notifyPosteCompetencesUpdated = useCallback(() => {
    const stamp = String(Date.now());
    try {
      localStorage.setItem("posteCompetencesUpdatedAt", stamp);
    } catch (e) {
      // ignore storage errors
    }
    window.dispatchEvent(new Event("poste-competences-updated"));
  }, []);

  // Normalize grades for stable usage
  const normalizedGrades = useMemo(() => normalizeGrades(grades), [grades]);

  // Sync competences resources with props
  useEffect(() => {
    const resources = competences.map((comp) => ({
      id: comp.id,
      nom: comp.nom ?? comp.label ?? comp.name ?? "",
      name: comp.nom ?? comp.label ?? comp.name ?? "",
      categorie: comp.categorie ?? "",
      description: comp.description ?? ""
    }));
    setCompetencesResources(resources);
  }, [competences]);

  // Transform competences to react-dropdown-select format
  const competenceOptions = useMemo(() => {
    return competences.map((comp) => ({
      label: comp.nom ?? comp.label ?? comp.name ?? "",
      value: comp.id,
    }));
  }, [competences]);

  // Transform selected IDs to values array for Select component
  const competenceValues = useMemo(() => {
    return formState.competence_ids
      .map((id) => competenceOptions.find((opt) => opt.value === id))
      .filter(Boolean);
  }, [formState.competence_ids, competenceOptions]);

  useEffect(() => {
    const posteId = selectedPoste?.id ?? null;
    if (!showSuggestions || !posteId) {
      setSuggestedProfiles([]);
      return;
    }

    let isMounted = true;
    setLoadingSuggestions(true);
    apiClient
      .get(`/postes/${posteId}/suggestions`)
      .then((response) => {
        if (!isMounted) return;
        const payload = response?.data?.data ?? response?.data ?? [];
        const rows = Array.isArray(payload) ? payload : [];
        setSuggestedProfiles(rows.slice(0, 5));
      })
      .catch((error) => {
        console.error("AI_SUGGESTIONS_ERROR", error);
        if (isMounted) setSuggestedProfiles([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSuggestions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedPoste?.id, showSuggestions]);

  const handleAssignEmployee = async (employeeId, employeeName) => {
    if (!selectedPoste?.id) {
       Swal.fire("Attention", "Veuillez d'abord enregistrer le poste avant d'assigner un employé.", "warning");
       return;
    }

    setAssigningEmployeeId(employeeId);
    try {
        await apiClient.post(`/postes/${selectedPoste.id}/assign-employe`, {
            employe_id: employeeId
        });
        
        Swal.fire({
            title: "Succès",
            text: `L'employé ${employeeName} a été assigné au poste avec succès.`,
            icon: "success",
            timer: 2000
        });
        
        if (onPosteUpdated) onPosteUpdated();
        setSuggestedProfiles((prev) =>
          prev.filter((profile) => (profile.id ?? profile.employee_id) !== employeeId)
        );
    } catch (error) {
        console.error("ASSIGN_ERROR", error);
        Swal.fire("Erreur", "Impossible d'assigner l'employé.", "error");
    } finally {
        setAssigningEmployeeId(null);
    }
  };

  const fetchPosteTitles = useCallback(async () => {
    setLoadingPosteTitles(true);
    try {
      // Mocking a resource by fetching all distinct post names
      const response = await apiClient.get("/postes");
      const data = response.data?.data ?? response.data ?? [];
      const distinctNames = [...new Set(data.map((p) => p.nom || p.poste).filter(Boolean))].sort();
      setPosteTitles(distinctNames.map((name, index) => ({ id: name, name })));
    } catch (error) {
      console.error("POSTE_TITLES_ERROR", error);
    } finally {
      setLoadingPosteTitles(false);
    }
  }, []);

  useEffect(() => {
    fetchPosteTitles();
  }, [fetchPosteTitles]);

  const handleAddPosteTitle = async (name) => {
    // Since we don't have a dedicated endpoint, we simulate adding to the list
    // In a real scenario, this would POST /poste-types
    setPosteTitles((prev) => {
        if (prev.find(p => p.name.toLowerCase() === name.toLowerCase())) return prev;
        return [...prev, { id: name, name }].sort((a,b) => a.name.localeCompare(b.name));
    });
    return { id: name, name };
  };

  const handleEditPosteTitle = async (id, newName) => {
    // Mock edit
    setPosteTitles((prev) => prev.map(p => p.id === id ? { ...p, id: newName, name: newName } : p));
  };

  const handleDeletePosteTitle = async (id) => {
    // Mock delete
    setPosteTitles((prev) => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    const loadDetails = async () => {
      // Diagnostic logs
      console.log("GRADES_LIST", normalizedGrades);
      console.log("SELECTED_POSTE_PROP", selectedPoste);

      if (!selectedPoste?.id) {
        setFormState(emptyForm);
        return;
      }

      setLoadingDetails(true);
      try {
        const response = await apiClient.get(`/postes/${selectedPoste.id}`);
        console.log("POSTE_DETAIL_RESPONSE", response.data);
        const poste = response.data || {};
        
        // Intelligent Grade ID Resolution
        let targetGradeId = poste.grade_id ?? poste.grade?.id ?? selectedPoste.grade_id ?? "";
        
        // If still no ID but we have a grade object/string, try to find it
        if (!targetGradeId) {
            const gradeSource = poste.grade ?? selectedPoste.grade_obj ?? selectedPoste.grade;
            if (typeof gradeSource === 'object' && gradeSource?.id) {
                targetGradeId = gradeSource.id;
            } else if (typeof gradeSource === 'string') {
                 const match = normalizedGrades.find(g => 
                    (`${g.code} - ${g.label}` === gradeSource) || 
                    (g.label === gradeSource) || 
                    (g.code === gradeSource)
                 );
                 if (match) targetGradeId = match.id;
            }
        }

        setFormState({
          poste: poste.nom ?? selectedPoste.poste ?? "",
          grade_id: targetGradeId ? String(targetGradeId) : "",
          statut: poste.statut ?? selectedPoste.statut_raw ?? "actif",
          niveau: poste.niveau ?? selectedPoste.niveau ?? "",
          domaine: poste.domaine ?? selectedPoste.domaine ?? "",
          competence_ids: Array.isArray(poste.competences)
            ? poste.competences.map((comp) => comp.id).filter(Boolean)
            : [],
          competence_levels: Array.isArray(poste.competences)
            ? poste.competences.reduce((acc, comp) => {
                const level = Number(comp?.pivot?.niveau_requis ?? comp?.niveau_requis ?? 0);
                acc[comp.id] = level;
                return acc;
              }, {})
            : {},
          description: poste.description ?? selectedPoste.description ?? "",
        });
      } catch (error) {
        console.error("LOAD_DETAILS_ERROR", error);
        // Fallback using props only
        let targetGradeId = selectedPoste.grade_id ?? "";
        if (!targetGradeId) {
             const gradeSource = selectedPoste.grade_obj ?? selectedPoste.grade;
             if (typeof gradeSource === 'object' && gradeSource?.id) {
                targetGradeId = gradeSource.id;
            } else if (typeof gradeSource === 'string') {
                 const match = normalizedGrades.find(g => 
                    (`${g.code} - ${g.label}` === gradeSource) || 
                    (g.label === gradeSource)
                 );
                 if (match) targetGradeId = match.id;
            }
        }

        setFormState({
          poste: selectedPoste.poste || "",
          grade_id: targetGradeId ? String(targetGradeId) : "",
          statut: selectedPoste.statut_raw || "actif",
          niveau: selectedPoste.niveau || "",
          domaine: selectedPoste.domaine || "",
          competence_ids: [],
          competence_levels: {},
          description: selectedPoste.description || "",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [selectedPoste, normalizedGrades]);

  const handleClose = useCallback(() => {
    setFormState(emptyForm);
    togglePosteForm();
  }, [togglePosteForm]);

  // Handlers for competences management modal
  const handleAddCompetence = async (data) => {
    try {
      const payload = {
        nom: typeof data === 'string' ? data : data.nom,
        categorie: typeof data === 'object' ? data.categorie : null,
        description: typeof data === 'object' ? data.description : null
      };
      const response = await apiClient.post("/competences", payload);
      const newComp = response.data;
      Swal.fire("Succès", "Compétence ajoutée", "success");
      // Trigger competences refresh
      if (onCompetencesChanged) onCompetencesChanged();
      return newComp;
    } catch (error) {
      Swal.fire("Erreur", "Impossible d'ajouter la compétence", "error");
    }
  };

  const handleEditCompetence = async (id, data) => {
    try {
      const payload = {
        nom: typeof data === 'string' ? data : data.nom,
        categorie: typeof data === 'object' ? data.categorie : null,
        description: typeof data === 'object' ? data.description : null
      };
      await apiClient.put(`/competences/${id}`, payload);
      Swal.fire("Succès", "Compétence modifiée", "success");
      if (onCompetencesChanged) onCompetencesChanged();
    } catch (error) {
      Swal.fire("Erreur", "Impossible de modifier la compétence", "error");
    }
  };

  const handleDeleteCompetence = async (id) => {
    try {
      await apiClient.delete(`/competences/${id}`);
      Swal.fire("Succès", "Compétence supprimée", "success");
      // Remove from selected if present
      setFormState((prev) => ({
        ...prev,
        competence_ids: prev.competence_ids.filter((cId) => cId !== id),
        competence_levels: Object.keys(prev.competence_levels || {}).reduce((acc, key) => {
          if (Number(key) !== id) acc[key] = prev.competence_levels[key];
          return acc;
        }, {}),
      }));
      if (onCompetencesChanged) onCompetencesChanged();
    } catch (error) {
      Swal.fire("Erreur", "Impossible de supprimer la compétence", "error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const effectiveDepartementId = selectedDepartementId ?? selectedPoste?.unite_id ?? null;
    if (!effectiveDepartementId) {
      Swal.fire("Erreur", "Veuillez sélectionner un département.", "warning");
      return;
    }

    if (!formState.poste.trim() || !formState.grade_id || !formState.niveau.trim()) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs obligatoires.", "warning");
      return;
    }

    setLoading(true);

    const payload = {
      nom: formState.poste.trim(),
      grade_id: formState.grade_id ? parseInt(formState.grade_id, 10) : null,
      statut: formState.statut || null,
      niveau: formState.niveau.trim(),
      domaine: formState.domaine.trim() || null,
      description: formState.description.trim() || null,
    };

    console.log("POSTE_SUBMIT_PAYLOAD", payload);

    if (selectedPoste) {
      payload.unite_id = selectedPoste.unite_id;
    } else {
      payload.departement_id = selectedDepartementId;
    }

    try {
      if (selectedPoste) {
        await apiClient.put(`/postes/${selectedPoste.id}`, payload);
        await apiClient.put(`/postes/${selectedPoste.id}/competences`, {
          competences: formState.competence_ids.map((id) => ({
            competence_id: id,
            niveau_requis: Number(formState.competence_levels?.[id] ?? 0),
          })),
        });
        notifyPosteCompetencesUpdated();
        if (onPosteUpdated) onPosteUpdated();
        Swal.fire("Succès", "Poste mis à jour", "success");
      } else {
        const response = await apiClient.post("/postes", payload);
        const posteId = response.data?.id;
        if (posteId) {
          await apiClient.put(`/postes/${posteId}/competences`, {
            competences: formState.competence_ids.map((id) => ({
              competence_id: id,
              niveau_requis: Number(formState.competence_levels?.[id] ?? 0),
            })),
          });
          notifyPosteCompetencesUpdated();
        }
        onPosteAdded();
        Swal.fire("Succès", "Poste ajouté", "success");
      }
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Une erreur est survenue";
      const validationErrors = error.response?.data?.errors;

      if (validationErrors && typeof validationErrors === 'object') {
        const detail = Object.values(validationErrors).flat().join("\n");
        Swal.fire("Erreur de validation", detail || errorMessage, "error");
      } else {
        Swal.fire("Erreur", errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <ManageResourceModal
        show={managePosteModal}
        onHide={() => setManagePosteModal(false)}
        title="Gérer les intitulés de poste"
        items={posteTitles}
        onAdd={handleAddPosteTitle}
        onEdit={handleEditPosteTitle}
        onDelete={handleDeletePosteTitle}
        placeholder="Nouvel intitulé..."
        addButtonLabel="+"
      />

      <div className="cnss-side-panel" onClick={(event) => event.stopPropagation()}>
        <div className="cnss-form-header">
          <div style={{ width: "24px" }}></div>
          <h5>{selectedPoste ? "Modifier un poste" : "Ajouter un poste"}</h5>
          <button className="cnss-close-btn" onClick={handleClose} type="button" aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="cnss-form-body">
          <Form onSubmit={handleSubmit} id="posteForm">
            <div className="cnss-section-title">
              <User size={14} />
              <span>Détails du poste</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '1rem' }}>
              <div>
                <div className="cnss-field-group">
                  <label className="cnss-form-label">
                    Poste <span className="text-danger">*</span>
                  </label>
                  <div className="unified-input-group" style={{ display: 'flex', width: '100%' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Select
                        options={posteTitles.map((p) => ({ label: p.name, value: p.name }))}
                        values={
                          formState.poste
                            ? [{ label: formState.poste, value: formState.poste }]
                            : []
                        }
                        onChange={(values) => {
                          const selected = values[0];
                          setFormState((prev) => ({
                            ...prev,
                            poste: selected ? selected.value : "",
                          }));
                        }}
                        create={true}
                        onCreateNew={(item) => {
                           handleAddPosteTitle(item.label);
                           setFormState((prev) => ({ ...prev, poste: item.label }));
                        }}
                        placeholder="choisir un poste"
                        searchable={true}
                        disabled={loading || loadingDetails}
                        className="react-dropdown-select"
                        dropdownPosition="bottom"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="cnss-btn-add"
                      onClick={() => setManagePosteModal(true)}
                      disabled={loading || loadingDetails}
                      title="Gérer les intitulés de poste"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="cnss-field-group">
                  <label className="cnss-form-label">
                    Département <span className="text-danger">*</span>
                  </label>
                  <Form.Control
                    className="cnss-form-control"
                    type="text"
                    value={selectedDepartementName || selectedPoste?.departement || ""}
                    readOnly
                    placeholder="Sélectionnez un département"
                  />
                </div>
              </div>
              <div>
                <div className="cnss-field-group">
                  <label className="cnss-form-label">Domaine</label>
                  <Form.Select
                    className="cnss-form-control"
                    value={formState.domaine}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, domaine: event.target.value }))
                    }
                    disabled={loading || loadingDetails}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Management">Management</option>
                    <option value="Comptabilite">Comptabilite</option>
                    <option value="RH">RH</option>
                    <option value="Juridique">Juridique</option>
                    <option value="Technique">Technique</option>
                  </Form.Select>
                </div>
              </div>
            </div>

            <div className="cnss-section-title">
              <ShieldCheck size={14} />
              <span>Classification</span>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="cnss-field-group">
                  <label className="cnss-form-label">
                    Grade <span className="text-danger">*</span>
                  </label>
                  <Form.Select
                    className="cnss-form-control"
                    value={formState.grade_id}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, grade_id: event.target.value }))
                    }
                    required
                    disabled={loading || loadingDetails || loadingGrades}
                  >
                    <option value="">Sélectionner</option>
                    {normalizedGrades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.code ? `${grade.code} - ${grade.label}`.trim() : grade.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="cnss-field-group">
                  <label className="cnss-form-label">Statut</label>
                  <Form.Select
                    className="cnss-form-control"
                    value={formState.statut}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, statut: event.target.value }))
                    }
                    disabled={loading || loadingDetails}
                  >
                    <option value="actif">Actif</option>
                    <option value="vacant">Vacant</option>
                  </Form.Select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="cnss-field-group">
                  <label className="cnss-form-label">
                    Niveau <span className="text-danger">*</span>
                  </label>
                  <Form.Control
                    className="cnss-form-control"
                    type="text"
                    value={formState.niveau}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, niveau: event.target.value }))
                    }
                    placeholder="Ex: Senior"
                    required
                    disabled={loading || loadingDetails}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="cnss-field-group">
                  <label className="cnss-form-label">Compétences requises</label>
                  <div className="unified-input-group">
                    <div style={{ flex: 1 }}>
                      <Select
                        options={competenceOptions}
                        values={competenceValues}
                        onChange={(values) => {
                          const ids = values.map((v) => v.value);
                          setFormState((prev) => {
                            const nextLevels = { ...(prev.competence_levels || {}) };
                            // Remove levels for unselected competences
                            Object.keys(nextLevels).forEach((key) => {
                              if (!ids.includes(Number(key))) {
                                delete nextLevels[key];
                              }
                            });
                            // Set default level for newly selected competences
                            ids.forEach((id) => {
                              if (nextLevels[id] == null) {
                                nextLevels[id] = 0;
                              }
                            });
                            return {
                              ...prev,
                              competence_ids: ids,
                              competence_levels: nextLevels,
                            };
                          });
                        }}
                        placeholder="Choisir une compétence..."
                        searchable={true}
                        multi={true}
                        clearable={true}
                        disabled={loading || loadingDetails || loadingCompetences}
                        dropdownPosition="bottom"
                        className="react-dropdown-select"
                      />
                    </div>
                    <button
                      type="button"
                      className="cnss-btn-add"
                      onClick={() => setManageCompetencesModal(true)}
                      disabled={loading || loadingDetails}
                      title="Gérer les compétences"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {formState.competence_ids.length > 0 && (
                <div className="col-md-12">
                  <div className="cnss-field-group">
                    <label className="cnss-form-label">Niveau requis</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {formState.competence_ids.map((competenceId) => {
                        const competence = competences.find((comp) => comp.id === competenceId);
                        const levelValue = Number(formState.competence_levels?.[competenceId] ?? 0);
                        return (
                          <div
                            key={`niveau-${competenceId}`}
                            style={{ display: "flex", alignItems: "center", gap: "12px" }}
                          >
                            <span style={{ minWidth: 180, fontWeight: 600, color: "#2c3e50" }}>
                              {competence?.nom ?? competence?.label ?? "Compétence"}
                            </span>
                            <Form.Select
                              className="cnss-form-control"
                              value={levelValue}
                              onChange={(event) => {
                                const value = Number(event.target.value);
                                setFormState((prev) => ({
                                  ...prev,
                                  competence_levels: {
                                    ...(prev.competence_levels || {}),
                                    [competenceId]: value,
                                  },
                                }));
                              }}
                              style={{ maxWidth: 120 }}
                              disabled={loading || loadingDetails}
                            >
                              {[0, 1, 2, 3, 4, 5].map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="col-md-12">
                <div className="cnss-field-group">
                  <label className="cnss-form-label">Description</label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="cnss-form-control"
                    value={formState.description}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Description du poste (optionnel)"
                    disabled={loading || loadingDetails}
                  />
                </div>
              </div>
            </div>

            {/* --- AI SUGGESTIONS SECTION --- */}
            {suggestedProfiles.length > 0 && (
              <>
                <div className="cnss-section-title mt-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <ShieldCheck size={14} />
                    <span>Suggestion AI – Occupation de poste</span>
                  </div>
                </div>

                <div className="ai-suggestions-container mb-3 p-3 bg-light rounded border">
                  <div className="suggestions-list">
                    <div className="d-flex flex-column gap-2">
                      {suggestedProfiles.map((profile) => (
                        <div key={profile.id} className="card shadow-sm border-0 suggestion-card">
                          <div className="card-body p-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-column">
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                                {profile.nom} {profile.prenom}
                              </span>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                <span className={`badge ${
                                  profile.score >= 70 ? 'bg-success' :
                                  profile.score >= 40 ? 'bg-warning text-dark' :
                                  'bg-danger'
                                } rounded-pill`}>
                                  {profile.score}% Compatible
                                </span>
                              </div>
                            </div>
                            <div className="d-flex gap-2 items-center">
                              <span className="badge bg-secondary rounded-pill" style={{ opacity: 0.8 }}>
                                {profile.grade ? (typeof profile.grade === 'string' ? profile.grade : profile.grade.label || profile.grade.code) : "N/A"}
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                  alert("Voir profil: " + profile.nom);
                                }}
                                style={{ fontSize: '0.75rem' }}
                              >
                                Voir
                              </button>
                              <button
                                type="button"
                                className="cnss-btn-primary btn-sm"
                                onClick={() => handleAssignEmployee(profile.id, `${profile.nom} ${profile.prenom}`)}
                                disabled={loadingDetails || assigningEmployeeId === profile.id}
                                style={{ padding: '4px 12px', fontSize: '0.8rem', height: 'fit-content' }}
                              >
                                {assigningEmployeeId === profile.id ? '...' : 'Assigner'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>

        <div className="cnss-form-footer">
          <button type="button" className="cnss-btn-secondary" onClick={handleClose}>
            Annuler
          </button>
          <button
            type="submit"
            form="posteForm"
            className="cnss-btn-primary"
            disabled={loading || loadingDetails}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Modal gestion compétences */}
      <ManageCompetencesModal
        show={manageCompetencesModal}
        onHide={() => setManageCompetencesModal(false)}
        items={competencesResources}
        onAdd={handleAddCompetence}
        onEdit={handleEditCompetence}
        onDelete={handleDeleteCompetence}
      />
    </>
  );
}

export default AddPoste;
