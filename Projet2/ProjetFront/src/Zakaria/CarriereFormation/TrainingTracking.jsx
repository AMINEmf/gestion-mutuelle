import React, { useEffect, useMemo } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { trainingTrackingRows } from "./mockData";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const TrainingTracking = ({ embedded = false, showHeader = true }) => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();

  useEffect(() => {
    if (embedded) return;
    setTitle("Suivi & Evaluation des formations");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions, embedded]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return trainingTrackingRows;
    const term = searchQuery.toLowerCase();
    return trainingTrackingRows.filter((row) =>
      [row.formation, row.employe, row.statut]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  } = useMockTable(filteredRows);

  const columns = useMemo(() => ([
    { key: "formation", label: "Formation" },
    { key: "employe", label: "Employe" },
    {
      key: "statut",
      label: "Statut",
      render: (item) => (
        <span className={`career-badge ${item.statut === "Termine" ? "success" : item.statut === "En cours" ? "info" : "warning"}`}>
          {item.statut}
        </span>
      )
    },
    { key: "note", label: "Note" },
    {
      key: "attestation",
      label: "Attestation",
      render: () => (
        <div className="career-upload">
          <input type="file" className="form-control form-control-sm" />
          <button type="button" className="btn btn-sm btn-light">Uploader</button>
        </div>
      )
    }
  ]), []);

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Suivi & Evaluation des formations</h4>
          <p className="section-description">
            Suivez les participations, notes et attestations.
          </p>
        </div>
      )}

      <div className="career-section">
        <ExpandRTable
          columns={columns}
          data={filteredRows}
          searchTerm={searchQuery.toLowerCase()}
          selectAll={selectedItems.length === filteredRows.length && filteredRows.length > 0}
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

export default TrainingTracking;
