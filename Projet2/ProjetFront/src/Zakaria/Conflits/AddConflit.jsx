import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import {
  User, Calendar, MapPin, Save, Plus, AlertTriangle, FileText, Users, 
  Shield, Paperclip, Settings, X, Upload, Trash2
} from "lucide-react";
import "./AddConflit.css";
import ManageResourceModal from "./ManageResourceModal";

const graviteOptions = [
  { value: 'faible', label: 'Faible', color: '#22c55e' },
  { value: 'moyen', label: 'Moyen', color: '#f59e0b' },
  { value: 'eleve', label: 'Élevé', color: '#f97316' },
  { value: 'critique', label: 'Critique', color: '#dc2626' },
];

const typesFichier = [
  { value: 'photo', label: 'Photo' },
  { value: 'email', label: 'Email' },
  { value: 'rapport', label: 'Rapport' },
  { value: 'temoignage', label: 'Témoignage' },
  { value: 'autre', label: 'Autre' },
];

const AddConflit = ({ onClose, onSave, initialData, preloadedEmployees = [], onResourceUpdate }) => {
  const [employees, setEmployees] = useState(preloadedEmployees);
  const [loadingEmployees, setLoadingEmployees] = useState(preloadedEmployees.length === 0);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedPartieEmpId, setSelectedPartieEmpId] = useState(""); // Pour partie impliquée interne
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Resource states
  const [lieux, setLieux] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuts, setStatuts] = useState([]);

  // Modals visibility
  const [manageLieuModal, setManageLieuModal] = useState(false);
  const [manageTypeModal, setManageTypeModal] = useState(false);
  const [manageStatutModal, setManageStatutModal] = useState(false);

  // Files state
  const [newFiles, setNewFiles] = useState([]); // Files to upload
  const [existingFiles, setExistingFiles] = useState([]); // Already uploaded files (edit mode)
  const [filesToDelete, setFilesToDelete] = useState([]); // IDs of files to delete

  const [form, setForm] = useState({
    // Section 1
    employe: "",
    matricule: "",
    departement: "",
    poste: "",
    dateIncident: "",
    conflit_lieu_id: "",
    // Section 2
    conflit_type_id: "",
    // Section 3
    partie_nom: "",
    partie_type: "",
    partie_fonction: "",
    partie_organisation: "",
    // Section 4
    description: "",
    temoins: "",
    circonstances: "",
    // Section 5
    gravite_raw: "faible",
    confidentialite_raw: "normal",
    // Section 7
    conflit_statut_id: "",
    responsable_rh: "",
    commentaires_rh: "",
  });

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setForm({
        employe: initialData.employe || "",
        matricule: initialData.matricule || "",
        departement: initialData.departement || "",
        poste: initialData.poste || "",
        dateIncident: initialData.dateIncident || "",
        conflit_lieu_id: initialData.conflit_lieu_id || "",
        conflit_type_id: initialData.conflit_type_id || "",
        partie_nom: initialData.partie_nom || "",
        partie_type: initialData.partie_type || "",
        partie_fonction: initialData.partie_fonction || "",
        partie_organisation: initialData.partie_organisation || "",
        description: initialData.description || "",
        temoins: initialData.temoins || "",
        circonstances: initialData.circonstances || "",
        gravite_raw: initialData.gravite_raw || "faible",
        confidentialite_raw: initialData.confidentialite_raw || "normal",
        conflit_statut_id: initialData.conflit_statut_id || "",
        responsable_rh: initialData.responsable_rh || "",
        commentaires_rh: initialData.commentaires_rh || "",
      });
      setExistingFiles(initialData.pieces_jointes || []);

      // Find employee by matricule
      if (initialData.matricule && preloadedEmployees.length > 0) {
        const found = preloadedEmployees.find(e => e.matricule === initialData.matricule);
        if (found) setSelectedEmpId(found.id);
      }
    }
  }, [initialData, preloadedEmployees]);

  // Load employees if not preloaded
  useEffect(() => {
    if (preloadedEmployees.length > 0) {
      setEmployees(preloadedEmployees);
      setLoadingEmployees(false);
    } else {
      axios.get("http://127.0.0.1:8000/api/employes/light", { withCredentials: true })
        .then(res => {
          if (Array.isArray(res.data)) {
            setEmployees(res.data);
          }
        })
        .catch(err => console.error("Error fetching employees", err))
        .finally(() => setLoadingEmployees(false));
    }
  }, [preloadedEmployees]);

  // Fetch resources (lieux, types, statuts)
  const fetchLieux = () => {
    const cached = localStorage.getItem('conflitLieuxCache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) setLieux(data);
      } catch (e) { /* ignore */ }
    }
    axios.get("http://127.0.0.1:8000/api/conflit-lieux", { withCredentials: true })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setLieux(data);
        localStorage.setItem('conflitLieuxCache', JSON.stringify(data));
      })
      .catch(err => console.error("Error fetching lieux", err));
  };

  const fetchTypes = () => {
    const cached = localStorage.getItem('conflitTypesCache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) setTypes(data);
      } catch (e) { /* ignore */ }
    }
    axios.get("http://127.0.0.1:8000/api/conflit-types", { withCredentials: true })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTypes(data);
        localStorage.setItem('conflitTypesCache', JSON.stringify(data));
      })
      .catch(err => console.error("Error fetching types", err));
  };

  const fetchStatuts = () => {
    const cached = localStorage.getItem('conflitStatutsCache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (Array.isArray(data) && data.length > 0) setStatuts(data);
      } catch (e) { /* ignore */ }
    }
    axios.get("http://127.0.0.1:8000/api/conflit-statuts", { withCredentials: true })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setStatuts(data);
        localStorage.setItem('conflitStatutsCache', JSON.stringify(data));
      })
      .catch(err => console.error("Error fetching statuts", err));
  };

  useEffect(() => {
    fetchLieux();
    fetchTypes();
    fetchStatuts();
  }, []);

  // CRUD handlers for Lieux
  const handleAddLieu = async (nom) => {
    const res = await axios.post("http://127.0.0.1:8000/api/conflit-lieux", { nom }, { withCredentials: true });
    const newLieux = [...lieux, res.data];
    setLieux(newLieux);
    setForm(prev => ({ ...prev, conflit_lieu_id: res.data.id }));
    localStorage.setItem('conflitLieuxCache', JSON.stringify(newLieux));
    onResourceUpdate?.('lieux', newLieux);
  };

  const handleEditLieu = async (id, nom) => {
    const res = await axios.put(`http://127.0.0.1:8000/api/conflit-lieux/${id}`, { nom }, { withCredentials: true });
    const newLieux = lieux.map(item => String(item.id) === String(id) ? res.data : item);
    setLieux(newLieux);
    localStorage.setItem('conflitLieuxCache', JSON.stringify(newLieux));
    onResourceUpdate?.('lieux', newLieux);
  };

  const handleDeleteLieu = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/conflit-lieux/${id}`, { withCredentials: true });
    const newLieux = lieux.filter(item => String(item.id) !== String(id));
    setLieux(newLieux);
    localStorage.setItem('conflitLieuxCache', JSON.stringify(newLieux));
    onResourceUpdate?.('lieux', newLieux);
    if (String(form.conflit_lieu_id) === String(id)) setForm(prev => ({ ...prev, conflit_lieu_id: "" }));
  };

  // CRUD handlers for Types
  const handleAddType = async (nom) => {
    const res = await axios.post("http://127.0.0.1:8000/api/conflit-types", { nom }, { withCredentials: true });
    const newTypes = [...types, res.data];
    setTypes(newTypes);
    setForm(prev => ({ ...prev, conflit_type_id: res.data.id }));
    localStorage.setItem('conflitTypesCache', JSON.stringify(newTypes));
    onResourceUpdate?.('types', newTypes);
  };

  const handleEditType = async (id, nom) => {
    const res = await axios.put(`http://127.0.0.1:8000/api/conflit-types/${id}`, { nom }, { withCredentials: true });
    const newTypes = types.map(item => String(item.id) === String(id) ? res.data : item);
    setTypes(newTypes);
    localStorage.setItem('conflitTypesCache', JSON.stringify(newTypes));
    onResourceUpdate?.('types', newTypes);
  };

  const handleDeleteType = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/conflit-types/${id}`, { withCredentials: true });
    const newTypes = types.filter(item => String(item.id) !== String(id));
    setTypes(newTypes);
    localStorage.setItem('conflitTypesCache', JSON.stringify(newTypes));
    onResourceUpdate?.('types', newTypes);
    if (String(form.conflit_type_id) === String(id)) setForm(prev => ({ ...prev, conflit_type_id: "" }));
  };

  // CRUD handlers for Statuts
  const handleAddStatut = async (nom) => {
    const res = await axios.post("http://127.0.0.1:8000/api/conflit-statuts", { nom }, { withCredentials: true });
    const newStatuts = [...statuts, res.data];
    setStatuts(newStatuts);
    setForm(prev => ({ ...prev, conflit_statut_id: res.data.id }));
    localStorage.setItem('conflitStatutsCache', JSON.stringify(newStatuts));
    onResourceUpdate?.('statuts', newStatuts);
  };

  const handleEditStatut = async (id, nom) => {
    const res = await axios.put(`http://127.0.0.1:8000/api/conflit-statuts/${id}`, { nom }, { withCredentials: true });
    const newStatuts = statuts.map(item => String(item.id) === String(id) ? res.data : item);
    setStatuts(newStatuts);
    localStorage.setItem('conflitStatutsCache', JSON.stringify(newStatuts));
    onResourceUpdate?.('statuts', newStatuts);
  };

  const handleDeleteStatut = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/conflit-statuts/${id}`, { withCredentials: true });
    const newStatuts = statuts.filter(item => String(item.id) !== String(id));
    setStatuts(newStatuts);
    localStorage.setItem('conflitStatutsCache', JSON.stringify(newStatuts));
    onResourceUpdate?.('statuts', newStatuts);
    if (String(form.conflit_statut_id) === String(id)) setForm(prev => ({ ...prev, conflit_statut_id: "" }));
  };

  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    setSelectedEmpId(empId);

    if (empId) {
      const emp = employees.find(ep => String(ep.id) === String(empId));
      if (emp) {
        // Find department name
        let deptName = "";
        if (emp.departement && emp.departement.nom) {
          deptName = emp.departement.nom;
        }

        setForm(prev => ({
          ...prev,
          employe: `${emp.prenom} ${emp.nom}`,
          matricule: emp.matricule,
          departement: deptName,
          poste: emp.fonction || ""
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        employe: "",
        matricule: "",
        departement: "",
        poste: ""
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Si on change le type de partie, réinitialiser la sélection d'employé
    if (name === 'partie_type' && value !== 'interne') {
      setSelectedPartieEmpId("");
    }
  };

  // Sélection d'un employé comme partie impliquée
  const handlePartieEmployeeSelect = (e) => {
    const empId = e.target.value;
    setSelectedPartieEmpId(empId);

    if (empId) {
      const emp = employees.find(ep => String(ep.id) === String(empId));
      if (emp) {
        setForm(prev => ({
          ...prev,
          partie_nom: `${emp.prenom} ${emp.nom}`,
          partie_fonction: emp.fonction || "",
          partie_organisation: emp.departement?.nom || ""
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        partie_nom: "",
        partie_fonction: "",
        partie_organisation: ""
      }));
    }
  };

  // File handling
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFilesToAdd = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: 'autre', // Default type
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setNewFiles(prev => [...prev, ...newFilesToAdd]);
    e.target.value = ''; // Reset input
  };

  const handleFileTypeChange = (index, newType) => {
    setNewFiles(prev => prev.map((f, i) => i === index ? { ...f, type: newType } : f));
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => {
      const file = prev[index];
      if (file.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const markExistingFileForDeletion = (fileId) => {
    setFilesToDelete(prev => [...prev, fileId]);
    setExistingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare form data for API
      const apiData = {
        employe: form.employe,
        matricule: form.matricule,
        departement: form.departement,
        poste: form.poste,
        date_incident: form.dateIncident,
        conflit_lieu_id: form.conflit_lieu_id,
        conflit_type_id: form.conflit_type_id,
        partie_nom: form.partie_nom,
        partie_type: form.partie_type,
        partie_fonction: form.partie_fonction,
        partie_organisation: form.partie_organisation,
        description: form.description,
        temoins: form.temoins,
        circonstances: form.circonstances,
        gravite: form.gravite_raw,
        confidentialite: form.confidentialite_raw,
        conflit_statut_id: form.conflit_statut_id,
        responsable_rh: form.responsable_rh,
        commentaires_rh: form.commentaires_rh,
        fichiers_a_supprimer: filesToDelete,
      };

      onSave(apiData, newFiles);
    } catch (error) {
      console.error("Error saving conflit:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-conflit-container shadow-lg">
      {/* Header */}
      <div style={{
        position: 'relative',
        background: '#f9fafb',
        borderBottom: '1px solid #e9ecef',
        padding: '0.99rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h5 style={{
          margin: 0,
          fontWeight: 600,
          fontSize: '1.15rem',
          color: '#4b5563',
          textAlign: 'center',
          letterSpacing: '0.2px',
        }}>
          {initialData ? 'Modifier le Conflit' : 'Déclarer un Conflit / Incident'}
        </h5>
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            fontSize: '1.3rem',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            lineHeight: 1,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="form-body p-3 flex-grow-1 overflow-auto">
        <Form onSubmit={handleSubmit}>
          {/* Section 1: Informations générales */}
          <div className="section-title-custom">
            <User size={16} /> Informations générales
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Employé concerné</Form.Label>
                {loadingEmployees ? (
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span className="text-muted small">Chargement...</span>
                  </div>
                ) : (
                  <Form.Select
                    className="custom-input"
                    value={selectedEmpId}
                    onChange={handleEmployeeSelect}
                    required
                  >
                    <option value="">-- Sélectionner un employé --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.prenom} {emp.nom} ({emp.matricule})
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Matricule</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  name="matricule"
                  value={form.matricule}
                  onChange={handleChange}
                  placeholder="Matricule"
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Département</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  name="departement"
                  value={form.departement}
                  onChange={handleChange}
                  placeholder="Département"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Poste</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  name="poste"
                  value={form.poste}
                  onChange={handleChange}
                  placeholder="Poste occupé"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-1">
                <Form.Label className="small fw-bold">Date de l'incident</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="date"
                  name="dateIncident"
                  value={form.dateIncident}
                  onChange={handleChange}
                  size="sm"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Lieu de l'incident</Form.Label>
                <InputGroup>
                  <Form.Select
                    className="custom-input"
                    name="conflit_lieu_id"
                    value={form.conflit_lieu_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {lieux.map(l => (
                      <option key={l.id} value={l.id}>{l.nom}</option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setManageLieuModal(true)}
                    title="Gérer les lieux"
                  >
                    <Plus size={18} />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Section 2: Nature du conflit */}
          <div className="section-title-custom mt-4">
            <AlertTriangle size={16} /> Nature du conflit / incident
          </div>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-bold">Type d'incident</Form.Label>
                <InputGroup>
                  <Form.Select
                    className="custom-input"
                    name="conflit_type_id"
                    value={form.conflit_type_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner le type --</option>
                    {types.map(t => (
                      <option key={t.id} value={t.id}>{t.nom}</option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setManageTypeModal(true)}
                    title="Gérer les types"
                  >
                    <Plus size={18} />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* Section 3: Partie impliquée */}
          <div className="section-title-custom mt-4">
            <Users size={16} /> Partie impliquée
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Type de partie</Form.Label>
                <Form.Select
                  className="custom-input"
                  name="partie_type"
                  value={form.partie_type}
                  onChange={handleChange}
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="interne">Interne (employé, stagiaire…)</option>
                  <option value="externe">Externe (client, fournisseur, visiteur…)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {form.partie_type === 'interne' ? (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Sélectionner l'employé</Form.Label>
                  <Form.Select
                    className="custom-input"
                    value={selectedPartieEmpId}
                    onChange={handlePartieEmployeeSelect}
                    disabled={loadingEmployees}
                  >
                    <option value="">-- Choisir un employé --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.matricule} - {emp.prenom} {emp.nom}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            ) : (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Nom / Désignation</Form.Label>
                  <Form.Control
                    className="custom-input"
                    type="text"
                    name="partie_nom"
                    value={form.partie_nom}
                    onChange={handleChange}
                    placeholder="Nom de la partie impliquée"
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          {form.partie_type === 'interne' && selectedPartieEmpId && (
            <Row className="mb-3">
              <Col md={12}>
                <div className="alert alert-info py-2 small mb-0">
                  <strong>Employé sélectionné :</strong> {form.partie_nom} | <strong>Poste :</strong> {form.partie_fonction || '-'} | <strong>Département :</strong> {form.partie_organisation || '-'}
                </div>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Fonction / Relation</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  name="partie_fonction"
                  value={form.partie_fonction}
                  onChange={handleChange}
                  placeholder="Fonction ou relation avec l'entreprise"
                  disabled={form.partie_type === 'interne' && selectedPartieEmpId}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Organisation / Département</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  name="partie_organisation"
                  value={form.partie_organisation}
                  onChange={handleChange}
                  placeholder="Nom de l'organisation"
                  disabled={form.partie_type !== 'externe'}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Section 4: Description */}
          <div className="section-title-custom mt-4">
            <FileText size={16} /> Description de l'incident
          </div>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-bold">Description détaillée des faits</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="custom-input"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Décrivez en détail ce qui s'est passé..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Témoins éventuels</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="custom-input"
                  name="temoins"
                  value={form.temoins}
                  onChange={handleChange}
                  placeholder="Noms des témoins présents..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Circonstances</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="custom-input"
                  name="circonstances"
                  value={form.circonstances}
                  onChange={handleChange}
                  placeholder="Contexte et circonstances..."
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Section 5: Évaluation RH */}
          <div className="section-title-custom mt-4">
            <Shield size={16} /> Évaluation RH
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Niveau de gravité</Form.Label>
                <div className="gravite-buttons">
                  {graviteOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`gravite-btn ${form.gravite_raw === opt.value ? 'active' : ''}`}
                      style={{
                        borderColor: form.gravite_raw === opt.value ? opt.color : '#e2e8f0',
                        backgroundColor: form.gravite_raw === opt.value ? `${opt.color}15` : 'white',
                        color: form.gravite_raw === opt.value ? opt.color : '#64748b'
                      }}
                      onClick={() => setForm(prev => ({ ...prev, gravite_raw: opt.value }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Niveau de confidentialité</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="conf-normal"
                    name="confidentialite_raw"
                    label="Normal"
                    value="normal"
                    checked={form.confidentialite_raw === 'normal'}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    id="conf-sensible"
                    name="confidentialite_raw"
                    label="Sensible"
                    value="sensible"
                    checked={form.confidentialite_raw === 'sensible'}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Section 6: Pièces jointes */}
          <div className="section-title-custom mt-4">
            <Paperclip size={16} /> Pièces jointes
          </div>

          <div className="files-section mb-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.eml"
              style={{ display: 'none' }}
            />
            
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              Ajouter des fichiers
            </button>

            <p className="text-muted small mt-2">
              Formats acceptés: Images, PDF, Word, Excel, Email (.eml) - Max 10 MB par fichier
            </p>

            {/* Existing files (edit mode) */}
            {existingFiles.length > 0 && (
              <div className="existing-files mt-3">
                <h6 className="small fw-bold mb-2">Fichiers existants</h6>
                {existingFiles.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-info">
                      <Paperclip size={14} />
                      <span className="file-name">{file.nom_fichier}</span>
                      <span className="file-type">{file.type_fichier}</span>
                    </div>
                    <button
                      type="button"
                      className="file-delete-btn"
                      onClick={() => markExistingFileForDeletion(file.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New files to upload */}
            {newFiles.length > 0 && (
              <div className="new-files mt-3">
                <h6 className="small fw-bold mb-2">Nouveaux fichiers</h6>
                {newFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      {file.preview ? (
                        <img src={file.preview} alt="" className="file-preview" />
                      ) : (
                        <Paperclip size={14} />
                      )}
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="file-actions">
                      <Form.Select
                        size="sm"
                        value={file.type}
                        onChange={(e) => handleFileTypeChange(index, e.target.value)}
                        className="file-type-select"
                      >
                        {typesFichier.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </Form.Select>
                      <button
                        type="button"
                        className="file-delete-btn"
                        onClick={() => removeNewFile(index)}
                        title="Supprimer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Suivi du dossier */}
          <div className="section-title-custom mt-4">
            <Settings size={16} /> Suivi du dossier
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Statut du dossier</Form.Label>
                <InputGroup>
                  <Form.Select
                    className="custom-input"
                    name="conflit_statut_id"
                    value={form.conflit_statut_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {statuts.map(s => (
                      <option key={s.id} value={s.id}>{s.nom}</option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setManageStatutModal(true)}
                    title="Gérer les statuts"
                  >
                    <Plus size={18} />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Responsable RH en charge</Form.Label>
                <Form.Control
                  className="custom-input"
                  type="text"
                  name="responsable_rh"
                  value={form.responsable_rh}
                  onChange={handleChange}
                  placeholder="Nom du responsable RH"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-bold">Commentaires RH</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="custom-input"
                  name="commentaires_rh"
                  value={form.commentaires_rh}
                  onChange={handleChange}
                  placeholder="Notes et commentaires internes RH..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Footer */}
      <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
      }}>
          <button
              onClick={onClose}
              style={{
                  background: '#2c7a7b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 32px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
              Annuler
          </button>
          <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                  background: '#2c7a7b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 32px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'opacity 0.15s',
                  opacity: saving ? 0.7 : 1,
              }}
              onMouseEnter={e => !saving && (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => !saving && (e.currentTarget.style.opacity = '1')}
          >
              {saving ? (
                  <>
                      <Spinner animation="border" size="sm" />
                      Enregistrement...
                  </>
              ) : (
                  <>
                      <Save size={16} />
                      {initialData ? 'Mettre à jour' : 'Enregistrer'}
                  </>
              )}
          </button>
      </div>

      {/* Modals de gestion Lieux, Types, Statuts */}
      <ManageResourceModal
        show={manageLieuModal}
        onHide={() => setManageLieuModal(false)}
        title="Gérer les Lieux"
        items={lieux}
        onAdd={handleAddLieu}
        onEdit={handleEditLieu}
        onDelete={handleDeleteLieu}
      />

      <ManageResourceModal
        show={manageTypeModal}
        onHide={() => setManageTypeModal(false)}
        title="Gérer les Types d'Incident"
        items={types}
        onAdd={handleAddType}
        onEdit={handleEditType}
        onDelete={handleDeleteType}
      />

      <ManageResourceModal
        show={manageStatutModal}
        onHide={() => setManageStatutModal(false)}
        title="Gérer les Statuts"
        items={statuts}
        onAdd={handleAddStatut}
        onEdit={handleEditStatut}
        onDelete={handleDeleteStatut}
      />
    </div>
  );
};

export default AddConflit;
