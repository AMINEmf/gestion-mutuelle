import React, { useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { trainings } from "./mockData";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const TrainingCatalog = ({ embedded = false, showHeader = true, onViewDetails }) => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [domainFilter, setDomainFilter] = useState("Tous");

  useEffect(() => {
    if (embedded) return;
    setTitle("Catalogue des formations");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions, embedded]);

  const domains = useMemo(
    () => ["Tous", ...new Set(trainings.map((item) => item.domaine))],
    []
  );

  const filteredTrainings = useMemo(() => {
    return trainings.filter((item) => {
      const matchesStatus = statusFilter === "Tous" || item.statut === statusFilter;
      const matchesDomain = domainFilter === "Tous" || item.domaine === domainFilter;
      const matchesSearch = !searchQuery.trim()
        || [item.titre, item.code, item.domaine, item.statut]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesDomain && matchesSearch;
    });
  }, [statusFilter, domainFilter, searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  } = useMockTable(filteredTrainings);

  const columns = useMemo(() => ([
    { key: "code", label: "Code" },
    { key: "titre", label: "Formation" },
    { key: "domaine", label: "Domaine" },
    { key: "duree", label: "Duree" },
    {
      key: "statut",
      label: "Statut",
      render: (item) => (
        <span className={`career-badge ${item.statut === "Termine" ? "success" : item.statut === "En cours" ? "info" : "warning"}`}>
          {item.statut}
        </span>
      )
    },
    { key: "date_debut", label: "Date debut" }
  ]), []);

  const handleDetails = (event, item) => {
    event.stopPropagation();
    if (onViewDetails) {
      onViewDetails(item);
      return;
    }
    return;
  };

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Catalogue des formations</h4>
          <p className="section-description">
            Acces rapide au catalogue et aux fiches de formation.
          </p>
        </div>
      )}

      <div className="career-section career-toolbar">
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <label className="text-muted">Domaine</label>
          <select
            className="form-select"
            style={{ width: "200px" }}
            value={domainFilter}
            onChange={(event) => setDomainFilter(event.target.value)}
          >
            {domains.map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
          <label className="text-muted">Statut</label>
          <select
            className="form-select"
            style={{ width: "180px" }}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {["Tous", "En attente", "En cours", "Termine"].map((statut) => (
              <option key={statut} value={statut}>{statut}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="career-section">
        <ExpandRTable
          columns={columns}
          data={filteredTrainings}
          searchTerm={searchQuery.toLowerCase()}
          selectAll={selectedItems.length === filteredTrainings.length && filteredTrainings.length > 0}
          selectedItems={selectedItems}
          handleSelectAllChange={handleSelectAllChange}
          handleCheckboxChange={handleCheckboxChange}
          handleDeleteSelected={handleDeleteSelected}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          renderCustomActions={(item) => (
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
              onClick={(event) => handleDetails(event, item)}
            >
              Voir details
            </button>
          )}
          canDelete={false}
          canBulkDelete={false}
        />
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

export default TrainingCatalog;
