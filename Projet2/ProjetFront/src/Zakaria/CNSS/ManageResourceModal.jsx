import React, { useMemo, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Pencil, Trash2, Save, X } from "lucide-react";

const TEAL = "#2c767c";

function ManageResourceModal({
  show,
  onHide,
  title,
  items,
  onAdd,
  onEdit,
  onDelete,
  placeholder = "Nouveau...",
}) {
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (!show) {
      setValue("");
      setEditingId(null);
      setEditingValue("");
    }
  }, [show]);

  const sortedItems = useMemo(() => {
    return [...(Array.isArray(items) ? items : [])].sort((a, b) =>
      String(a?.name || "").localeCompare(String(b?.name || ""), "fr", { sensitivity: "base" })
    );
  }, [items]);

  const handleAdd = async () => {
    const cleaned = value.trim();
    if (!cleaned) return;
    await onAdd(cleaned);
    setValue("");
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditingValue(item.name || "");
  };

  const handleSaveEdit = async () => {
    const cleaned = editingValue.trim();
    if (!cleaned) return;
    await onEdit(editingId, cleaned);
    setEditingId(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleKeyDown = (event, handler) => {
    if (event.key === "Enter") handler();
  };

  return (
    <>
      <style>{`
        .mrm-modal .modal-header {
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 20px;
        }
        .mrm-modal .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #111827;
        }
        .mrm-modal .modal-body {
          padding: 16px 20px 8px;
        }
        .mrm-modal .modal-footer {
          border-top: 1px solid #e5e7eb;
          padding: 12px 20px;
        }
        .mrm-add-input {
          background: #f1f5f9 !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px 0 0 8px !important;
          font-size: 14px !important;
          color: #374151 !important;
          padding: 10px 14px !important;
        }
        .mrm-add-input:focus {
          box-shadow: none !important;
          border-color: #2c767c !important;
          background: #fff !important;
        }
        .mrm-add-btn {
          background: ${TEAL} !important;
          border-color: ${TEAL} !important;
          border-radius: 0 8px 8px 0 !important;
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
        .mrm-add-btn:hover { background: #34848b !important; border-color: #34848b !important; }
        .mrm-add-btn:disabled { opacity: 0.5 !important; }
        .mrm-list-container {
          max-height: 320px;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-top: 14px;
        }
        .mrm-list-container::-webkit-scrollbar { width: 6px; }
        .mrm-list-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .mrm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .mrm-table thead tr {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }
        .mrm-table thead th {
          padding: 10px 14px;
          font-weight: 700;
          color: #374151;
          font-size: 13px;
        }
        .mrm-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
        }
        .mrm-table tbody tr:last-child { border-bottom: none; }
        .mrm-table tbody tr.editing-row { background: #f8fafc; }
        .mrm-table td {
          padding: 9px 14px;
          vertical-align: middle;
          color: #1f2937;
        }
        .mrm-edit-input {
          font-size: 14px !important;
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          padding: 5px 10px !important;
          width: 100% !important;
        }
        .mrm-edit-input:focus {
          box-shadow: none !important;
          border-color: ${TEAL} !important;
        }
        .mrm-actions { display: flex; gap: 6px; align-items: center; }
        .mrm-btn-icon {
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
        .mrm-btn-edit  { border-color: #93c5fd; color: #2563eb; }
        .mrm-btn-edit:hover  { background: #eff6ff; }
        .mrm-btn-delete { border-color: #fca5a5; color: #dc2626; }
        .mrm-btn-delete:hover { background: #fff5f5; }
        .mrm-btn-save   { border-color: #6ee7b7; color: #059669; }
        .mrm-btn-save:hover   { background: #f0fdf4; }
        .mrm-btn-cancel { border-color: #d1d5db; color: #6b7280; }
        .mrm-btn-cancel:hover { background: #f9fafb; }
        .mrm-close-btn {
          background: ${TEAL} !important;
          border-color: ${TEAL} !important;
          color: #fff !important;
          padding: 8px 22px !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .mrm-close-btn:hover { background: #34848b !important; border-color: #34848b !important; }
      `}</style>

      <Modal show={show} onHide={onHide} centered dialogClassName="mrm-modal">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group">
            <Form.Control
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAdd)}
              placeholder={placeholder}
              className="mrm-add-input"
            />
            <button
              type="button"
              className="mrm-add-btn"
              onClick={handleAdd}
              disabled={!value.trim()}
              aria-label="Ajouter"
            >
              +
            </button>
          </div>

          <div className="mrm-list-container">
            <table className="mrm-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th style={{ width: "100px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", color: "#9ca3af", padding: "16px" }}>
                      Aucune donnée
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((item) => (
                    <tr key={item.id} className={editingId === item.id ? "editing-row" : ""}>
                      <td>
                        {editingId === item.id ? (
                          <Form.Control
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleSaveEdit)}
                            className="mrm-edit-input"
                            autoFocus
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td>
                        <div className="mrm-actions">
                          {editingId === item.id ? (
                            <>
                              <button type="button" className="mrm-btn-icon mrm-btn-save" onClick={handleSaveEdit} title="Enregistrer">
                                <Save size={13} />
                              </button>
                              <button type="button" className="mrm-btn-icon mrm-btn-cancel" onClick={handleCancelEdit} title="Annuler">
                                <X size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="mrm-btn-icon mrm-btn-edit" onClick={() => handleStartEdit(item)} title="Modifier">
                                <Pencil size={13} />
                              </button>
                              <button type="button" className="mrm-btn-icon mrm-btn-delete" onClick={() => onDelete(item.id)} title="Supprimer">
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
          <button type="button" className="btn mrm-close-btn" onClick={onHide}>
            Fermer
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManageResourceModal;
