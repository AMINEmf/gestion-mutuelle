import React, { useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { useMockTable } from "./useMockTable";
import "../Style.css";
import "./CareerTraining.css";

const TrainingTracking = ({ embedded = false, showHeader = true, training }) => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();

  const [rows, setRows] = useState(() => {
    if (training) {
      return (training.participants || []).map((p, i) => ({
        id: 500 + i,
        formation: training.titre,
        employe: p.employe,
        note: p.note ?? "-",
        commentaire: p.commentaire ?? "",
      }));
    }
    return [];
  });

  useEffect(() => {
    if (embedded) return;
    setTitle("Suivi & Evaluation des formations");
    return () => clearActions();
  }, [setTitle, clearActions, embedded]);

  useEffect(() => {
    if (training) {
      setRows(
        (training.participants || []).map((p, i) => ({
          id: 500 + i,
          formation: training.titre,
          employe: p.employe,
          note: p.note ?? "-",
          commentaire: p.commentaire ?? "",
        }))
      );
    }
  }, [training]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const term = searchQuery.toLowerCase();
    return rows.filter((row) =>
      [row.formation, row.employe, row.note, row.commentaire]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [rows, searchQuery]);

  const {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useMockTable(filteredRows);

  const columns = useMemo(
    () => [
      { key: "formation", label: "Formation" },
      { key: "employe", label: "Employe" },
      { key: "note", label: "Note" },
      {
        key: "commentaire",
        label: "Commentaire",
        render: (item) => <span>{item.commentaire || "—"}</span>,
      },
    ],
    []
  );

  const content = (
    <div className={embedded ? "" : "career-page"}>
      {showHeader && (
        <div className="section-header">
          <h4 className="section-title">Suivi & Evaluation des formations</h4>
          <p className="section-description">
            Le statut et les attestations sont maintenant geres dans l'onglet Participants.
          </p>
        </div>
      )}

      <div className="career-section">
        <div className="career-card" style={{ marginBottom: "12px" }}>
          <div className="career-card-body">
            <span className="text-muted">
              Cette vue reste disponible pour le suivi global des notes et commentaires.
            </span>
          </div>
        </div>
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
          expandedRows={[]}
          toggleRowExpansion={() => {}}
          renderExpandedRow={() => null}
          canDelete={false}
          canBulkDelete={false}
        />
      </div>
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

export default TrainingTracking;


