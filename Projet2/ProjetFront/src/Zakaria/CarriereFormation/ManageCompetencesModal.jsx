import React, { useMemo, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Pencil, Trash2, Save, X } from "lucide-react";

const TEAL = "#2c767c";

function ManageCompetencesModal({
  show,
  onHide,
  items,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    nom: "",
    categorie: "",
    description: ""
  });

  useEffect(() => {
    if (!show) {
      setFormData({ nom: "", categorie: "", description: "" });
      setEditingId(null);
      setEditingData({ nom: "", categorie: "", description: "" });
    }
  }, [show]);

  const sortedItems = useMemo(() => {
    return [...(Array.isArray(items) ? items : [])].sort((a, b) =>
      String(a?.nom || a?.name || "").localeCompare(String(b?.nom || b?.name || ""), "fr", { sensitivity: "base" })
    );
  }, [items]);

  const handleAdd = async () => {
    const nom = formData.nom.trim();
    if (!nom) return;
    await onAdd(formData);
    setFormData({ nom: "", categorie: "", description: "" });
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditingData({
      nom: item.nom || item.name || "",
      categorie: item.categorie || "",
      description: item.description || ""
    });
  };

  const handleSaveEdit = async () => {
    const nom = editingData.nom.trim();
    if (!nom) return;
    await onEdit(editingId, editingData);
    setEditingId(null);
    setEditingData({ nom: "", categorie: "", description: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({ nom: "", categorie: "", description: "" });
  };

  const handleKeyDown = (event, handler) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handler();
    }
  };

  return (
    <>
      <style>{`
        .mcm-modal .modal-header {
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 20px;
        }
        .mcm-modal .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
        }
        .mcm-modal .modal-body {
          padding: 16px 20px 8px;
        }
        .mcm-modal .modal-footer {
          border-top: 1px solid #e5e7eb;
          padding: 12px 20px;
        }
        .mcm-modal .modal-dialog {
          max-width: 900px;
        }
        .mcm-form-grid {
          display: grid;
          grid-template-columns: 2fr 1.5fr 3fr auto;
          gap: 8px;
          margin-bottom: 16px;
        }
        .mcm-input {
          background: #f1f5f9 !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important;
          font-size: 14px !important;
          color: #374151 !important;
          padding: 10px 14px !important;
        }
        .mcm-input:focus {
          box-shadow: none !important;
          border-color: #2c767c !important;
          background: #fff !important;
        }
        .mcm-add-btn {
          background: ${TEAL} !important;
          border-color: ${TEAL} !important;
          border-radius: 6px !important;
          color: #fff !important;
          font-size: 20px !important;
          font-weight: 400 !important;
          line-height: 1 !important;
          min-width: 44px !important;
          padding: 0 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .mcm-add-btn:hover { background: #34848b !important; border-color: #34848b !important; }
        .mcm-add-btn:disabled { opacity: 0.5 !important; }
        .mcm-list-container {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }
        .mcm-list-container::-webkit-scrollbar { width: 6px; }
        .mcm-list-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .mcm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .mcm-table thead tr {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        .mcm-table thead th {
          padding: 10px 14px;
          font-weight: 700;
          color: #374151;
          font-size: 13px;
          background: #f9fafb;
        }
        .mcm-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
        }
        .mcm-table tbody tr:last-child { border-bottom: none; }
        .mcm-table tbody tr.editing-row { background: #f8fafc; }
        .mcm-table td {
          padding: 9px 14px;
          vertical-align: middle;
          color: #1f2937;
        }
        .mcm-edit-input {
          font-size: 13px !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          padding: 5px 10px !important;
          width: 100% !important;
        }
        .mcm-edit-input:focus {
          box-shadow: none !important;
          border-color: ${TEAL} !important;
        }
        .mcm-actions { display: flex; gap: 6px; align-items: center; }
        .mcm-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid;
          cursor: pointer;
          background: transparent;
          transition: background 0.15s;
          padding: 0;
        }
        .mcm-btn-edit  { border-color: #93c5fd; color: #2563eb; }
        .mcm-btn-edit:hover  { background: #eff6ff; }
        .mcm-btn-delete { border-color: #fca5a5; color: #dc2626; }
        .mcm-btn-delete:hover { background: #fff5f5; }
        .mcm-btn-save   { border-color: #6ee7b7; color: #059669; }
        .mcm-btn-save:hover   { background: #f0fdf4; }
        .mcm-btn-cancel { border-color: #d1d5db; color: #6b7280; }
        .mcm-btn-cancel:hover { background: #f9fafb; }
        .mcm-close-btn {
          background: ${TEAL} !important;
          border-color: ${TEAL} !important;
          color: #fff !important;
          padding: 8px 22px !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .mcm-close-btn:hover { background: #34848b !important; border-color: #34848b !important; }
        .mcm-form-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 4px;
          display: block;
        }
      `}</style>

      <Modal show={show} onHide={onHide} centered dialogClassName="mcm-modal">
        <Modal.Header closeButton>
          <Modal.Title>Gérer les compétences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mcm-form-grid">
            <div>
              <label className="mcm-form-label">Nom *</label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                placeholder="Ex: Python"
                className="mcm-input"
              />
            </div>
            <div>
              <label className="mcm-form-label">Catégorie</label>
              <Form.Control
                type="text"
                value={formData.categorie}
                onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                placeholder="Ex: Technique"
                className="mcm-input"
              />
            </div>
            <div>
              <label className="mcm-form-label">Description</label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, handleAdd)}
                placeholder="Ex: Langage de programmation"
                className="mcm-input"
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="button"
                className="mcm-add-btn"
                onClick={handleAdd}
                disabled={!formData.nom.trim()}
                aria-label="Ajouter"
              >
                +
              </button>
            </div>
          </div>

          <div className="mcm-list-container">
            <table className="mcm-table">
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>Nom</th>
                  <th style={{ width: "20%" }}>Catégorie</th>
                  <th style={{ width: "40%" }}>Description</th>
                  <th style={{ width: "100px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "16px" }}>
                      Aucune compétence
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((item) => (
                    <tr key={item.id} className={editingId === item.id ? "editing-row" : ""}>
                      <td>
                        {editingId === item.id ? (
                          <Form.Control
                            type="text"
                            value={editingData.nom}
                            onChange={(e) => setEditingData(prev => ({ ...prev, nom: e.target.value }))}
                            onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                            className="mcm-edit-input"
                            autoFocus
                          />
                        ) : (
                          item.nom || item.name
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <Form.Control
                            type="text"
                            value={editingData.categorie}
                            onChange={(e) => setEditingData(prev => ({ ...prev, categorie: e.target.value }))}
                            onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                            className="mcm-edit-input"
                          />
                        ) : (
                          item.categorie || "-"
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <Form.Control
                            type="text"
                            value={editingData.description}
                            onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
                            onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                            className="mcm-edit-input"
                          />
                        ) : (
                          <div style={{ fontSize: "13px", color: "#6b7280" }}>
                            {item.description || "-"}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="mcm-actions">
                          {editingId === item.id ? (
                            <>
                              <button type="button" className="mcm-btn-icon mcm-btn-save" onClick={handleSaveEdit} title="Enregistrer">
                                <Save size={13} />
                              </button>
                              <button type="button" className="mcm-btn-icon mcm-btn-cancel" onClick={handleCancelEdit} title="Annuler">
                                <X size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="mcm-btn-icon mcm-btn-edit" onClick={() => handleStartEdit(item)} title="Modifier">
                                <Pencil size={13} />
                              </button>
                              <button type="button" className="mcm-btn-icon mcm-btn-delete" onClick={() => onDelete(item.id)} title="Supprimer">
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn mcm-close-btn" onClick={onHide}>
            Fermer
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManageCompetencesModal;
