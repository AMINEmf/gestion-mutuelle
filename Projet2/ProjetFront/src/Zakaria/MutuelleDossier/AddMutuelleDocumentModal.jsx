import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { X, Upload, FileText } from "lucide-react";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import "../AffiliationMutuelle/AddAffiliationMutuelle.css";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
});

function AddMutuelleDocumentModal({ operations, onClose, onSaved }) {
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [nom, setNom] = useState("");
    const [fichier, setFichier] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Build operation options for select
    const operationOptions = operations.map((op) => ({
        value: op.id,
        label: `${op.date_operation} — ${op.type_operation} — ${op.statut} (ID: ${op.id})`,
        operation: op
    }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors({ fichier: 'Format invalide. Accepté: PDF, JPG, PNG' });
                setFichier(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ fichier: 'Fichier trop volumineux. Max: 5 MB' });
                setFichier(null);
                return;
            }
            setErrors({});
            setFichier(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!selectedOperation) {
            setErrors({ operation: "Veuillez sélectionner une opération" });
            return;
        }
        if (!fichier) {
            setErrors({ fichier: "Veuillez sélectionner un fichier" });
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('operation_id', selectedOperation.value);
            formData.append('fichier', fichier);
            if (nom.trim()) {
                formData.append('nom', nom.trim());
            }

            await api.post('/mutuelles/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: "success",
                title: "Document ajouté",
                text: "Le document a été téléchargé avec succès",
                timer: 2000,
                showConfirmButton: false,
            });

            onSaved();
        } catch (err) {
            console.error("Erreur upload document:", err);
            const apiErrors = err.response?.data?.errors || {};
            setErrors(apiErrors);

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: err.response?.data?.message || "Impossible de télécharger le document",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop-custom" onClick={onClose}>
            <div
                className="modal-content-custom"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "650px", width: "90%" }}
            >
                {/* Header */}
                <div
                    className="sticky-header"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 24px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <FileText size={20} style={{ color: "#14b8a6" }} />
                        <h5 style={{ margin: 0, fontWeight: 600, color: "#14b8a6", fontSize: "1.1rem" }}>
                            Ajouter un document
                        </h5>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            padding: "4px",
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "24px", overflowY: "auto", maxHeight: "70vh" }}>
                    <Form onSubmit={handleSubmit}>
                        {/* Operation Selection */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Opération concernée <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                                options={operationOptions}
                                value={selectedOperation}
                                onChange={setSelectedOperation}
                                placeholder="Sélectionner une opération..."
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: errors.operation
                                            ? "#dc3545"
                                            : state.isFocused
                                                ? "#14b8a6"
                                                : "#ced4da",
                                        boxShadow: state.isFocused
                                            ? "0 0 0 0.2rem rgba(20, 184, 166, 0.25)"
                                            : "none",
                                    }),
                                }}
                            />
                            {errors.operation && (
                                <Form.Text className="text-danger">{errors.operation}</Form.Text>
                            )}
                        </Form.Group>

                        {/* Document Name (optional) */}
                        <Form.Group className="mb-3">
                            <Form.Label>Nom du document (optionnel)</Form.Label>
                            <Form.Control
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Ex: Facture hopital"
                                maxLength={255}
                            />
                        </Form.Group>

                        {/* File Upload */}
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Fichier <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                isInvalid={!!errors.fichier}
                            />
                            <Form.Text className="text-muted">
                                Formats acceptés: PDF, JPG, PNG (Max: 5 MB)
                            </Form.Text>
                            {errors.fichier && (
                                <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                                    {Array.isArray(errors.fichier) ? errors.fichier[0] : errors.fichier}
                                </Form.Control.Feedback>
                            )}
                            {fichier && (
                                <div className="mt-2 p-2 bg-light rounded">
                                    <small className="text-success">
                                        <FileText size={14} className="me-1" />
                                        {fichier.name} ({(fichier.size / 1024).toFixed(2)} KB)
                                    </small>
                                </div>
                            )}
                        </Form.Group>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-outline-secondary"
                                disabled={submitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                                style={{ backgroundColor: "#14b8a6", borderColor: "#14b8a6" }}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Téléchargement...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} className="me-2" />
                                        Télécharger
                                    </>
                                )}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddMutuelleDocumentModal;
