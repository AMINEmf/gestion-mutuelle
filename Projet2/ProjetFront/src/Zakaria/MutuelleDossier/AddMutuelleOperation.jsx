import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";
import { Box, Typography, IconButton, Button as MuiButton } from "@mui/material";
import { X, Calendar, CreditCard, MessageSquare, FileText, Info, DollarSign, User } from "lucide-react";
import Swal from "sweetalert2";
import "../AffiliationMutuelle/AddAffiliationMutuelle.css";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const typeOptions = [
  { value: "DEPOT_DOSSIER", label: "Dépôt Dossier" },
  { value: "REMBOURSEMENT", label: "Remboursement" },
  { value: "PRISE_EN_CHARGE", label: "Prise en Charge" },
  { value: "RECLAMATION", label: "Réclamation" },
  { value: "ATTESTATION", label: "Attestation" },
  { value: "REGULARISATION", label: "Régularisation" },
  { value: "AUTRE", label: "Autre" },
];

const statutOptions = [
  { value: "EN_COURS", label: "En cours" },
  { value: "TERMINEE", label: "Validée" },
  { value: "REMBOURSEE", label: "Remboursée" },
  { value: "ANNULEE", label: "Refusée" },
];

const beneficiaireTypeOptions = [
  { value: "EMPLOYE", label: "Employé" },
  { value: "CONJOINT", label: "Conjoint" },
  { value: "ENFANT", label: "Enfant" },
];

function AddMutuelleOperation({ employe, operation, dossierFixed, affiliationIdProposed, onClose, onSaved, isSidebar = false }) {
  const [formData, setFormData] = useState({
    affiliation_id: affiliationIdProposed || null,
    numero_dossier: dossierFixed || "",
    beneficiaire_type: "EMPLOYE",
    beneficiaire_nom: "",
    date_operation: new Date().toISOString().split('T')[0],
    date_depot: "",
    date_remboursement: "",
    type_operation: "DEPOT_DOSSIER",
    statut: "EN_COURS",
    montant_total: "",
    montant_rembourse: "",
    reste_a_charge: "",
    commentaire: "",
  });
  const [affiliationsList, setAffiliationsList] = useState([]);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [beneficiaireOptions, setBeneficiaireOptions] = useState(beneficiaireTypeOptions);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // Documents liés
  const [documentType, setDocumentType] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentError, setDocumentError] = useState(null);
  const fileInputRef = useRef(null);

  // New State for Employee Selection
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  // Fetch employees if 'employe' prop is missing
  useEffect(() => {
    if (!employe) {
      api.get('/employes/affilies-mutuelle')
        .then((res) => {
          const data = res.data.data || res.data;
          if (Array.isArray(data)) {
            setEmployeeOptions(data.map((e) => ({
              value: e,
              label: `${e.nom} ${e.prenom} (${e.matricule})`
            })));
          }
        })
        .catch((err) => console.error("Erreur chargement Employés:", err));
    }
  }, [employe]);

  const activeEmploye = employe || selectedEmploye;

  // Charger les affiliations de l'Employé
  useEffect(() => {
    if (activeEmploye?.id) {
      api.get(`/employes/${activeEmploye.id}/affiliations-mutuelle`)
        .then((res) => {
          const affiliations = res.data.map((aff) => ({
            value: aff.id,
            label: `${aff.mutuelle?.nom || 'Mutuelle inconnue'} - ${aff.regime?.nom || ''} (${aff.statut})`,
            affiliation: aff,
          }));
          setAffiliationsList(affiliations);

          if (formData.affiliation_id) {
            const found = affiliations.find(a => a.value === formData.affiliation_id);
            if (found) setSelectedAffiliation(found);
          } else {
            // Auto-Sélectionner l'affiliation active si une seule existe
            const activeAffiliations = affiliations.filter(
              (a) => a.affiliation.statut === "ACTIVE"
            );
            if (activeAffiliations.length === 1) {
              setSelectedAffiliation(activeAffiliations[0]);
              setFormData((prev) => ({ ...prev, affiliation_id: activeAffiliations[0].value }));
            }
          }
        })
        .catch((err) => console.error("Erreur chargement affiliations:", err));
    } else {
      setAffiliationsList([]);
      setSelectedAffiliation(null);
    }
  }, [activeEmploye, formData.affiliation_id]);

  // Charger l'opération existante
  useEffect(() => {
    if (operation) {
      setFormData({
        affiliation_id: operation.affiliation_id || null,
        numero_dossier: operation.numero_dossier || "",
        beneficiaire_type: operation.beneficiaire_type || "EMPLOYE",
        beneficiaire_nom: operation.beneficiaire_nom || "",
        date_operation: operation.date_operation || "",
        date_depot: operation.date_depot || "",
        date_remboursement: operation.date_remboursement || "",
        type_operation: operation.type_operation || "DEPOT_DOSSIER",
        statut: operation.statut || "EN_COURS",
        montant_total: operation.montant_total ?? "",
        montant_rembourse: operation.montant_rembourse ?? "",
        reste_a_charge: operation.reste_a_charge ?? "",
        commentaire: operation.commentaire || "",
      });
    }
  }, [operation]);

  // Mettre à jour les options bénéficiaire selon l'affiliation
  useEffect(() => {
    if (!selectedAffiliation) {
      setBeneficiaireOptions([{ value: "EMPLOYE", label: "Employé" }]);
      return;
    }

    const aff = selectedAffiliation.affiliation;
    const options = [{ value: "EMPLOYE", label: "Employé" }];

    if (aff.conjoint_ayant_droit) {
      options.push({ value: "CONJOINT", label: "Conjoint" });
    }
    if (aff.ayant_droit) {
      options.push({ value: "ENFANT", label: "Enfant" });
    }

    setBeneficiaireOptions(options);

    if (
      formData.beneficiaire_type !== "EMPLOYE" &&
      !options.find((opt) => opt.value === formData.beneficiaire_type)
    ) {
      setFormData((prev) => ({ ...prev, beneficiaire_type: "EMPLOYE", beneficiaire_nom: "" }));
    }
  }, [selectedAffiliation]);

  // Calculer reste_a_charge
  useEffect(() => {
    const total = parseFloat(formData.montant_total) || 0;
    const rembourse = parseFloat(formData.montant_rembourse) || 0;
    const reste = Math.max(total - rembourse, 0).toFixed(2);
    setFormData((prev) => ({ ...prev, reste_a_charge: reste }));
  }, [formData.montant_total, formData.montant_rembourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAffiliationChange = (selected) => {
    setSelectedAffiliation(selected);
    setFormData((prev) => ({ ...prev, affiliation_id: selected ? selected.value : null }));
    if (errors.affiliation_id) {
      setErrors((prev) => ({ ...prev, affiliation_id: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.affiliation_id) newErrors.affiliation_id = "L'affiliation est requise";
    if (!formData.numero_dossier) newErrors.numero_dossier = "Le numéro de dossier est requis";
    if (!formData.date_operation) newErrors.date_operation = "La date d'opération est requise";
    if (!formData.type_operation) newErrors.type_operation = "Le type est requis";
    if (!formData.montant_total || parseFloat(formData.montant_total) <= 0) {
      newErrors.montant_total = "Le montant total doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (documentFile && !documentType.trim()) {
      setDocumentError("Le type de document est requis si un fichier est s\u00e9lectionn\u00e9");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      setDocumentError(null);
      const payload = {
        affiliation_id: formData.affiliation_id,
        numero_dossier: formData.numero_dossier,
        beneficiaire_type: formData.beneficiaire_type,
        beneficiaire_nom: formData.beneficiaire_nom || null,
        date_operation: formData.date_operation,
        date_depot: formData.date_depot || null,
        date_remboursement: formData.date_remboursement || null,
        type_operation: formData.type_operation,
        statut: formData.statut,
        montant_total: parseFloat(formData.montant_total),
        montant_rembourse: parseFloat(formData.montant_rembourse) || 0,
        commentaire: formData.commentaire || null,
      };

      if (operation) {
        await api.put(`/mutuelles/operations/${operation.id}`, payload);
      } else {
        if (!activeEmploye?.id) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Veuillez Sélectionner un Employé",
          });
          setSubmitting(false);
          return;
        }
        await api.post(`/mutuelles/dossiers/${activeEmploye.id}/operations`, payload);
      }

      let operationId = operation?.id || null;
      if (!operationId) {
        try {
          const listResp = await api.get(`/mutuelles/dossiers/${activeEmploye?.id}/operations`);
          const ops = listResp.data || [];
          const found = Array.isArray(ops)
            ? ops.find((op) => op.numero_dossier === formData.numero_dossier)
            : null;
          operationId = found?.id || (Array.isArray(ops) && ops[0]?.id ? ops[0].id : null);
        } catch (fetchErr) {
          console.error("Impossible de récupérer l'opération créée", fetchErr);
        }
      }

      if (documentFile && operationId) {
        try {
          const fd = new FormData();
          fd.append("operation_id", operationId);
          fd.append("fichier", documentFile);
          fd.append("nom", documentType || "Document lié");
          await api.post("/mutuelles/documents", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (uploadErr) {
          console.error("Upload document échoué:", uploadErr);
          Swal.fire({
            icon: "warning",
            title: "Opération créée",
            text: "L'upload du document a échoué.",
          });
        }
      }

      onSaved();
      setDocumentType("");
      setDocumentFile(null);
      setDocumentError(null);
      Swal.fire({
        icon: "success",
        title: "Opération enregistrée",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : "Une erreur est survenue lors de l'enregistrement.";

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e5e7eb'
  };

  const sectionTitleStyle = {
    fontWeight: 600,
    color: '#3a8a90',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    fontSize: '0.875rem',
    height: '38px'
  };

  const content = (
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
            <CreditCard size={20} color="#3a8a90" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#3a8a90', fontSize: '1.1rem' }}>
              {operation ? "MODIFIER OPÉRATION" : "NOUVELLE OPÉRATION"}
            </Typography>
            {activeEmploye && (
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem', ml: 1 }}>
                - {activeEmploye.nom} {activeEmploye.prenom}
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#6b7280',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box className="panel-body" sx={{ flex: 1, overflowY: 'auto', p: 3, minHeight: 0 }}>
          <Form onSubmit={handleSubmit}>
            {!employe && (
              <Box sx={{ mb: 3 }}>
                <Box sx={sectionHeaderStyle}>
                  <User size={16} color="#3a8a90" />
                  <Typography variant="subtitle2" sx={sectionTitleStyle}>Employé Concerné</Typography>
                </Box>
                <Box sx={{ px: 0 }}>
                  <Form.Group className="mb-3">
                    <Form.Label style={labelStyle}>Employé *</Form.Label>
                    <Select
                      options={employeeOptions}
                      value={selectedEmploye ? { value: selectedEmploye, label: `${selectedEmploye.nom} ${selectedEmploye.prenom} (${selectedEmploye.matricule})` } : null}
                      onChange={(opt) => {
                        setSelectedEmploye(opt ? opt.value : null);
                        setSelectedAffiliation(null);
                        setFormData(prev => ({ ...prev, affiliation_id: null }));
                      }}
                      placeholder="Rechercher un Employé..."
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? '#14b8a6' : '#ced4da',
                          minHeight: '38px',
                          fontSize: '0.875rem'
                        }),
                      }}
                    />
                  </Form.Group>
                </Box>
              </Box>
            )}

            {/* Section: INFORMATIONS DOSSIER */}
            <Box sx={{ mb: 3 }}>
              <Box sx={sectionHeaderStyle}>
                <FileText size={16} color="#3a8a90" />
                <Typography variant="subtitle2" sx={sectionTitleStyle}>Informations Dossier</Typography>
              </Box>
              <Box sx={{ px: 0 }}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>N° Dossier *</Form.Label>
                  <Form.Control
                    type="text"
                    name="numero_dossier"
                    value={formData.numero_dossier}
                    onChange={handleChange}
                    readOnly={!!dossierFixed}
                    isInvalid={!!errors.numero_dossier}
                    placeholder="DOSS-XXXX-XXXX"
                    style={inputStyle}
                  />
                  {errors.numero_dossier && <small className="text-danger">{errors.numero_dossier}</small>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Affiliation mutuelle *</Form.Label>
                  <Select
                    options={affiliationsList}
                    value={selectedAffiliation}
                    onChange={handleAffiliationChange}
                    placeholder="Sélectionner..."
                    isDisabled={!!operation || (!!affiliationIdProposed)}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: errors.affiliation_id ? '#dc2626' : state.isFocused ? '#14b8a6' : '#e5e7eb',
                        minHeight: '38px',
                        fontSize: '0.875rem',
                        '&:hover': { borderColor: '#14b8a6' }
                      }),
                    }}
                  />
                  {errors.affiliation_id && <small className="text-danger">{errors.affiliation_id}</small>}
                </Form.Group>
              </Box>
            </Box>

            {/* Section: BÉNÉFICIAIRE */}
            <Box sx={{ mb: 3 }}>
              <Box sx={sectionHeaderStyle}>
                <User size={16} color="#3a8a90" />
                <Typography variant="subtitle2" sx={sectionTitleStyle}>Bénéficiaire</Typography>
              </Box>
              <Box sx={{ px: 0 }}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Type *</Form.Label>
                  <Form.Select
                    name="beneficiaire_type"
                    value={formData.beneficiaire_type}
                    onChange={handleChange}
                    disabled={!selectedAffiliation}
                    style={inputStyle}
                  >
                    {beneficiaireOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Nom du bénéficiaire</Form.Label>
                  <Form.Control
                    type="text"
                    name="beneficiaire_nom"
                    value={formData.beneficiaire_nom}
                    onChange={handleChange}
                    placeholder={formData.beneficiaire_type === "EMPLOYE" ? "L'Employé lui-même" : "Nom..."}
                    style={inputStyle}
                  />
                </Form.Group>
              </Box>
            </Box>

            {/* Section: DATES & WORKFLOW */}
            <Box sx={{ mb: 3 }}>
              <Box sx={sectionHeaderStyle}>
                <Calendar size={16} color="#3a8a90" />
                <Typography variant="subtitle2" sx={sectionTitleStyle}>Dates & Workflow</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Date Opération *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_operation"
                    value={formData.date_operation}
                    onChange={handleChange}
                    isInvalid={!!errors.date_operation}
                    style={inputStyle}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label style={labelStyle}>Type d'opération *</Form.Label>
                  <Form.Select
                    name="type_operation"
                    value={formData.type_operation}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label style={labelStyle}>Date Dépôt</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_depot"
                    value={formData.date_depot}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label style={labelStyle}>Statut *</Form.Label>
                  <Form.Select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {statutOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <Form.Label style={labelStyle}>Date Remboursement</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_remboursement"
                    value={formData.date_remboursement}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Form.Group>
              </Box>
            </Box>

            {/* Section: MONTANTS (Stacking for full width consistency) */}
            <Box sx={{ mb: 3 }}>
              <Box sx={sectionHeaderStyle}>
                <DollarSign size={16} color="#3a8a90" />
                <Typography variant="subtitle2" sx={sectionTitleStyle}>Montants (DH)</Typography>
              </Box>
              <Box sx={{ px: 0 }}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Total *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="montant_total"
                    value={formData.montant_total}
                    onChange={handleChange}
                    isInvalid={!!errors.montant_total}
                    style={inputStyle}
                  />
                  {errors.montant_total && <small className="text-danger">{errors.montant_total}</small>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Remboursé</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="montant_rembourse"
                    value={formData.montant_rembourse}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Reste à charge</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.reste_a_charge}
                    readOnly
                    style={{ ...inputStyle, backgroundColor: '#f9fafb' }}
                  />
                </Form.Group>
              </Box>
            </Box>

            {/* Section: COMMENTAIRE */}
            <Box sx={{ mb: 3 }}>
              <Box sx={sectionHeaderStyle}>
                <MessageSquare size={16} color="#3a8a90" />
                <Typography variant="subtitle2" sx={sectionTitleStyle}>Commentaire</Typography>
              </Box>
              <Box sx={{ px: 0 }}>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="commentaire"
                  value={formData.commentaire}
                  onChange={handleChange}
                  placeholder="Notes..."
                  style={{ fontSize: '0.875rem' }}
                />
              </Box>
            </Box>

            {/* Section: DOCUMENTS LIÉS */}
            <Box sx={{ mb: 3 }}>
              <Box sx={sectionHeaderStyle}>
                <FileText size={16} color="#3a8a90" />
                <Typography variant="subtitle2" sx={sectionTitleStyle}>Documents liés</Typography>
              </Box>
              <Box sx={{ px: 0 }}>
                <Form.Group className="mb-3">
                  <Form.Label style={labelStyle}>Type de document</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentType}
                    onChange={(e) => {
                      setDocumentType(e.target.value);
                      if (documentError) setDocumentError(null);
                    }}
                    placeholder="Ex: Facture, Ordonnance..."
                    isInvalid={!!documentError}
                    style={inputStyle}
                  />
                  {documentError && (
                    <Form.Control.Feedback type="invalid">
                      {documentError}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label style={labelStyle}>Fichier</Form.Label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        setDocumentError("Taille max 5 Mo dépassée");
                        setDocumentFile(null);
                        return;
                      }
                      setDocumentFile(file || null);
                      setDocumentError(null);
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MuiButton
                      size="small"
                      variant="outlined"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choisir un fichier
                    </MuiButton>
                    <Form.Control
                      type="text"
                      readOnly
                      value={documentFile ? documentFile.name : "Aucun fichier sélectionné"}
                      style={{ ...inputStyle, backgroundColor: '#f9fafb' }}
                    />
                    {documentFile && (
                      <MuiButton
                        size="small"
                        variant="text"
                        onClick={() => { setDocumentFile(null); setDocumentType(""); setDocumentError(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      >
                        Retirer
                      </MuiButton>
                    )}
                  </div>
                </Form.Group>
              </Box>
            </Box>
          </Form>
        </Box>

        {/* Footer */}
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
            onClick={onClose}
            disabled={submitting}
            sx={{
              color: '#6b7280',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            ANNULER
          </MuiButton>
          <MuiButton
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              backgroundColor: '#007580ff',
              color: '#ffffff',
              px: 3,
              '&:hover': { backgroundColor: '#3a8a90' },
              '&:disabled': { backgroundColor: '#9ca3af' }
            }}
          >
            {submitting ? "ENREGISTREMENT..." : "ENREGISTRER"}
          </MuiButton>
        </Box>
      </Box>
    </div>
  );

  if (isSidebar) {
    return (
      <div className="add-affiliation-panel" style={{ width: '100%', height: '100%', boxShadow: 'none', animation: 'slideInRight 0.3s ease-out' }}>
        {content}
      </div>
    );
  }

  return (
    <div className="add-affiliation-overlay">
      <div className="add-affiliation-panel">
        {content}
      </div>
    </div>
  );
}

export default AddMutuelleOperation;









