import React, { useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider, createTheme, LinearProgress } from "@mui/material";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { competences, employeeSkillLevels } from "./mockData";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const SkillsManagement = ({ embedded = false, showHeader = true }) => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const [categoryFilter, setCategoryFilter] = useState("Tous");

  useEffect(() => {
    if (embedded) return;
    setTitle("Gestion des competences");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions, embedded]);

  const categories = useMemo(
    () => ["Tous", ...new Set(competences.map((item) => item.categorie))],
    []
  );

  const filteredSkills = useMemo(() => {
    return competences.filter((item) => {
      const matchesCategory = categoryFilter === "Tous" || item.categorie === categoryFilter;
      const matchesSearch = !searchQuery.trim()
        || [item.nom, item.categorie, item.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  } = useMockTable(filteredSkills);

  const columns = useMemo(() => ([
    { key: "nom", label: "Competence" },
    { key: "categorie", label: "Categorie" },
    { key: "description", label: "Description" },
    { key: "niveau", label: "Niveau requis" }
  ]), []);

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Gestion des competences</h4>
          <p className="section-description">
            Catalogue, categories et niveaux par employe.
          </p>
        </div>
      )}

      <div className="career-section career-toolbar">
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <label className="text-muted">Categorie</label>
          <select
            className="form-select"
            style={{ width: "220px" }}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="career-section">
        <ExpandRTable
          columns={columns}
          data={filteredSkills}
          searchTerm={searchQuery.toLowerCase()}
          selectAll={selectedItems.length === filteredSkills.length && filteredSkills.length > 0}
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

      <div className="career-section">
        <div className="career-card">
          <div className="career-card-header">
            <h5 className="career-card-title">Niveau par employe (visualisation)</h5>
          </div>
          <div className="career-card-body">
            <div className="competences-visualisation-scroll">
              {employeeSkillLevels.map((employee) => (
                <div key={employee.id} style={{ marginBottom: "16px" }}>
                  <strong>{employee.employe}</strong>
                  <div style={{ marginTop: "10px" }}>
                    {employee.competences.map((skill) => (
                      <div key={skill.nom} className="career-skill-row">
                        <span style={{ minWidth: "110px" }}>{skill.nom}</span>
                        <LinearProgress
                          variant="determinate"
                          value={(skill.niveau / 5) * 100}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 8,
                            backgroundColor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#2c767c"
                            }
                          }}
                        />
                        <span style={{ minWidth: 30, textAlign: "right" }}>{skill.niveau}/5</span>
                      </div>
                    ))}
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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

export default SkillsManagement;
