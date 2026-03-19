import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Activity, User, Calendar, Save, X, ClipboardList, Users } from "lucide-react";
import EmployeeSelector from "./EmployeeSelector";
import './CnssForm.css';

const CNSS_RATE = 0.25;

const getCurrentYear = () => new Date().getFullYear();

const formatCurrency = (value) => {
  const parsedValue = Number(value ?? 0);
  if (!Number.isFinite(parsedValue)) return "-";
  return `${parsedValue.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MAD`;
};

function AddDeclarationCNSS({ toggleDeclarationForm, onDeclarationSaved = () => { }, selectedDeclaration = null }) {
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState(String(getCurrentYear()));
  const [statut, setStatut] = useState("EN_ATTENTE");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [eligibleEmployees, setEligibleEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDeclaration, setLoadingDeclaration] = useState(false);
  const [editingDeclarationData, setEditingDeclarationData] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(selectedDeclaration?.id);
  const declarationSource = editingDeclarationData || selectedDeclaration;

  const resetForm = useCallback(() => {
    setMois("");
    setAnnee(String(getCurrentYear()));
    setStatut("EN_ATTENTE");
    setSelectedEmployees([]);
    setEligibleEmployees([]);
    setLoadingDeclaration(false);
    setEditingDeclarationData(null);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    toggleDeclarationForm();
  }, [resetForm, toggleDeclarationForm]);

  const fetchEligibleEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const response = await axios.get("/api/cnss/declarations/eligible-employees");
      const employeesData = Array.isArray(response.data) ? response.data : [];
      setEligibleEmployees(employeesData);
    } catch (error) {
      Swal.fire("Erreur", "Impossible de charger les employés affiliés CNSS.", "error");
      setEligibleEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  useEffect(() => {
    fetchEligibleEmployees();
  }, [fetchEligibleEmployees]);

  useEffect(() => {
    let cancelled = false;
    if (!isEditMode) {
      setLoadingDeclaration(false);
      setEditingDeclarationData(null);
      return () => { cancelled = true; };
    }
    if (Array.isArray(selectedDeclaration?.details)) {
      setEditingDeclarationData(selectedDeclaration);
      return () => { cancelled = true; };
    }
    const fetchDeclarationForEdit = async () => {
      setLoadingDeclaration(true);
      try {
        const response = await axios.get(`/api/cnss/declarations/${selectedDeclaration.id}`);
        if (!cancelled) setEditingDeclarationData(response.data || selectedDeclaration);
      } catch (error) {
        if (!cancelled) {
          Swal.fire("Erreur", "Impossible de charger les détails de la déclaration.", "error");
          setEditingDeclarationData(selectedDeclaration);
        }
      } finally {
        if (!cancelled) setLoadingDeclaration(false);
      }
    };
    fetchDeclarationForEdit();
    return () => { cancelled = true; };
  }, [isEditMode, selectedDeclaration]);

  useEffect(() => {
    if (!isEditMode) {
      setMois("");
      setAnnee(String(getCurrentYear()));
      setStatut("EN_ATTENTE");
      setSelectedEmployees([]);
      return;
    }
    setMois(String(declarationSource?.mois ?? ""));
    setAnnee(String(declarationSource?.annee ?? getCurrentYear()));
    setStatut(declarationSource?.statut || "EN_ATTENTE");
  }, [isEditMode, declarationSource]);

  useEffect(() => {
    if (!isEditMode || !Array.isArray(declarationSource?.details)) return;
    const selectedIds = new Set(declarationSource.details.map((detail) => String(detail.employe_id)));
    const initialSelected = eligibleEmployees.filter((emp) => selectedIds.has(String(emp.id)));
    setSelectedEmployees(initialSelected);
  }, [isEditMode, declarationSource, eligibleEmployees]);

  const masseSalariale = useMemo(
    () => selectedEmployees.reduce((sum, employee) => sum + Number(employee.salaire || 0), 0),
    [selectedEmployees]
  );

  const montantTotal = useMemo(() => masseSalariale * CNSS_RATE, [masseSalariale]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mois || !annee || !statut || selectedEmployees.length === 0) {
      Swal.fire("Attention", "Veuillez choisir le mois, l'année, le statut et au moins un employé.", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        mois: Number(mois),
        annee: Number(annee),
        statut,
        employe_ids: selectedEmployees.map((employee) => employee.id),
      };
      if (isEditMode) {
        await axios.put(`/api/cnss/declarations/${selectedDeclaration.id}`, payload);
        Swal.fire("Succès", "Déclaration CNSS mise à jour avec succès.", "success");
      } else {
        await axios.post("/api/cnss/declarations", payload);
        Swal.fire("Succès", "Déclaration CNSS ajoutée avec succès.", "success");
      }
      await onDeclarationSaved();
      handleClose();
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire("Attention", "Une déclaration existe déjà pour ce mois et cette année.", "warning");
      } else {
        Swal.fire("Erreur", error.response?.data?.message || "Une erreur est survenue.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cnss-side-panel" onClick={(e) => e.stopPropagation()}>

      {/* HEADER */}
      <div className="cnss-form-header">
        <div style={{ width: "24px" }}></div> {/* Pour équilibrer le bouton Fermer et centrer le titre */}
        <h5>
          {isEditMode ? "Modifier Déclaration" : "Nouvelle Déclaration"}
        </h5>
        <button className="cnss-close-btn" onClick={handleClose} type="button" aria-label="Fermer">
          <X size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="cnss-form-body">
        <Form onSubmit={handleSubmit} id="declarationForm">

          {/* SECTION : INFORMATIONS GÉNÉRALES */}
          <div className="cnss-section-title">
            <ClipboardList size={14} />
            <span>Informations Générales</span>
          </div>

          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <div className="cnss-field-group">
                <label className="cnss-form-label">
                  Mois <span className="text-danger">*</span>
                </label>
                <Form.Select
                  className="cnss-form-control"
                  value={mois}
                  onChange={(e) => setMois(e.target.value)}
                  required
                >
                  <option value="">Sélectionner</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="cnss-field-group">
                <label className="cnss-form-label">
                  Année <span className="text-danger">*</span>
                </label>
                <Form.Control
                  className="cnss-form-control"
                  type="number"
                  min={2000}
                  max={2100}
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="cnss-field-group">
                <label className="cnss-form-label">
                  Statut <span className="text-danger">*</span>
                </label>
                <Form.Select
                  className="cnss-form-control"
                  value={statut}
                  onChange={(e) => setStatut(e.target.value)}
                  required
                >
                  <option value="EN_ATTENTE">EN_ATTENTE</option>
                  <option value="DECLARE">DECLARE</option>
                  <option value="PAYE">PAYE</option>
                </Form.Select>
              </div>
            </div>
          </div>

          {/* SECTION : EMPLOYÉS */}
          <div className="cnss-section-title">
            <Users size={14} />
            <span>Employés &amp; Cotisations</span>
          </div>

          <div className="row g-3">
            <div className="col-md-12">
              <div className="cnss-field-group">
                <label className="cnss-form-label">
                  Employés affiliés (Actifs) <span className="text-danger">*</span>
                </label>
                <EmployeeSelector
                  employees={eligibleEmployees}
                  selectedEmployees={selectedEmployees}
                  onChange={setSelectedEmployees}
                  isLoading={loadingEmployees || loadingDeclaration}
                />
                {eligibleEmployees.length === 0 && !loadingEmployees && (
                  <span className="cnss-error-message" style={{ color: '#6b7280' }}>
                    Aucun employé éligible trouvé.
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="cnss-field-group">
                <label className="cnss-form-label">Masse salariale</label>
                <Form.Control
                  className="cnss-form-control"
                  type="text"
                  value={formatCurrency(masseSalariale)}
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="cnss-field-group">
                <label className="cnss-form-label">Montant CNSS</label>
                <Form.Control
                  className="cnss-form-control"
                  type="text"
                  value={formatCurrency(montantTotal)}
                  readOnly
                  style={{ color: "#00afaa", fontWeight: "bold" }}
                />
              </div>
            </div>
          </div>
        </Form>
      </div>

      {/* FOOTER */}
      <div className="cnss-form-footer">
        <button type="button" className="cnss-btn-secondary" onClick={handleClose}>
          Annuler
        </button>
        <button
          type="submit"
          form="declarationForm"
          className="cnss-btn-primary"
          disabled={saving || loadingEmployees || loadingDeclaration || eligibleEmployees.length === 0}
        >
          {saving ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

export default AddDeclarationCNSS;

