import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { Pagination } from "@mui/material";

const ExpandRAffiliationTable = ({
  columns = [],
  data = [],
  // ⚠️ filteredData supprimé : c’est le parent qui filtre déjà (département + search + filtres)
  searchTerm,
  highlightText,
  selectedItems = [],
  handleSelectAllChange,
  handleCheckboxChange,
  handleEdit,
  handleDelete,
  handleDeleteSelected,
  rowsPerPage = 10,
  page = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  expandedRows,
  expandedChambre,
  toggleRowExpansion,
  renderExpandedRow,
  renderCustomActions,
  expansionType = "default",
  emptyMessage = "Aucune affiliation mutuelle trouvée",
  stickyActions = false,
}) => {
  const hasActions = !!handleEdit || !!handleDelete || !!renderCustomActions;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isRowExpanded = (itemId) => {
    switch (expansionType) {
      case "default":
        return expandedRows && expandedRows[itemId];
      case "chambre":
        return expandedChambre && expandedChambre[itemId];
      case "both":
        return (
          (expandedRows && expandedRows[itemId]) ||
          (expandedChambre && expandedChambre[itemId])
        );
      default:
        return expandedRows && expandedRows[itemId];
    }
  };

  // ✅ On ne filtre plus ici : le parent envoie déjà data filtrée
  const items = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / rowsPerPage);

  const handleMuiChangePage = (event, newPage) => {
    if (handleChangePage) handleChangePage(event, newPage);
    else if (typeof event === "number") handleChangePage(event);
  };

  const handleMuiChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    handleChangeRowsPerPage({ target: { value } });
  };

  const renderCell = (item, column) => {
    // Images
    if (
      column.key === "image" ||
      column.key === "img" ||
      column.key === "photo"
    ) {
      const imgSrc = item[column.key];
      if (!imgSrc) return null;

      return (
        <img
          src={imgSrc}
          alt={item.nom_employe || item.nom_mutuelle || "Image"}
          style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
        />
      );
    }

    // Si une colonne a un render custom (comme dans EmployeTable)
    if (column.render) return column.render(item, searchTerm, toggleRowExpansion);

    const cellContent = item[column.key] ?? "";

    // ✅ highlightText en JSX (PAS dangerouslySetInnerHTML)
    return highlightText ? (
      <span>{highlightText(cellContent, searchTerm)}</span>
    ) : (
      cellContent
    );
  };

  // Styles
  const tableStyles = {
    boxShadow: "none",
    borderCollapse: "collapse",
    minWidth: "1100px", // ✅ force scrollbar horizontal quand écran petit
  };

  const headerCellStyles = {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#4b5563",
    backgroundColor: "#f9fafc",
    whiteSpace: "nowrap",
    padding: "0.75rem 1rem",
    textTransform: "uppercase",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky", // ✅ header sticky
    top: 0,
    zIndex: 2,
  };

  const tableCellStyles = {
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
    whiteSpace: "nowrap",
  };

  const tableRowSx = {
    backgroundColor: "white",
    "&:hover": { backgroundColor: "#f9fafb" },
    cursor: toggleRowExpansion ? "pointer" : "default",
  };

  // Select all (sur items, pas sur filteredItems)
  const allChecked = selectedItems.length > 0 && selectedItems.length === items.length;
  const indeterminate =
    selectedItems.length > 0 && selectedItems.length < items.length;

  return (
    <div style={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
        {/* ✅ TableContainer scrollable X + Y */}
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 320px)", // ✅ table visible + scroller dessous
            overflow: "auto",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
          }}
        >
          <Table sx={tableStyles} aria-label="affiliations mutuelles table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyles} padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={indeterminate}
                    checked={allChecked}
                    onChange={handleSelectAllChange}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: selectedItems.length > 0 ? "#00afaa" : "inherit",
                    }}
                  />
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={headerCellStyles}
                    align={column.align || "left"}
                  >
                    {column.label}
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell
                    sx={{
                      ...headerCellStyles,
                      ...(stickyActions
                        ? {
                            position: "sticky",
                            right: 0,
                            zIndex: 3,
                            boxShadow: "-4px 0 12px rgba(0,0,0,0.06)",
                          }
                        : {}),
                    }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 2 : 1)}
                    sx={{
                      ...tableCellStyles,
                      textAlign: "center",
                      padding: "2rem",
                      whiteSpace: "normal",
                    }}
                  >
                    <div style={{ color: "#6b7280", fontSize: "1rem" }}>
                      {emptyMessage}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((item, index) => (
                  <React.Fragment key={item.id || index}>
                    <TableRow
                      sx={tableRowSx}
                      onClick={
                        toggleRowExpansion
                          ? () => toggleRowExpansion(item.id)
                          : undefined
                      }
                    >
                      <TableCell sx={tableCellStyles} padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: selectedItems.includes(item.id)
                              ? "#00afaa"
                              : "inherit",
                          }}
                        />
                      </TableCell>

                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          sx={tableCellStyles}
                          align={column.align || "left"}
                        >
                          {renderCell(item, column)}
                        </TableCell>
                      ))}

                      {hasActions && (
                        <TableCell
                          sx={{
                            ...tableCellStyles,
                            ...(stickyActions
                              ? {
                                  position: "sticky",
                                  right: 0,
                                  zIndex: 2,
                                  backgroundColor: "white",
                                  boxShadow: "-4px 0 12px rgba(0,0,0,0.04)",
                                }
                              : {}),
                          }}
                          align="center"
                          onClick={(e) => {
                            e.stopPropagation();
                            // e.nativeEvent.stopImmediatePropagation();
                          }}
                        >
                          {renderCustomActions ? (
                            renderCustomActions(item)
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                justifyContent: "center",
                              }}
                            >
                              {handleEdit && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item);
                                  }}
                                  startIcon={<FontAwesomeIcon icon={faEdit} />}
                                >
                                  Modifier
                                </Button>
                              )}
                              {handleDelete && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item);
                                  }}
                                  startIcon={<FontAwesomeIcon icon={faTrash} />}
                                >
                                  Supprimer
                                </Button>
                              )}
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Expanded row */}
                    {isRowExpanded(item.id) &&
                      renderExpandedRow &&
                      renderExpandedRow(item)}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer identique à ExpandRTable */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '10px' }}>
          <div className="pagination-container" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            margin: '20px 0'
          }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelected}
              disabled={!selectedItems || selectedItems.length === 0}
              startIcon={<FontAwesomeIcon icon={faTrash} />}
              sx={{
                backgroundColor: '#ef4444',
                '&:hover': {
                  backgroundColor: '#dc2626',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f1f5f9',
                  color: '#94a3b8'
                }
              }}
            >
              SUPPRIMER SELECTION
            </Button>
          </div>
          
          <div className="pagination-container" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            margin: '20px 0'
          }}>
            <div className="entries-per-page-container" style={{ display: 'flex', alignItems: 'center' }}>
              <select
                value={rowsPerPage}
                onChange={handleMuiChangeRowsPerPage}
                style={{
                  width: "60px",
                  padding: "5px 8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "#f8f8f8",
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23555\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 5px center",
                  paddingRight: "25px"
                }}
              >
                {[5, 10, 15, 20, 25].map((row) => (
                  <option value={row} key={row}>{row}</option>
                ))}
              </select>
              <span style={{ marginLeft: "8px", fontSize: "14px", color: "#666" }}>lignes par page</span>
            </div>

            <Pagination
              count={Math.ceil(items.length / rowsPerPage)}
              page={page + 1}
              onChange={(event, newPage) => handleMuiChangePage(event, newPage - 1)}
              color="primary"
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ExpandRAffiliationTable;
