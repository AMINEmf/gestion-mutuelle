import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, ThemeProvider, createTheme, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FaPlusCircle } from "react-icons/fa";
import { Table } from "react-bootstrap";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import Swal from "sweetalert2";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import apiClient from "../../services/apiClient";
import { StatusBadge } from "./TrainingParticipantCells";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const TrainingDetails = ({
  embedded = false,
  showHeader = true,
  training: trainingProp,
  section = "all",
  onTrainingUpdated,
}) => {
  // Statut is now computed from formation dates (En attente, En cours, Terminé)
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const location = useLocation();
  const initialTraining = trainingProp || location.state?.training || null;
  const [training, setTraining] = useState(initialTraining);
  const [suggested, setSuggested] = useState(initialTraining?.suggested || []);

  // Participant modal state
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [expandedParticipantId, setExpandedParticipantId] = useState(null);
  const [participantDocs, setParticipantDocs] = useState([]);
  const [participantForm, setParticipantForm] = useState({
    employe: "",
    departement: "",
    note: "-",
    commentaire: "",
    attestation: "",
  });

  useEffect(() => {
    if (embedded) return;
    setTitle("Details formation");
    return () => clearActions();
  }, [setTitle, clearActions, embedded]);

  useEffect(() => {
    if (trainingProp) {
      setTraining(trainingProp);
      setSuggested(trainingProp.suggested || []);
    } else if (location.state?.training) {
      setTraining(location.state.training);
      setSuggested(location.state.training.suggested || []);
    } else {
      // Aucune formation passée en prop — charger la première depuis l'API
      apiClient.get("/formations")
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          if (list.length > 0) {
            setTraining(list[0]);
            setSuggested(list[0].suggested || []);
          }
        })
        .catch(() => {});
    }
  }, [location.state, trainingProp]);

  const participants = training?.participants || [];

  const normalizeKey = (value) => (value == null ? "" : String(value).toLowerCase().trim());

  const trackingRows = useMemo(() => {
    const raw =
      training?.suivi ||
      training?.suivi_evaluation ||
      training?.tracking ||
      training?.evaluation ||
      [];
    return Array.isArray(raw) ? raw : [];
  }, [training]);

  const trackingByKey = useMemo(() => {
    const map = new Map();
    trackingRows.forEach((row) => {
      const keyCandidates = [
        row.participant_id,
        row.employe_id,
        row.employe,
        row.participant,
        row.id,
      ];
      keyCandidates.forEach((key) => {
        const normalized = normalizeKey(key);
        if (normalized && !map.has(normalized)) {
          map.set(normalized, row);
        }
      });
    });
    return map;
  }, [trackingRows]);

  // Compute participant status based on formation dates
  const computeFormationStatus = useCallback(() => {
    if (!training) return "En attente";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateDebut = training.dateDebut || training.date_debut;
    const dateFin = training.dateFin || training.date_fin;
    
    if (!dateDebut) return "En attente";
    
    const start = new Date(dateDebut);
    start.setHours(0, 0, 0, 0);
    
    if (today < start) return "En attente";
    
    if (dateFin) {
      const end = new Date(dateFin);
      end.setHours(0, 0, 0, 0);
      if (today > end) return "Terminé";
    }
    
    return "En cours";
  }, [training]);

  const participantsWithTracking = useMemo(() => {
    const computedStatus = computeFormationStatus();
    return participants.map((participant) => {
      const keyCandidates = [
        participant.id,
        participant.employe_id,
        participant.employe,
        participant.participant,
      ];
      let tracking = null;
      for (const key of keyCandidates) {
        const normalized = normalizeKey(key);
        if (normalized && trackingByKey.has(normalized)) {
          tracking = trackingByKey.get(normalized);
          break;
        }
      }
      return {
        ...participant,
        statut:
          participant.statut ??
          tracking?.statut ??
          tracking?.status ??
          computedStatus,
        attestation: participant.attestation ?? tracking?.attestation ?? "",
        documents: participant.documents ?? tracking?.documents ?? [],
        attestations: participant.attestations ?? tracking?.attestations ?? tracking?.documents ?? [],
        attestation_documents:
          participant.attestation_documents ?? tracking?.attestation_documents ?? tracking?.documents ?? [],
      };
    });
  }, [participants, trackingByKey, computeFormationStatus]);

  const getParticipantDocs = useCallback((participant) => {
    const docs =
      participant?.attestations ||
      participant?.attestation_documents ||
      participant?.documents ||
      [];
    return Array.isArray(docs) ? docs : [];
  }, []);

  const getParticipantDocCount = useCallback(
    (participant) => {
      const docs = getParticipantDocs(participant);
      if (docs.length > 0) return docs.length;
      const countValue =
        participant?.docs_count ??
        participant?.documents_count ??
        participant?.attestations_count ??
        0;
      const parsed = Number(countValue);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    },
    [getParticipantDocs]
  );

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participantsWithTracking;
    const term = searchQuery.toLowerCase();
    return participantsWithTracking.filter((item) =>
      [item.employe, item.departement, item.commentaire, item.statut]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [participantsWithTracking, searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected: handleDeleteSelectedParticipants,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useMockTable(filteredParticipants);

  const expandedParticipantsMap = useMemo(
    () => (expandedParticipantId ? { [expandedParticipantId]: true } : {}),
    [expandedParticipantId]
  );

  const toggleParticipantRow = useCallback((participantId) => {
    setExpandedParticipantId((prev) => (prev === participantId ? null : participantId));
  }, []);

  const resolveDocUrl = useCallback((doc) => {
    if (!doc) return "";
    return (
      doc.url ||
      doc.file_url ||
      doc.path ||
      doc.file ||
      doc.link ||
      ""
    );
  }, []);

  const handleViewAttestation = useCallback((doc) => {
    const url = resolveDocUrl(doc);
    if (!url) {
      Swal.fire("Info", "Aucun lien disponible pour cet élément.", "info");
      return;
    }
    window.open(url, "_blank");
  }, [resolveDocUrl]);

  const handleDownloadAttestation = useCallback((doc) => {
    const url = resolveDocUrl(doc);
    if (!url) {
      Swal.fire("Info", "Téléchargement indisponible.", "info");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", doc?.original_name || doc?.name || "attestation");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [resolveDocUrl]);

  const getDocKey = useCallback((doc, index) => {
    return doc?.id ?? doc?.original_name ?? doc?.name ?? doc?.filename ?? index;
  }, []);

  const handleParticipantUpload = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const now = Date.now();
    const createdAt = new Date().toISOString().slice(0, 10);
    const newDocs = files.map((file, index) => ({
      id: `${now}-${index}`,
      original_name: file.name,
      created_at: createdAt,
      file,
    }));
    setParticipantDocs((prev) => [...prev, ...newDocs]);
    event.target.value = "";
  }, []);

  const removeDocFromForm = useCallback(
    (doc) => {
      const keyToRemove = getDocKey(doc, 0);
      setParticipantDocs((prev) =>
        prev.filter((item, index) => getDocKey(item, index) !== keyToRemove)
      );
    },
    [getDocKey]
  );

  // Direct attestation upload for a participant (without opening form)
  const handleDirectAttestationUpload = useCallback((event, participantId) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const now = Date.now();
    const createdAt = new Date().toISOString().slice(0, 10);
    const newDocs = files.map((file, index) => ({
      id: `${now}-${index}`,
      original_name: file.name,
      created_at: createdAt,
      file,
    }));
    
    const updatedParticipants = (training.participants || []).map((p) => {
      if (p.id !== participantId) return p;
      const existingDocs = getParticipantDocs(p);
      const allDocs = [...existingDocs, ...newDocs];
      return {
        ...p,
        documents: allDocs,
        attestations: allDocs,
        attestation_documents: allDocs,
      };
    });
    
    const updated = { ...training, participants: updatedParticipants };
    setTraining(updated);
    if (onTrainingUpdated) onTrainingUpdated(updated);
    event.target.value = "";
  }, [training, getParticipantDocs, onTrainingUpdated]);

  const handleDeleteAttestation = useCallback((doc, participantId) => {
    const keyToRemove = getDocKey(doc, 0);
    const updatedParticipants = (training.participants || []).map((p) => {
      if (p.id !== participantId) return p;
      const docs = getParticipantDocs(p);
      const filteredDocs = docs.filter((d, idx) => getDocKey(d, idx) !== keyToRemove);
      return {
        ...p,
        documents: filteredDocs,
        attestations: filteredDocs,
        attestation_documents: filteredDocs,
      };
    });
    const updated = { ...training, participants: updatedParticipants };
    setTraining(updated);
    if (onTrainingUpdated) onTrainingUpdated(updated);
  }, [getDocKey, getParticipantDocs, onTrainingUpdated, training]);

  const renderDocumentsTable = useCallback(
    (docs, onDelete, title) => (
      <Box
        sx={{
          p: "0.75rem",
          backgroundColor: "#f8fafc",
          borderRadius: "0.5rem",
          m: "0.5rem",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: "0.5rem",
            fontWeight: 800,
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#1e293b",
          }}
        >
          <FileText size={14} /> {title}
        </Typography>
        <Box
          sx={{
            overflowX: "auto",
            width: "100%",
            borderRadius: "0.5rem",
            border: "0.0625rem solid #e2e8f0",
          }}
        >
          <Table size="sm" style={{ backgroundColor: "white", margin: 0, minWidth: "300px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={{ fontSize: "0.7rem", border: "none", padding: "0.5rem" }}>Fichier</th>
                <th style={{ fontSize: "0.7rem", border: "none", padding: "0.5rem" }}>Date</th>
                <th style={{ fontSize: "0.7rem", border: "none", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length > 0 ? (
                docs.map((doc, index) => (
                  <tr key={getDocKey(doc, index)}>
                    <td style={{ fontSize: "0.7rem", padding: "0.5rem" }}>
                      {doc.original_name || doc.name || doc.filename || "Document"}
                    </td>
                    <td style={{ fontSize: "0.7rem", padding: "0.5rem" }}>
                      {doc.created_at || doc.date || "-"}
                    </td>
                    <td style={{ padding: "0.3rem" }}>
                      <Box sx={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                        <button
                          onClick={() => handleViewAttestation(doc)}
                          aria-label="Voir"
                          title="Voir"
                          style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                        >
                          <FontAwesomeIcon icon={faEye} style={{ color: "#007bff", fontSize: "14px" }} />
                        </button>
                        <button
                          onClick={() => handleDownloadAttestation(doc)}
                          aria-label="Télécharger"
                          title="Télécharger"
                          style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                        >
                          <FontAwesomeIcon icon={faDownload} style={{ color: "#17a2b8", fontSize: "14px" }} />
                        </button>
                        <button
                          onClick={() => onDelete(doc)}
                          aria-label="Supprimer"
                          title="Supprimer"
                          style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                        >
                          <FontAwesomeIcon icon={faTrash} style={{ color: "#ff0000", fontSize: "14px" }} />
                        </button>
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-2 text-muted"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Aucune attestation.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Box>
      </Box>
    ),
    [getDocKey, handleDownloadAttestation, handleViewAttestation]
  );

  const participantColumns = useMemo(
    () => [
      { key: "employe", label: "Employe" },
      { key: "departement", label: "Departement" },
      {
        key: "statut",
        label: "Statut",
        render: (item) => <StatusBadge status={item.statut} />,
      },
      { key: "note", label: "Note" },
      {
        key: "commentaire",
        label: "Commentaire",
        render: (item) => <span>{item.commentaire || "—"}</span>,
      },
      {
        key: "attestation",
        label: "Attestation",
        render: (item) => {
          const count = getParticipantDocCount(item);
          const isTermine = item.statut === "Terminé" || item.statut === "Termine";
          
          if (!isTermine) {
            return (
              <span style={{ color: "#9ca3af", fontSize: "0.75rem", fontStyle: "italic" }}>
                Non disponible
              </span>
            );
          }
          
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {count > 0 ? (
                <span style={{ 
                  backgroundColor: "#d1fae5",
                  color: "#047857",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}>
                  ✓ Délivrée ({count})
                </span>
              ) : (
                <span style={{ 
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}>
                  ⚠ À uploader
                </span>
              )}
              
              {/* Upload button - always visible when Terminé */}
              <label 
                htmlFor={`upload-attestation-${item.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  backgroundColor: "#047857",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                }}
              >
                📎 {count > 0 ? "+" : "Uploader"}
              </label>
              <input
                id={`upload-attestation-${item.id}`}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  e.stopPropagation();
                  handleDirectAttestationUpload(e, item.id);
                }}
              />
            </div>
          );
        },
      },
      {
        key: "documents",
        label: "Documents",
        render: (item) => {
          const count = getParticipantDocCount(item);
          return (
            <Box
              onClick={(event) => {
                event.stopPropagation();
                toggleParticipantRow(item.id);
              }}
              sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#2c767c" }}
            >
              <FileText size={14} />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                {count} Doc(s)
              </Typography>
              {expandedParticipantId === item.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </Box>
          );
        },
      },
    ],
    [expandedParticipantId, getParticipantDocCount, toggleParticipantRow, openEditParticipant, handleDirectAttestationUpload]
  );

  const statusBadgeClass =
    training.statut === "Termine"
      ? "career-badge success"
      : training.statut === "En cours"
      ? "career-badge info"
      : "career-badge warning";

  const renderParticipantExpandedRow = useCallback(
    (participant) => {
      const docs = getParticipantDocs(participant);
      const isTermine = participant.statut === "Terminé" || participant.statut === "Termine";
      const hasAttestation = docs.length > 0;
      
      return (
        <div style={{ padding: "12px", backgroundColor: "#f8fafc" }}>
          {/* Attestation Status Banner */}
          <div style={{ 
            marginBottom: "12px", 
            padding: "10px 14px", 
            borderRadius: "6px",
            backgroundColor: hasAttestation ? "#d1fae5" : (isTermine ? "#fef3c7" : "#f3f4f6"),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {hasAttestation ? (
                <>
                  <span style={{ color: "#047857", fontWeight: 600 }}>✓ Attestation délivrée</span>
                  <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>({docs.length} document(s))</span>
                </>
              ) : isTermine ? (
                <span style={{ color: "#92400e", fontWeight: 500 }}>⚠ Attestation en attente d'upload</span>
              ) : (
                <span style={{ color: "#6b7280", fontStyle: "italic" }}>⏳ Attestation disponible après la fin de la formation</span>
              )}
            </div>
            
            {/* Upload Button - visible when formation is Terminé */}
            {isTermine && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label 
                  htmlFor={`attestation-upload-${participant.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    backgroundColor: "#047857",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  📎 {hasAttestation ? "Ajouter" : "Uploader attestation"}
                </label>
                <input
                  id={`attestation-upload-${participant.id}`}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => handleDirectAttestationUpload(e, participant.id)}
                />
              </div>
            )}
          </div>
          
          {/* Documents Table */}
          {docs.length > 0 ? (
            renderDocumentsTable(
              docs,
              (doc) => handleDeleteAttestation(doc, participant.id),
              "ATTESTATIONS / DOCUMENTS"
            )
          ) : (
            <div style={{ color: "#9ca3af", textAlign: "center", padding: "16px" }}>
              Aucun document attaché
            </div>
          )}
        </div>
      );
    },
    [getParticipantDocs, handleDeleteAttestation, renderDocumentsTable, handleDirectAttestationUpload]
  );

  const handleEnroll = (candidate) => {
    const updated = {
      ...training,
      participants: [
        ...training.participants,
        {
          id: Date.now(),
          employe: candidate.employe,
          departement: "A determiner",
          note: "-",
          commentaire: "",
          attestation: "",
          documents: [],
        },
      ],
    };
    setTraining(updated);
    setSuggested((prev) => prev.filter((item) => item.id !== candidate.id));
    if (onTrainingUpdated) onTrainingUpdated(updated);
  };

  const openAddParticipant = () => {
    setEditingParticipant(null);
    setParticipantDocs([]);
    setParticipantForm({
      employe: "",
      departement: "",
      note: "-",
      commentaire: "",
      attestation: "",
    });
    setShowParticipantForm(true);
  };

  const openEditParticipant = (p) => {
    setEditingParticipant(p);
    setParticipantDocs(getParticipantDocs(p));
    setParticipantForm({
      employe: p.employe,
      departement: p.departement,
      note: p.note ?? "-",
      commentaire: p.commentaire ?? "",
      attestation: p.attestation ?? "",
    });
    setShowParticipantForm(true);
  };

  const handleSaveParticipant = () => {
    if (!participantForm.employe.trim()) {
      Swal.fire("Erreur", "Le nom de l'employé est requis.", "error");
      return;
    }
    let updatedParticipants;
    if (editingParticipant) {
      updatedParticipants = training.participants.map((p) =>
        p.id === editingParticipant.id
          ? {
            ...p,
            ...participantForm,
            documents: participantDocs,
            attestations: participantDocs,
            attestation_documents: participantDocs,
          }
          : p
      );
    } else {
      updatedParticipants = [
        ...training.participants,
        {
          id: Date.now(),
          ...participantForm,
          attestation: participantForm.attestation || "",
          documents: participantDocs,
          attestations: participantDocs,
          attestation_documents: participantDocs,
        },
      ];
    }
    const updated = { ...training, participants: updatedParticipants };
    setTraining(updated);
    setShowParticipantForm(false);
    if (onTrainingUpdated) onTrainingUpdated(updated);
  };

  const handleDeleteParticipant = useCallback(
    async (p) => {
      const result = await Swal.fire({
        title: "Supprimer ce participant ?",
        text: `${p.employe} sera retiré de la formation.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
      });
      if (!result.isConfirmed) return;
      const updated = {
        ...training,
        participants: training.participants.filter((x) => x.id !== p.id),
      };
      setTraining(updated);
      if (onTrainingUpdated) onTrainingUpdated(updated);
    },
    [training, onTrainingUpdated]
  );

  const renderInfo = () => (
    <div className="career-section career-grid career-grid-2">
      <div className="career-card">
        <div className="career-card-header">
          <h5 className="career-card-title">Informations generales</h5>
          <span className={statusBadgeClass}>{training.statut}</span>
        </div>
        <div className="career-card-body">
          <div className="career-grid career-grid-2">
            <div>
              <small>Formation</small>
              <div><strong>{training.titre}</strong></div>
            </div>
            <div>
              <small>Domaine</small>
              <div><strong>{training.domaine}</strong></div>
            </div>
            <div>
              <small>Type de formation</small>
              <div><strong>{training.type || training.type_formation || "—"}</strong></div>
            </div>
            <div>
              <small>Duree</small>
              <div><strong>{training.duree}</strong></div>
            </div>
            <div>
              <small>Date debut</small>
              <div><strong>{training.date_debut}</strong></div>
            </div>
            <div>
              <small>Budget</small>
              <div><strong>{training.budget} MAD</strong></div>
            </div>
            <div>
              <small>Code</small>
              <div><strong>{training.code}</strong></div>
            </div>
            {training.date_fin && (
              <div>
                <small>Date fin</small>
                <div><strong>{training.date_fin}</strong></div>
              </div>
            )}
            {training.organisme && (
              <div>
                <small>Organisme</small>
                <div><strong>{training.organisme}</strong></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="career-card">
        <div className="career-card-header">
          <h5 className="career-card-title">Section AI - Employes suggeres</h5>
        </div>
        <div className="career-card-body">
          {suggested.length === 0 && (
            <span className="text-muted">Aucune suggestion pour le moment.</span>
          )}
          {suggested.map((candidate) => (
            <div key={candidate.id} className="career-skill-row" style={{ marginBottom: "12px" }}>
              <div>
                <strong>{candidate.employe}</strong>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>{candidate.raison}</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => handleEnroll(candidate)}
              >
                Inscrire
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderParticipants = () => (
    <div className="career-section">
      <div className="career-card">
        <div className="career-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 className="career-card-title">Liste des participants</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
            style={{ gap: "6px" }}
            onClick={openAddParticipant}
          >
            <FaPlusCircle size={14} />
            Ajouter un participant
          </button>
        </div>

        {showParticipantForm && (
          <div
            style={{
              padding: "16px",
              margin: "0 16px 8px",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h6 style={{ marginBottom: "12px", color: "#2c767c" }}>
              {editingParticipant ? "Modifier le participant" : "Nouveau participant"}
            </h6>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Employé *</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={participantForm.employe}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, employe: e.target.value }))}
                  placeholder="Nom de l'employé"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Département</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={participantForm.departement}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, departement: e.target.value }))}
                  placeholder="Département"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Note</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={participantForm.note}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder="-"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Commentaire</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={participantForm.commentaire}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, commentaire: e.target.value }))}
                  placeholder="Commentaire (optionnel)"
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>Attestation</label>
                {(() => {
                  const computedStatus = computeFormationStatus();
                  const isTermine = computedStatus === "Terminé" || computedStatus === "Termine";
                  
                  if (!isTermine) {
                    return (
                      <div style={{ 
                        padding: "8px 12px", 
                        backgroundColor: "#f3f4f6", 
                        borderRadius: "6px",
                        color: "#6b7280",
                        fontSize: "0.85rem",
                        fontStyle: "italic"
                      }}>
                        <span>⏳ Disponible après la fin de la formation</span>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="career-upload" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        style={{ maxWidth: "180px" }}
                        multiple
                        onChange={handleParticipantUpload}
                      />
                      <button type="button" className="btn btn-sm btn-success">
                        Uploader attestation
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
            {participantDocs.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                {renderDocumentsTable(
                  participantDocs,
                  removeDocFromForm,
                  editingParticipant ? "DOCUMENTS EXISTANTS" : "DOCUMENTS AJOUTES"
                )}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setShowParticipantForm(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleSaveParticipant}
              >
                {editingParticipant ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        )}

        <div className="career-card-body">
          <ExpandRTable
            columns={participantColumns}
            data={filteredParticipants}
            searchTerm={searchQuery.toLowerCase()}
            selectAll={selectedItems.length === filteredParticipants.length && filteredParticipants.length > 0}
            selectedItems={selectedItems}
            handleSelectAllChange={handleSelectAllChange}
            handleCheckboxChange={handleCheckboxChange}
            handleEdit={openEditParticipant}
            handleDelete={handleDeleteParticipant}
            handleDeleteSelected={handleDeleteSelectedParticipants}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            expandedRows={expandedParticipantsMap}
            toggleRowExpansion={toggleParticipantRow}
            renderExpandedRow={renderParticipantExpandedRow}
            renderCustomActions={(p) => {
              const isTermine = p.statut === "Terminé" || p.statut === "Termine";
              const hasAttestation = getParticipantDocCount(p) > 0;
              const attestationStatus = hasAttestation 
                ? '<span style="color: #047857; font-weight: 600;">✓ Délivrée</span>'
                : isTermine 
                  ? '<span style="color: #92400e;">⚠ À uploader</span>'
                  : '<span style="color: #6b7280; font-style: italic;">Non disponible</span>';
              
              return (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    Swal.fire({
                      title: p.employe,
                      html: `
                        <div style="text-align:left">
                          <p><strong>Département:</strong> ${p.departement || "-"}</p>
                          <p><strong>Note:</strong> ${p.note ?? "-"}</p>
                          <p><strong>Statut:</strong> ${p.statut || "-"}</p>
                          <p><strong>Attestation:</strong> ${attestationStatus}</p>
                          <p><strong>Commentaire:</strong> ${p.commentaire || "—"}</p>
                        </div>
                      `,
                      icon: "info",
                    });
                  }}
                  aria-label="Voir détails"
                  title="Voir détails"
                  style={{ border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: "#007bff", fontSize: "14px" }} />
                </button>
              );
            }}
          />
        </div>
      </div>
    </div>
  );

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Details & gestion d une formation</h4>
          <p className="section-description">Pilotage des participants, statut et recommandations AI.</p>
        </div>
      )}
      {(section === "all" || section === "info") && renderInfo()}
      {(section === "all" || section === "participants") && renderParticipants()}
    </div>
  );

  if (embedded) return content;

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          {content}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TrainingDetails;
