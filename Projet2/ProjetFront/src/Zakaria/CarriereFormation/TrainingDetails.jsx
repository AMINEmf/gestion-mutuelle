import React, { useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { trainings } from "./mockData";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const TrainingDetails = ({
  embedded = false,
  showHeader = true,
  training: trainingProp,
  section = "all"
}) => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const location = useLocation();
  const initialTraining = trainingProp || location.state?.training || trainings[0];
  const [training, setTraining] = useState(initialTraining);
  const [suggested, setSuggested] = useState(initialTraining.suggested || []);

  useEffect(() => {
    if (embedded) return;
    setTitle("Details formation");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions, embedded]);

  useEffect(() => {
    if (trainingProp) {
      setTraining(trainingProp);
      setSuggested(trainingProp.suggested || []);
      return;
    }
    if (location.state?.training) {
      setTraining(location.state.training);
      setSuggested(location.state.training.suggested || []);
    }
  }, [location.state, trainingProp]);

  const participants = training.participants || [];
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;
    const term = searchQuery.toLowerCase();
    return participants.filter((item) =>
      [item.employe, item.departement]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [participants, searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  } = useMockTable(filteredParticipants);

  const columns = useMemo(() => ([
    { key: "employe", label: "Employe" },
    { key: "departement", label: "Departement" },
    { key: "note", label: "Note" }
  ]), []);

  const statusBadgeClass = training.statut === "Termine"
    ? "career-badge success"
    : training.statut === "En cours"
      ? "career-badge info"
      : "career-badge warning";

  const handleEnroll = (candidate) => {
    setTraining((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        { id: Date.now(), employe: candidate.employe, departement: "A determiner", note: "-" }
      ]
    }));
    setSuggested((prev) => prev.filter((item) => item.id !== candidate.id));
  };

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
        <div className="career-card-header">
          <h5 className="career-card-title">Liste des participants</h5>
        </div>
        <div className="career-card-body">
          <ExpandRTable
            columns={columns}
            data={filteredParticipants}
            searchTerm={searchQuery.toLowerCase()}
            selectAll={selectedItems.length === filteredParticipants.length && filteredParticipants.length > 0}
            selectedItems={selectedItems}
            handleSelectAllChange={handleSelectAllChange}
            handleCheckboxChange={handleCheckboxChange}
            handleDeleteSelected={handleDeleteSelected}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            canDelete={false}
            canBulkDelete={false}
          />
        </div>
      </div>
    </div>
  );

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Details & gestion d'une formation</h4>
          <p className="section-description">
            Pilotage des participants, statut et recommandations AI.
          </p>
        </div>
      )}
      {(section === "all" || section === "info") && renderInfo()}
      {(section === "all" || section === "participants") && renderParticipants()}
    </div>
  );

  if (embedded) {
    return content;
  }

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
