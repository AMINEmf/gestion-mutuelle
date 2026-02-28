import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Form, Button, Row, Col, InputGroup, Spinner, Alert } from "react-bootstrap";
import {
    User, Calendar, Activity, Save, Plus, FileText, AlertTriangle, Upload, X, File
} from "lucide-react";
import "./AddSanction.css";
import ManageResourceModal from "./ManageResourceModal";

const AddSanction = ({ onClose, onSave, departementId, initialData, preloadedEmployees = [], onResourceUpdate }) => {
    const [employees, setEmployees] = useState(preloadedEmployees);
    const [loadingEmployees, setLoadingEmployees] = useState(preloadedEmployees.length === 0);
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    // Resource states
    const [types, setTypes] = useState([]);
    const [gravites, setGravites] = useState([]);
    const [statuts, setStatuts] = useState([]);
    const [conflits, setConflits] = useState([]);

    // Modals visibility
    const [manageTypeModal, setManageTypeModal] = useState(false);
    const [manageGraviteModal, setManageGraviteModal] = useState(false);
    const [manageStatutModal, setManageStatutModal] = useState(false);

    // Files state
    const [newFiles, setNewFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);

    // Employee history alert
    const [employeeHistory, setEmployeeHistory] = useState(null);

    const [form, setForm] = useState(initialData || {
        employe: "",
        matricule: "",
        dateSanction: "",
        referenceDossier: "",
        sanction_type_id: "",
        motifDescription: "",
        rappelFaits: "",
        conflit_id: "",
        sanction_gravite_id: "",
        dureeJours: "",
        impactSalaire: false,
        montantImpact: "",
        dateEffet: "",
        dateFin: "",
        sanction_statut_id: "",
        commentairesRh: "",
        departement_id: departementId || ""
    });

    // Fetch resources with cache
    const fetchTypes = () => {
        const cached = localStorage.getItem('sanctionTypesCache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Array.isArray(data) && data.length > 0) setTypes(data);
            } catch (e) { /* ignore */ }
        }
        axios.get("http://127.0.0.1:8000/api/sanction-types", { withCredentials: true })
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setTypes(data);
                localStorage.setItem('sanctionTypesCache', JSON.stringify(data));
            })
            .catch(err => console.error("Error fetching types", err));
    };

    const fetchGravites = () => {
        const cached = localStorage.getItem('sanctionGravitesCache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Array.isArray(data) && data.length > 0) setGravites(data);
            } catch (e) { /* ignore */ }
        }
        axios.get("http://127.0.0.1:8000/api/sanction-gravites", { withCredentials: true })
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setGravites(data);
                localStorage.setItem('sanctionGravitesCache', JSON.stringify(data));
            })
            .catch(err => console.error("Error fetching gravites", err));
    };

    const fetchStatuts = () => {
        const cached = localStorage.getItem('sanctionStatutsCache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                if (Array.isArray(data) && data.length > 0) setStatuts(data);
            } catch (e) { /* ignore */ }
        }
        axios.get("http://127.0.0.1:8000/api/sanction-statuts", { withCredentials: true })
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setStatuts(data);
                localStorage.setItem('sanctionStatutsCache', JSON.stringify(data));
            })
            .catch(err => console.error("Error fetching statuts", err));
    };

    const fetchConflits = () => {
        axios.get("http://127.0.0.1:8000/api/conflits", { withCredentials: true })
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setConflits(data);
            })
            .catch(err => console.error("Error fetching conflits", err));
    };

    // Fetch employee sanction history
    const fetchEmployeeHistory = (matricule) => {
        if (!matricule) {
            setEmployeeHistory(null);
            return;
        }
        axios.get(`http://127.0.0.1:8000/api/sanctions/employee-history/${matricule}`, { withCredentials: true })
            .then(res => {
                if (res.data && res.data.total_active > 0) {
                    setEmployeeHistory(res.data);
                } else {
                    setEmployeeHistory(null);
                }
            })
            .catch(err => {
                console.error("Error fetching employee history", err);
                setEmployeeHistory(null);
            });
    };

    useEffect(() => {
        fetchTypes();
        fetchGravites();
        fetchStatuts();
        fetchConflits();
    }, []);

    useEffect(() => {
        if (preloadedEmployees.length > 0) {
            const filtered = departementId
                ? preloadedEmployees.filter(emp => {
                    if (String(emp.departement_id) === String(departementId)) return true;
                    if (emp.departements && Array.isArray(emp.departements)) {
                        return emp.departements.some(d => String(d.id) === String(departementId));
                    }
                    return false;
                })
                : preloadedEmployees;
            setEmployees(filtered);
            setLoadingEmployees(false);
            if (initialData && initialData.matricule) {
                const found = filtered.find(e => e.matricule === initialData.matricule);
                if (found) {
                    setSelectedEmpId(found.id);
                    fetchEmployeeHistory(initialData.matricule);
                }
            }
        } else {
            const cached = localStorage.getItem('employeesLightCache');
            if (cached) {
                try {
                    const allEmployees = JSON.parse(cached);
                    const filtered = departementId
                        ? allEmployees.filter(emp => String(emp.departement_id) === String(departementId))
                        : allEmployees;
                    setEmployees(filtered);
                    setLoadingEmployees(false);
                    if (initialData && initialData.matricule) {
                        const found = filtered.find(e => e.matricule === initialData.matricule);
                        if (found) {
                            setSelectedEmpId(found.id);
                            fetchEmployeeHistory(initialData.matricule);
                        }
                    }
                } catch (e) { /* ignore */ }
            }
            axios.get("http://127.0.0.1:8000/api/employes/light", { withCredentials: true })
                .then(res => {
                    if (Array.isArray(res.data)) {
                        localStorage.setItem('employeesLightCache', JSON.stringify(res.data));
                        const filtered = departementId
                            ? res.data.filter(emp => String(emp.departement_id) === String(departementId))
                            : res.data;
                        setEmployees(filtered);
                        if (initialData && initialData.matricule) {
                            const found = filtered.find(e => e.matricule === initialData.matricule);
                            if (found) {
                                setSelectedEmpId(found.id);
                                fetchEmployeeHistory(initialData.matricule);
                            }
                        }
                    }
                })
                .catch(err => console.error("Error fetching employees", err))
                .finally(() => setLoadingEmployees(false));
        }

        // Load existing files if editing
        if (initialData && initialData.documents) {
            setExistingFiles(initialData.documents);
        }
    }, [departementId, preloadedEmployees, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEmployeeChange = (e) => {
        const empId = e.target.value;
        setSelectedEmpId(empId);
        if (!empId) {
            setForm(prev => ({ ...prev, employe: "", matricule: "" }));
            setEmployeeHistory(null);
            return;
        }
        const emp = employees.find(x => String(x.id) === empId);
        if (emp) {
            const fullName = `${emp.prenom || ""} ${emp.nom || ""}`.trim() || emp.nom_complet || "";
            setForm(prev => ({
                ...prev,
                employe: fullName,
                matricule: emp.matricule || ""
            }));
            fetchEmployeeHistory(emp.matricule);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(prev => [...prev, ...files]);
    };

    const removeNewFile = (index) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingFile = (fileId) => {
        setFilesToDelete(prev => [...prev, fileId]);
        setExistingFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('employe', form.employe);
            formData.append('matricule', form.matricule);
            formData.append('date_sanction', form.dateSanction);
            formData.append('reference_dossier', form.referenceDossier || '');
            formData.append('departement_id', departementId || form.departement_id || '');
            formData.append('sanction_type_id', form.sanction_type_id);
            formData.append('motif_description', form.motifDescription || '');
            formData.append('rappel_faits', form.rappelFaits || '');
            formData.append('conflit_id', form.conflit_id || '');
            formData.append('sanction_gravite_id', form.sanction_gravite_id || '');
            formData.append('duree_jours', form.dureeJours || '');
            formData.append('impact_salaire', form.impactSalaire ? '1' : '0');
            formData.append('montant_impact', form.impactSalaire ? (form.montantImpact || '') : '');
            formData.append('date_effet', form.dateEffet || '');
            formData.append('date_fin', form.dateFin || '');
            formData.append('sanction_statut_id', form.sanction_statut_id);
            formData.append('commentaires_rh', form.commentairesRh || '');

            // Add new files
            newFiles.forEach(file => {
                formData.append('documents[]', file);
            });

            // Add files to delete
            if (filesToDelete.length > 0) {
                formData.append('files_to_delete', JSON.stringify(filesToDelete));
            }

            await onSave(formData, initialData?.id);
        } catch (error) {
            console.error("Error saving sanction:", error);
        } finally {
            setSaving(false);
        }
    };

    // Resource CRUD handlers
    const handleAddType = async (nom) => {
        const res = await axios.post("http://127.0.0.1:8000/api/sanction-types", { nom }, { withCredentials: true });
        setTypes(prev => [...prev, res.data]);
        localStorage.setItem('sanctionTypesCache', JSON.stringify([...types, res.data]));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleEditType = async (id, nom) => {
        const res = await axios.put(`http://127.0.0.1:8000/api/sanction-types/${id}`, { nom }, { withCredentials: true });
        setTypes(prev => prev.map(t => t.id === id ? res.data : t));
        localStorage.setItem('sanctionTypesCache', JSON.stringify(types.map(t => t.id === id ? res.data : t)));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleDeleteType = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/sanction-types/${id}`, { withCredentials: true });
        setTypes(prev => prev.filter(t => t.id !== id));
        localStorage.setItem('sanctionTypesCache', JSON.stringify(types.filter(t => t.id !== id)));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleAddGravite = async (nom) => {
        const res = await axios.post("http://127.0.0.1:8000/api/sanction-gravites", { nom }, { withCredentials: true });
        setGravites(prev => [...prev, res.data]);
        localStorage.setItem('sanctionGravitesCache', JSON.stringify([...gravites, res.data]));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleEditGravite = async (id, nom) => {
        const res = await axios.put(`http://127.0.0.1:8000/api/sanction-gravites/${id}`, { nom }, { withCredentials: true });
        setGravites(prev => prev.map(g => g.id === id ? res.data : g));
        localStorage.setItem('sanctionGravitesCache', JSON.stringify(gravites.map(g => g.id === id ? res.data : g)));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleDeleteGravite = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/sanction-gravites/${id}`, { withCredentials: true });
        setGravites(prev => prev.filter(g => g.id !== id));
        localStorage.setItem('sanctionGravitesCache', JSON.stringify(gravites.filter(g => g.id !== id)));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleAddStatut = async (nom) => {
        const res = await axios.post("http://127.0.0.1:8000/api/sanction-statuts", { nom }, { withCredentials: true });
        setStatuts(prev => [...prev, res.data]);
        localStorage.setItem('sanctionStatutsCache', JSON.stringify([...statuts, res.data]));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleEditStatut = async (id, nom) => {
        const res = await axios.put(`http://127.0.0.1:8000/api/sanction-statuts/${id}`, { nom }, { withCredentials: true });
        setStatuts(prev => prev.map(s => s.id === id ? res.data : s));
        localStorage.setItem('sanctionStatutsCache', JSON.stringify(statuts.map(s => s.id === id ? res.data : s)));
        if (onResourceUpdate) onResourceUpdate();
    };

    const handleDeleteStatut = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/sanction-statuts/${id}`, { withCredentials: true });
        setStatuts(prev => prev.filter(s => s.id !== id));
        localStorage.setItem('sanctionStatutsCache', JSON.stringify(statuts.filter(s => s.id !== id)));
        if (onResourceUpdate) onResourceUpdate();
    };

    return (
        <div className="add-sanction-container shadow-lg">
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
                    {initialData ? 'Modifier Sanction' : 'Nouvelle Sanction Disciplinaire'}
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

            <div className="form-body p-3 flex-grow-1 overflow-auto">
                <Form onSubmit={handleSubmit}>
                    {/* Employee History Alert */}
                    {employeeHistory && (
                        <Alert variant="warning" className="mb-3">
                            <AlertTriangle size={18} className="me-2" />
                            <strong>Attention !</strong> Cet employé a déjà {employeeHistory.total_active} sanction(s) active(s) :
                            <ul className="mb-0 mt-2">
                                {employeeHistory.active_summary.map((item, idx) => (
                                    <li key={idx}>{item.count} {item.type}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    {/* Section 1: Informations générales */}
                    <div className="section-title-custom">
                        <User size={16} /> Informations générales
                    </div>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Employé concerné *</Form.Label>
                                {loadingEmployees ? (
                                    <div className="d-flex align-items-center">
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        <span className="text-muted small">Chargement...</span>
                                    </div>
                                ) : (
                                    <Form.Select
                                        className="custom-input"
                                        value={selectedEmpId}
                                        onChange={handleEmployeeChange}
                                        required
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {`${emp.prenom || ""} ${emp.nom || ""}`.trim() || emp.nom_complet} - {emp.matricule}
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
                                    value={form.matricule}
                                    readOnly
                                    style={{ backgroundColor: '#f8fafc' }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className="small fw-bold">Date de la sanction *</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    type="date"
                                    name="dateSanction"
                                    value={form.dateSanction}
                                    onChange={handleChange}
                                    size="sm"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Référence dossier</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    type="text"
                                    name="referenceDossier"
                                    value={form.referenceDossier}
                                    onChange={handleChange}
                                    placeholder="Ex: DISC-2026-001"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Section 2: Type de sanction */}
                    <div className="section-title-custom mt-4">
                        <Activity size={16} /> Type de sanction
                    </div>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Type de sanction *</Form.Label>
                                <InputGroup>
                                    <Form.Select
                                        className="custom-input"
                                        name="sanction_type_id"
                                        value={form.sanction_type_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Sélectionner --</option>
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

                    {/* Section 3: Motif */}
                    <div className="section-title-custom mt-4">
                        <FileText size={16} /> Motif
                    </div>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Description détaillée du motif</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    as="textarea"
                                    rows={3}
                                    name="motifDescription"
                                    value={form.motifDescription}
                                    onChange={handleChange}
                                    placeholder="Décrivez le motif de la sanction..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Rappel des faits</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    as="textarea"
                                    rows={3}
                                    name="rappelFaits"
                                    value={form.rappelFaits}
                                    onChange={handleChange}
                                    placeholder="Rappel chronologique des faits..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Lien avec un conflit/incident</Form.Label>
                                <Form.Select
                                    className="custom-input"
                                    name="conflit_id"
                                    value={form.conflit_id}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Aucun lien --</option>
                                    {conflits.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.employe} - {c.date_incident} - {c.type?.nom || c.nature_conflit}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Section 4: Gravité */}
                    <div className="section-title-custom mt-4">
                        <AlertTriangle size={16} /> Gravité
                    </div>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Niveau de gravité</Form.Label>
                                <InputGroup>
                                    <Form.Select
                                        className="custom-input"
                                        name="sanction_gravite_id"
                                        value={form.sanction_gravite_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Sélectionner --</option>
                                        {gravites.map(g => (
                                            <option key={g.id} value={g.id}>{g.nom}</option>
                                        ))}
                                    </Form.Select>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setManageGraviteModal(true)}
                                        title="Gérer les gravités"
                                    >
                                        <Plus size={18} />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Section 5: Détails d'application */}
                    <div className="section-title-custom mt-4">
                        <Calendar size={16} /> Détails d'application
                    </div>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Durée (jours)</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    type="number"
                                    name="dureeJours"
                                    value={form.dureeJours}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Si mise à pied"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Impact sur salaire</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Oui, impact sur le salaire"
                                    name="impactSalaire"
                                    checked={form.impactSalaire}
                                    onChange={handleChange}
                                    className="mt-2"
                                />
                                {form.impactSalaire && (
                                    <Form.Group className="mt-2">
                                        <Form.Label className="small fw-bold">Montant à soustraire (DH)</Form.Label>
                                        <Form.Control
                                            className="custom-input"
                                            type="number"
                                            name="montantImpact"
                                            value={form.montantImpact}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            placeholder="Ex: 500.00"
                                            size="sm"
                                        />
                                    </Form.Group>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className="small fw-bold">Date d'effet</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    type="date"
                                    name="dateEffet"
                                    value={form.dateEffet}
                                    onChange={handleChange}
                                    size="sm"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-1">
                                <Form.Label className="small fw-bold">Date de fin</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    type="date"
                                    name="dateFin"
                                    value={form.dateFin}
                                    onChange={handleChange}
                                    size="sm"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Section 6: Documents */}
                    <div className="section-title-custom mt-4">
                        <Upload size={16} /> Documents
                    </div>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Pièces jointes</Form.Label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    multiple
                                    style={{ display: 'none' }}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-100"
                                    style={{ borderStyle: 'dashed' }}
                                >
                                    <Upload size={16} className="me-2" />
                                    Ajouter des documents
                                </Button>
                                <Form.Text className="text-muted">
                                    Lettre d'avertissement, décision signée, preuves, rapport RH...
                                </Form.Text>
                            </Form.Group>

                            {/* Existing files */}
                            {existingFiles.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-muted">Fichiers existants:</small>
                                    {existingFiles.map(file => (
                                        <div key={file.id} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mt-1">
                                            <span className="small">
                                                <File size={14} className="me-1" />
                                                {file.nom}
                                            </span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-danger p-0"
                                                onClick={() => removeExistingFile(file.id)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New files */}
                            {newFiles.length > 0 && (
                                <div className="mt-2">
                                    <small className="text-muted">Nouveaux fichiers:</small>
                                    {newFiles.map((file, index) => (
                                        <div key={index} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mt-1">
                                            <span className="small">
                                                <File size={14} className="me-1" />
                                                {file.name}
                                            </span>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="text-danger p-0"
                                                onClick={() => removeNewFile(index)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Col>
                    </Row>

                    {/* Section 7: Statut */}
                    <div className="section-title-custom mt-4">
                        <Activity size={16} /> Statut du dossier
                    </div>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Statut *</Form.Label>
                                <InputGroup>
                                    <Form.Select
                                        className="custom-input"
                                        name="sanction_statut_id"
                                        value={form.sanction_statut_id}
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
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="small fw-bold">Commentaires RH</Form.Label>
                                <Form.Control
                                    className="custom-input"
                                    as="textarea"
                                    rows={2}
                                    name="commentairesRh"
                                    value={form.commentairesRh}
                                    onChange={handleChange}
                                    placeholder="Notes internes RH..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </div>

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
                            {initialData ? "Modifier" : "Enregistrer"}
                        </>
                    )}
                </button>
            </div>

            {/* Resource Management Modals */}
            <ManageResourceModal
                show={manageTypeModal}
                onHide={() => setManageTypeModal(false)}
                title="Gérer les types de sanction"
                items={types}
                onAdd={handleAddType}
                onEdit={handleEditType}
                onDelete={handleDeleteType}
            />

            <ManageResourceModal
                show={manageGraviteModal}
                onHide={() => setManageGraviteModal(false)}
                title="Gérer les niveaux de gravité"
                items={gravites}
                onAdd={handleAddGravite}
                onEdit={handleEditGravite}
                onDelete={handleDeleteGravite}
            />

            <ManageResourceModal
                show={manageStatutModal}
                onHide={() => setManageStatutModal(false)}
                title="Gérer les statuts"
                items={statuts}
                onAdd={handleAddStatut}
                onEdit={handleEditStatut}
                onDelete={handleDeleteStatut}
            />
        </div>
    );
};

export default AddSanction;
