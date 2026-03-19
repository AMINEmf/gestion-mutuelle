import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, ThemeProvider, createTheme, LinearProgress } from "@mui/material";
import { X } from "lucide-react";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import apiClient from "../../services/apiClient";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const CareerPaths = ({ embedded = false, showHeader = true }) => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (embedded) return;
    setTitle("Carrieres & Parcours des employes");
    return () => { clearActions(); };
  }, [setTitle, clearActions, embedded]);

  useEffect(() => {
    apiClient.get("/carrieres")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        // Garder la derniere entree par employe
        const latest = {};
        data.forEach((c) => {
          const id = c.employe_id;
          if (!id) return;
          if (!latest[id] || (c.date_debut_poste || "") > (latest[id].date_debut_poste || ""))
            latest[id] = c;
        });
        setEmployees(Object.values(latest));
      })
      .catch(() => setEmployees([]));
  }, []);

  const tableData = useMemo(() => employees.map((emp) => ({
    id: emp.employe_id ?? emp.id,
    matricule: emp.matricule,
    full_name: emp.full_name,
    departement: emp.departement_name ?? emp.departement,
    poste_actuel: emp.poste_actuel,
    grade: emp.grade,
    derniere_promotion: emp.derniere_promotion ?? emp.date_debut_poste
  })), [employees]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  } = useMockTable(tableData);

  const columns = useMemo(() => ([
    { key: "matricule", label: "Matricule" },
    { key: "full_name", label: "Employe" },
    { key: "departement", label: "Departement" },
    { key: "poste_actuel", label: "Poste actuel" },
    {
      key: "grade",
      label: "Grade",
      render: (item) => <span className="career-chip">{item.grade}</span>
    },
    { key: "derniere_promotion", label: "Derniere promotion" }
  ]), []);

  const renderCustomActions = useCallback((item) => (
    <button
      type="button"
      className="btn btn-sm"
      style={{
        backgroundColor: "#2c767c",
        color: "white",
        borderRadius: "8px",
        padding: "6px 12px",
        border: "none"
      }}
      onClick={(event) => {
        event.stopPropagation();
        apiClient.get(`/employes/${item.id}/parcours`)
          .then((res) => {
            const d = res.data;
            setSelectedEmployee({
              employe_id: d.employe_id,
              full_name: d.full_name,
              poste_actuel: d.parcours?.[0]?.poste ?? item.poste_actuel ?? "—",
              grade: d.parcours?.[0]?.grade ?? item.grade ?? "—",
              departement: item.departement ?? "—",
              promotions: (d.parcours || []).map((p) => ({
                date: p.date_debut,
                poste: p.poste,
                grade: p.grade,
              })),
              competences: (d.competences || []).map((c) => ({
                nom: c.nom,
                niveau: c.niveau ?? c.niveau_acquis ?? 0,
              })),
              formations: [],
            });
          })
          .catch(() => {
            // fallback: afficher les donnees de la table
            setSelectedEmployee({
              ...item,
              departement: item.departement ?? "—",
              promotions: [],
              competences: [],
              formations: [],
            });
          });
      }}
    >
      Voir parcours
    </button>
  ), []);

  const closeDrawer = () => setSelectedEmployee(null);
  const isDrawerOpen = Boolean(selectedEmployee);

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Carriere & Parcours des employes</h4>
          <p className="section-description">
            Visualisez les evolutions, promotions et formations par employe.
          </p>
        </div>
      )}

      <div className="career-section">
        <ExpandRTable
          columns={columns}
          data={tableData}
          searchTerm={searchQuery.toLowerCase()}
          selectAll={selectedItems.length === tableData.length && tableData.length > 0}
          selectedItems={selectedItems}
          handleSelectAllChange={handleSelectAllChange}
          handleCheckboxChange={handleCheckboxChange}
          handleDeleteSelected={handleDeleteSelected}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          renderCustomActions={renderCustomActions}
          canDelete={false}
          canBulkDelete={false}
        />
      </div>
    </div>
  );

  const layout = (
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
        {content}
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
                <h3>{selectedEmployee.full_name}</h3>
                <span className="career-chip">{selectedEmployee.poste_actuel}</span>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
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
              <div className="career-card" style={{ marginBottom: "16px" }}>
                <div className="career-card-header">
                  <h5 className="career-card-title">Poste actuel</h5>
                </div>
                <div className="career-card-body">
                  <div className="career-grid career-grid-2">
                    <div>
                      <small>Departement</small>
                      <div><strong>{selectedEmployee.departement}</strong></div>
                    </div>
                    <div>
                      <small>Grade</small>
                      <div><strong>{selectedEmployee.grade}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="career-card" style={{ marginBottom: "16px" }}>
                <div className="career-card-header">
                  <h5 className="career-card-title">Historique des promotions</h5>
                </div>
                <div className="career-card-body">
                  <ul className="list-unstyled mb-0">
                    {selectedEmployee.promotions.map((promotion) => (
                      <li key={`${promotion.date}-${promotion.poste}`} style={{ marginBottom: "10px" }}>
                        <div style={{ fontWeight: 600 }}>{promotion.poste}</div>
                        <small>{promotion.date} - {promotion.grade}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="career-card" style={{ marginBottom: "16px" }}>
                <div className="career-card-header">
                  <h5 className="career-card-title">Competences et niveaux</h5>
                </div>
                <div className="career-card-body">
                  {selectedEmployee.competences.map((skill) => (
                    <div key={skill.nom} className="career-skill-row">
                      <span>{skill.nom}</span>
                      <div style={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(skill.niveau / 5) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 8,
                            backgroundColor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#2c767c"
                            }
                          }}
                        />
                      </div>
                      <span style={{ minWidth: 32, textAlign: "right" }}>{skill.niveau}/5</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="career-card">
                <div className="career-card-header">
                  <h5 className="career-card-title">Formations suivies</h5>
                </div>
                <div className="career-card-body">
                  <div className="career-tags">
                    {selectedEmployee.formations.map((formation) => (
                      <span key={`${formation.titre}-${formation.annee}`} className="career-tag">
                        {formation.titre} ({formation.annee})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return layout;
  }

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          {layout}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CareerPaths;
