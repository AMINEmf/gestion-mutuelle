import React, { useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { Form } from "react-bootstrap";
import { X } from "lucide-react";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { grades, positions as initialPositions } from "./mockData";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const emptyForm = {
  poste: "",
  departement: "",
  grade: "",
  statut: "Actif",
  niveau: "",
  competences: ""
};

const PositionsGrades = () => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const [positions, setPositions] = useState(initialPositions);
  const [selectedPosition, setSelectedPosition] = useState(initialPositions[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState(emptyForm);

  useEffect(() => {
    setTitle("Gestion des postes & grades");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  const filteredPositions = useMemo(() => {
    if (!searchQuery.trim()) return positions;
    const term = searchQuery.toLowerCase();
    return positions.filter((item) =>
      [item.poste, item.departement, item.grade, item.statut]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [positions, searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  } = useMockTable(filteredPositions, (ids) => {
    setPositions((prev) => prev.filter((item) => !ids.includes(item.id)));
  });

  const columns = useMemo(() => ([
    { key: "poste", label: "Poste" },
    { key: "departement", label: "Departement" },
    { key: "grade", label: "Grade" },
    {
      key: "statut",
      label: "Statut",
      render: (item) => (
        <span className={`career-badge ${item.statut === "Vacant" ? "warning" : "success"}`}>
          {item.statut}
        </span>
      )
    },
    { key: "niveau", label: "Niveau" }
  ]), []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormState(emptyForm);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setFormState({
      poste: item.poste,
      departement: item.departement,
      grade: item.grade,
      statut: item.statut,
      niveau: item.niveau,
      competences: item.competences.join(", ")
    });
    setSelectedPosition(item);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id) => {
    setPositions((prev) => prev.filter((item) => item.id !== id));
    if (selectedPosition && selectedPosition.id === id) {
      setSelectedPosition(null);
    }
  };

  const handleSave = () => {
    const payload = {
      ...formState,
      competences: formState.competences
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    if (isEditing && selectedPosition) {
      setPositions((prev) =>
        prev.map((item) => (item.id === selectedPosition.id ? { ...item, ...payload } : item))
      );
    } else {
      setPositions((prev) => [
        ...prev,
        { id: Date.now(), ...payload }
      ]);
    }

    setIsDrawerOpen(false);
    setFormState(emptyForm);
    setIsEditing(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setFormState(emptyForm);
    setIsEditing(false);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div
            className="with-split-view"
            style={{
              display: "flex",
              width: "100%",
              height: isDrawerOpen ? "calc(100vh - 120px)" : "auto",
              overflow: isDrawerOpen ? "hidden" : "visible"
            }}
          >
            <style>
              {`
                .with-split-view .side-panel-container {
                  position: relative !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                  box-shadow: none !important;
                  animation: none !important;
                  border-radius: 0 !important;
                }
              `}
            </style>

            <div
              style={{
                flex: isDrawerOpen ? "0 0 50%" : "1 1 100%",
                overflowY: isDrawerOpen ? "auto" : "visible",
                overflowX: "auto",
                borderRight: isDrawerOpen ? "2px solid #eef2f5" : "none",
                transition: "flex 0.3s ease-in-out",
                padding: "0 20px"
              }}
            >
              <div className="career-page">
                <div className="section-header">
                  <h4 className="section-title">Gestion des postes & grades</h4>
                  <p className="section-description">
                    Pilotez les postes, grades et competences requises.
                  </p>
                </div>

                <div className="career-section career-toolbar">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleOpenAdd}
                  >
                    Ajouter un poste
                  </button>
                  <span className="text-muted">
                    {positions.length} poste(s) suivis
                  </span>
                </div>

                <div className="career-grid career-grid-2">
                  <div className="career-section">
                    <ExpandRTable
                      columns={columns}
                      data={filteredPositions}
                      searchTerm={searchQuery.toLowerCase()}
                      selectAll={selectedItems.length === filteredPositions.length && filteredPositions.length > 0}
                      selectedItems={selectedItems}
                      handleSelectAllChange={handleSelectAllChange}
                      handleCheckboxChange={handleCheckboxChange}
                      handleDeleteSelected={handleDeleteSelected}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      renderCustomActions={(item) => (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedPosition(item);
                          }}
                        >
                          Voir competences
                        </button>
                      )}
                    />
                  </div>

                  <div className="career-section">
                    <div className="career-card">
                      <div className="career-card-header">
                        <h5 className="career-card-title">Gestion des grades</h5>
                      </div>
                      <div className="career-card-body">
                        <ul className="list-unstyled mb-0">
                          {grades.map((grade) => (
                            <li key={grade.id} style={{ marginBottom: "12px" }}>
                              <div style={{ fontWeight: 600 }}>{grade.label}</div>
                              <small className="text-muted">{grade.description}</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="career-card" style={{ marginTop: "16px" }}>
                      <div className="career-card-header">
                        <h5 className="career-card-title">Competences requises</h5>
                      </div>
                      <div className="career-card-body">
                        {selectedPosition ? (
                          <>
                            <div style={{ fontWeight: 600, marginBottom: "10px" }}>
                              {selectedPosition.poste}
                            </div>
                            <div className="career-tags">
                              {selectedPosition.competences.map((skill) => (
                                <span key={skill} className="career-tag">{skill}</span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <span className="text-muted">Selectionnez un poste pour voir les competences.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isDrawerOpen && (
              <div
                style={{
                  flex: "0 0 50%",
                  overflowY: "auto",
                  backgroundColor: "#fdfdfd",
                  boxShadow: "-4px 0 15px rgba(0,0,0,0.05)",
                  position: "relative"
                }}
              >
                <div className="side-panel-container" onClick={(event) => event.stopPropagation()}>
                  <div className="form-header">
                    <div>
                      <h3>{isEditing ? "Modifier un poste" : "Ajouter un poste"}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseDrawer}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="form-body">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Poste</Form.Label>
                        <Form.Control
                          value={formState.poste}
                          onChange={(event) => setFormState((prev) => ({ ...prev, poste: event.target.value }))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Departement</Form.Label>
                        <Form.Control
                          value={formState.departement}
                          onChange={(event) => setFormState((prev) => ({ ...prev, departement: event.target.value }))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Grade</Form.Label>
                        <Form.Control
                          value={formState.grade}
                          onChange={(event) => setFormState((prev) => ({ ...prev, grade: event.target.value }))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Statut</Form.Label>
                        <Form.Select
                          value={formState.statut}
                          onChange={(event) => setFormState((prev) => ({ ...prev, statut: event.target.value }))}
                        >
                          <option value="Actif">Actif</option>
                          <option value="Vacant">Vacant</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Niveau</Form.Label>
                        <Form.Control
                          value={formState.niveau}
                          onChange={(event) => setFormState((prev) => ({ ...prev, niveau: event.target.value }))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Competences requises</Form.Label>
                        <Form.Control
                          value={formState.competences}
                          onChange={(event) => setFormState((prev) => ({ ...prev, competences: event.target.value }))}
                          placeholder="Ex: React, Node.js, Architecture"
                        />
                      </Form.Group>
                    </Form>
                  </div>
                  <div className="form-footer">
                    <button className="btn btn-light" onClick={handleCloseDrawer}>
                      Annuler
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PositionsGrades;
