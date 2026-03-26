import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Download, Eye, Edit2, Trash2, Plus, FileText, CheckCircle, AlertCircle } from "lucide-react";
import AddMutuelleOperation from "./AddMutuelleOperation";
import {
  showSuccessMessage,
  showErrorMessage,
  showErrorFromResponse,
  showConfirmDialog,
  showInfoMessage,
  STANDARD_MESSAGES
} from "../../../utils/messageHelper";
import "../AffiliationMutuelle/AddAffiliationMutuelle.css";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const statutBadge = {
  EN_COURS: "warning",
  TERMINEE: "success",
  ANNULEE: "secondary",
  REMBOURSEE: "info"
};

function DossierMutuelleDetails({ numeroDossier, onClose, onUpdate, isSidebar = false }) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOperationForm, setShowOperationForm] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  const fetchDossier = async () => {
    setLoading(true);
    try {
      // Use encodeURIComponent to handle special characters like slashes (/) in dossier numbers
      const resp = await api.get(`/mutuelles/dossiers/${encodeURIComponent(numeroDossier)}`);
      setDossier(resp.data);
    } catch (e) {
      console.error("Erreur chargement dossier:", e);
      setDossier(null); // Ensure state is cleared on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (numeroDossier) fetchDossier();
  }, [numeroDossier]);

  const handleEditOperation = (op) => {
    console.log("Editing operation:", op);
    setEditingOperation(op);
    setShowOperationForm(true);
  };

  const handleDeleteOperation = async (op) => {
    console.log("Attempting delete for operation:", op);

    // Removal of status-based deletion restriction as requested by user
    if (!op.id) {
      showErrorMessage(
        "Erreur",
        "ID de l'opération manquant."
      );
      return;
    }

    const { isConfirmed } = await showConfirmDialog(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette opération ?",
      {
        confirmButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler"
      }
    );

    if (!isConfirmed) return;

    try {
      setLoading(true);
      await api.delete(`/mutuelles/operations/${op.id}`);

      showSuccessMessage(
        "Supprimé",
        "Opération supprimée avec succès.",
        { timer: 1500, showConfirmButton: false }
      );

      await fetchDossier();
      if (onUpdate) onUpdate();

      if (selectedOperation && selectedOperation.id === op.id) {
        setSelectedOperation(null);
      }
    } catch (e) {
      console.error("Erreur suppression opération:", e);
      showErrorMessage(
        "Erreur",
        e.response?.data?.message || "Erreur lors de la suppression."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce document ?")) return;

    try {
      await api.delete(`/mutuelles/documents/${docId}`);
      // Refresh global dossier
      await fetchDossier();
      if (onUpdate) onUpdate();

      // If we are viewing operation details in modal, we need to update that list too
      // fetchDossier updates 'dossier' state. We need to sync viewingOperationDocs with the new data.
      if (viewingOperationDocs) {
        setViewingOperationDocs(prev => {
          // Remove the deleted doc from the currently viewed operation docs
          const updatedDocs = prev.documents.filter(d => d.id !== docId);
          return { ...prev, documents: updatedDocs };
        });
      }
    } catch (e) {
      console.error("Erreur suppression document:", e);
      showErrorMessage("Erreur", "Erreur lors de la suppression du document.");
    }
  };

  const [viewingOperationDocs, setViewingOperationDocs] = useState(null);

  const operationRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={9} className="text-center">Chargement...</td>
        </tr>
      );
    }
    if (!dossier?.operations?.length) {
      return (
        <tr>
          <td colSpan={9} className="text-center text-muted">Aucune opération enregistrée.</td>
        </tr>
      );
    }

    return dossier.operations.map((op) => {
      // Normalize status
      const s = (op.statut || "").toUpperCase().trim();

      // Backend logic: 
      // Update blocked ONLY for ANNULEE
      // Destroy blocked ONLY for REMBOURSEE
      const canEdit = s !== "ANNULEE";
      const canDelete = true; // Always allow deletion as per user request

      // Fixed badge color normalization
      const badgeKey = s.replace(/\s+/g, '_').replace(/-/g, '_');
      const badgeClass = statutBadge[badgeKey] || "secondary";

      return (
        <tr key={op.id}>
          <td>{op.date_operation}</td>
          <td>{op.type_operation}</td>
          <td>
            <span className={`badge bg-${badgeClass} text-white`}>
              {op.statut}
            </span>
          </td>
          <td>{op.beneficiaire_type} {op.beneficiaire_nom ? `(${op.beneficiaire_nom})` : ""}</td>
          <td>{op.montant_total}</td>
          <td className="text-success">{op.montant_rembourse}</td>
          <td className="text-danger font-weight-bold">{op.reste_a_charge}</td>
          <td>
            {op.documents && op.documents.length > 0 ? (
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => setViewingOperationDocs(op)}
                title="Voir les documents"
              >
                {op.documents.length} doc{op.documents.length > 1 ? 's' : ''}
              </button>
            ) : (
              <span className="text-muted">—</span>
            )}
          </td>
          <td className="text-end" style={{ whiteSpace: "nowrap" }}>
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={() => setSelectedOperation(op)}
              title="Voir détails"
            >
              <Eye size={16} />
            </button>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => handleEditOperation(op)}
              disabled={!canEdit}
              title={canEdit ? "Modifier" : `Modification impossible (Statut: ${op.statut})`}
            >
              <Edit2 size={16} />
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleDeleteOperation(op)}
              disabled={!canDelete}
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      );
    });
  };

  if (!numeroDossier) return null;

  const content = (
    <div className={isSidebar ? "" : "add-affiliation-panel"} style={isSidebar ? { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' } : {}}>
      <div className="panel-container">
        <div className="panel-header" style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}>
          <h5 className="mb-0" style={{
            fontWeight: 700,
            color: '#4b5563',
            fontSize: '1.1rem',
            textAlign: 'center',
            width: '100%'
          }}>
            Dossier Mutuelle : {numeroDossier}
          </h5>
          <button
            className="btn btn-light btn-sm"
            onClick={onClose}
            style={{
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 16,
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="panel-body">
          {/* Dashboard-style Summary Cards */}
          <div className="row mb-4 px-1" style={{ display: "flex", gap: "12px" }}>
            {/* Montant Total */}
            <div className="col" style={{ flex: 1 }}>
              <div style={{
                background: "linear-gradient(135deg, #2c767c05 0%, #ffffff 100%)",
                border: "1px solid #2c767c20",
                borderTop: "4px solid #2c767c",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Montant Total
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>
                    {dossier?.header?.montants?.total || "0.00"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>DH</span>
                  </div>
                </div>
                <div style={{ backgroundColor: "#2c767c15", padding: "10px", borderRadius: "10px", color: "#1a3c5e" }}>
                  <FileText size={20} />
                </div>
              </div>
            </div>

            {/* Total Remboursé */}
            <div className="col" style={{ flex: 1 }}>
              <div style={{
                background: "linear-gradient(135deg, #4caf5005 0%, #ffffff 100%)",
                border: "1px solid #4caf5020",
                borderTop: "4px solid #4caf50",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Total Remboursé
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#4caf50" }}>
                    {dossier?.header?.montants?.rembourse || "0.00"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>DH</span>
                  </div>
                </div>
                <div style={{ backgroundColor: "#4caf5015", padding: "10px", borderRadius: "10px", color: "#4caf50" }}>
                  <CheckCircle size={20} />
                </div>
              </div>
            </div>

            {/* Reste à Charge */}
            <div className="col" style={{ flex: 1 }}>
              <div style={{
                background: "linear-gradient(135deg, #f4433605 0%, #ffffff 100%)",
                border: "1px solid #f4433620",
                borderTop: "4px solid #f44336",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Reste à Charge
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f44336" }}>
                    {dossier?.header?.montants?.reste || "0.00"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>DH</span>
                  </div>
                </div>
                <div style={{ backgroundColor: "#f4433615", padding: "10px", borderRadius: "10px", color: "#f44336" }}>
                  <AlertCircle size={20} />
                </div>
              </div>
            </div>
          </div>


          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
              background: "#fff",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em' }}>Opérations du Dossier</h6>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingOperation(null);
                  setShowOperationForm(true);
                }}
                style={{ backgroundColor: '#3a8a90', borderColor: '#3a8a90' }}
              >
                Ajouter une opération
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Bénéficiaire</th>
                    <th>Total</th>
                    <th>Remboursé</th>
                    <th>Reste</th>
                    <th>Docs</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>{operationRows()}</tbody>
              </table>
            </div>

            {selectedOperation && (
              <div
                className="mt-3"
                style={{
                  background: "#f8f9fa",
                  borderRadius: 8,
                  padding: 12,
                  border: "1px solid #e5e7eb",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Détails opération</strong>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSelectedOperation(null)}
                  >
                    Fermer
                  </button>
                </div>
                <div className="row small text-muted">
                  <div className="col-md-6">
                    <div>Date : {selectedOperation.date_operation}</div>
                    <div>Type : {selectedOperation.type_operation}</div>
                    <div>Statut : {selectedOperation.statut}</div>
                    <div>Bénéficiaire : {selectedOperation.beneficiaire_type} {selectedOperation.beneficiaire_nom}</div>
                  </div>
                  <div className="col-md-6">
                    <div>Montant Total : {selectedOperation.montant_total} DH</div>
                    <div>Remboursé : {selectedOperation.montant_rembourse} DH</div>
                    <div>Reste : {selectedOperation.reste_a_charge} DH</div>
                    <div>Commentaire : {selectedOperation.commentaire || "-"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="panel-footer" style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "center", backgroundColor: "#fff" }}>
          <button
            className="btn btn-primary"
            onClick={onClose}
            style={{ backgroundColor: "#1a3c5e", borderColor: "#1a3c5e", padding: '8px 24px', fontWeight: 600 }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isSidebar ? (
        showOperationForm ? (
          <AddMutuelleOperation
            employe={dossier?.header?.employe}
            affiliationIdProposed={dossier?.operations?.[0]?.affiliation_id}
            operation={editingOperation}
            onClose={() => {
              setShowOperationForm(false);
              setEditingOperation(null);
            }}
            onSaved={() => {
              fetchDossier();
              if (onUpdate) onUpdate();
              setShowOperationForm(false);
              setEditingOperation(null);
            }}
            isSidebar={true}
          />
        ) : content
      ) : (
        <div className="add-affiliation-overlay">
          {content}
        </div>
      )}

      {!isSidebar && showOperationForm && (
        <AddMutuelleOperation
          employe={dossier?.header?.employe}
          affiliationIdProposed={dossier?.operations?.[0]?.affiliation_id}
          operation={editingOperation}
          onClose={() => {
            setShowOperationForm(false);
            setEditingOperation(null);
          }}
          onSaved={() => {
            fetchDossier();
            if (onUpdate) onUpdate();
            setShowOperationForm(false);
            setEditingOperation(null);
          }}
        />
      )}

      {viewingOperationDocs && (
        <div className="modal-backdrop-custom" onClick={() => setViewingOperationDocs(null)}>
          <div
            className="modal-content-custom"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px", width: "90%", zIndex: 2100 }}
          >
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
              <h5 style={{ margin: 0, fontWeight: 600, color: "#14b8a6" }}>
                Documents de l'opération #{viewingOperationDocs.id}
              </h5>
              <button
                onClick={() => setViewingOperationDocs(null)}
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
            <div style={{ padding: "24px" }}>
              <div className="mb-3">
                <strong>Date:</strong> {viewingOperationDocs.date_operation} |
                <strong className="ms-2">Type:</strong> {viewingOperationDocs.type_operation}
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingOperationDocs.documents && viewingOperationDocs.documents.length > 0 ? (
                      viewingOperationDocs.documents.map((doc, idx) => (
                        <tr key={doc.id || idx}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Download size={14} className="me-2 text-primary" />
                              {doc.nom || doc.file_name}
                            </div>
                          </td>
                          <td>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '-'}</td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <a
                                href={`http://localhost:8000/storage/${doc.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-info"
                                title="Voir"
                              >
                                <Eye size={14} />
                              </a>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteDocument(doc.id)}
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-3">
                          Aucun document pour cette opération.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DossierMutuelleDetails;
