import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faClose, faSliders } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ExpandRAffiliationTable from "../AffiliationMutuelle/ExpandRAffiliationTable";
import DossierMutuelleDetails from "./DossierMutuelleDetails";
import AddMutuelleOperation from "./AddMutuelleOperation";
import { FaPlusCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import "../AffiliationMutuelle/AffiliationMutuelleManager.css";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

function DossierMutuelleTable({
  departementId,
  departementName,
  includeSubDepartments,
  globalSearch,
  filtersVisible,
  handleFiltersToggle,
}) {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDossierNumero, setSelectedDossierNumero] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddOperation, setShowAddOperation] = useState(false);

  // Logic to show side panel if either add operation or a dossier is selected
  const showSidePanel = showAddOperation || !!selectedDossierNumero;
  const [filterNom, setFilterNom] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterNumeroAdherent, setFilterNumeroAdherent] = useState("");
  const [filterNumeroDossier, setFilterNumeroDossier] = useState("");
  const containerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setSelectedIds([]);
    setSelectedDossierNumero(null);
  }, [departementId]);

  const fetchDossiers = async () => {
    // 1. Si aucun département n'est sélectionné, on ne charge rien (table vide)
    if (!departementId) {
      setDossiers([]);
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const params = {
        departement_id: departementId ? Number(departementId) : null,
        include_sub: includeSubDepartments ? 1 : 0,
      };

      // Add individual filter params
      if (filterNom) params.nom = filterNom;
      if (filterStatut) params.statut = filterStatut;
      if (filterNumeroAdherent) params.numero_adherent = filterNumeroAdherent;
      if (filterNumeroDossier) params.numero_dossier = filterNumeroDossier;

      console.log("Fetching dossiers with params:", params);

      const response = await api.get("/mutuelles/dossiers", { params });
      const data = response.data?.data ?? response.data;
      setDossiers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError("Session expirée ou accès refusé. Veuillez rafraîchir la page.");
      } else {
        setError(`Impossible de charger les dossiers (${err?.response?.status || 'Erreur réseau'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced filter effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Si pas de dépt, on vide la liste
      if (!departementId) {
        setDossiers([]);
        return;
      }
      setCurrentPage(0); // Reset to page 1 when filters change
      fetchDossiers();
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filterNom, filterStatut, filterNumeroAdherent, filterNumeroDossier, departementId, includeSubDepartments, globalSearch]);

  const [showDropdown, setShowDropdown] = useState(false);

  // --------------------------
  // COLUMNS VISIBILITY
  // --------------------------
  const getInitialColumnVisibility = () => {
    const storedVisibility = localStorage.getItem("dossiersMutuelleColumnVisibility");
    return storedVisibility
      ? JSON.parse(storedVisibility)
      : {
        numero_dossier: true,
        numero_adherent: true,
        statut_dossier: true,
        employe_full_name: true,
        commentaire_dossier: true,
        nb_operations: true,
        derniere_operation: true,
      };
  };

  const [columnVisibility, setColumnVisibility] = useState(getInitialColumnVisibility());

  const allColumns = useMemo(
    () => [
      { key: "numero_dossier", label: "N° Dossier" },
      { key: "numero_adherent", label: "N° Adhérent" },
      {
        key: "statut_dossier", label: "Statut", render: (row) => (
          <span className={`badge bg-${row.statut_dossier === 'TERMINEE' ? 'success' : row.statut_dossier === 'ANNULEE' ? 'danger' : 'warning'} text-white`}>
            {row.statut_dossier}
          </span>
        )
      },
      { key: "employe_full_name", label: "Nom" },
      {
        key: "commentaire_dossier",
        label: "Commentaire",
        render: (row) => (
          <div className="small" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.commentaire_dossier || ''}>
            {row.commentaire_dossier || '-'}
          </div>
        )
      },
      { key: "nb_operations", label: "Ops" },
      {
        key: "derniere_operation", label: "Dernière Opération", render: (row) => (
          <div className="small">
            <div>{row.derniere_operation_type || '-'}</div>
            <div className="text-muted">
              {row.derniere_operation_date ? new Date(row.derniere_operation_date).toISOString().split('T')[0] : '-'}
            </div>
          </div>
        )
      },
      // Actions column is usually handled separately by ExpandRAffiliationTable as prop or if it was part of columns array, but here it seems the logic relies on `renderCustomActions` prop of ExpandRAffiliationTable, so we don't need to obscure it via visibility check
    ],
    []
  );

  const visibleColumns = useMemo(() => {
    return allColumns.filter((col) => columnVisibility[col.key]);
  }, [allColumns, columnVisibility]);

  const handleColumnsChange = useCallback((columnKey) => {
    setColumnVisibility((prev) => {
      const next = { ...prev, [columnKey]: !prev[columnKey] };
      localStorage.setItem("dossiersMutuelleColumnVisibility", JSON.stringify(next));
      return next;
    });
  }, []);

  const CustomMenu = React.forwardRef(
    ({ className, "aria-labelledby": labeledBy }, menuRef) => {
      return (
        <div
          ref={menuRef}
          style={{
            padding: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 9999
          }}
          className={className}
          aria-labelledby={labeledBy}
          onClick={(e) => e.stopPropagation()}
        >
          <Form>
            {allColumns.map((column) => (
              <Form.Check
                key={column.key}
                type="checkbox"
                id={`checkbox-${column.key}`}
                label={column.label}
                checked={!!columnVisibility[column.key]}
                onChange={() => handleColumnsChange(column.key)}
              />
            ))}
          </Form>
        </div>
      );
    }
  );

  const iconButtonStyle = {
    backgroundColor: "#f9fafb",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "13px 16px",
    margin: "0 0px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
  };



  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleSelectAllChange = () => {
    if (selectedIds.length === dossiers.length) setSelectedIds([]);
    else setSelectedIds(dossiers.map((e) => e.numero_dossier)); // Use numero_dossier as ID for table selection
  };

  return (
    <div
      ref={containerRef}
      className="container_employee"
      style={{
        position: "relative",
        top: 0,
        height: "calc(100vh - 120px)",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", transition: "all 0.3s", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div style={{
          flex: showSidePanel ? "0 0 50%" : "1 1 100%",
          overflow: "auto",
          height: "100%",
          transition: "flex 0.3s ease-in-out"
        }}>
          <div className="mt-4">
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: "16px" }}>
                <div>
                  <span className="h5 mb-1" style={{ color: "#3a8a90", fontWeight: "bold" }}>
                    <i className="fas fa-folder-open me-2"></i>
                    Dossiers Mutuelle
                  </span>
                  <p className="text-muted small mb-0">
                    {dossiers.length} dossier(s) affiché(s)
                  </p>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  {departementId && (
                    <FontAwesomeIcon
                      onClick={() => handleFiltersToggle && handleFiltersToggle(!filtersVisible)}
                      icon={filtersVisible ? faClose : faFilter}
                      style={{
                        cursor: "pointer",
                        fontSize: "1.9rem",
                        color: "#2c767c",
                        marginTop: "1.3%",
                        marginRight: "8px",
                      }}
                      title={filtersVisible ? "Fermer filtres" : "Ouvrir filtres"}
                    />
                  )}

                  <Button
                    onClick={() => {
                      if (departementId) {
                        setShowAddOperation(true);
                        setSelectedDossierNumero(null);
                      }
                    }}
                    disabled={!departementId}
                    size="sm"
                    style={{
                      backgroundColor: "#3a8a90",
                      borderColor: "#3a8a90",
                      opacity: !departementId ? 0.6 : 1,
                      cursor: !departementId ? 'not-allowed' : 'pointer'
                    }}
                    title={!departementId ? "Sélectionnez un sous-département pour ajouter une opération." : ""}
                  >
                    <FaPlusCircle className="me-2" />
                    Ajouter une opération
                  </Button>

                  <Dropdown
                    show={showDropdown}
                    onToggle={(isOpen) => setShowDropdown(isOpen)}
                  >
                    <Dropdown.Toggle
                      as="button"
                      id="dropdown-visibility"
                      title="Visibilité Colonnes"
                      style={iconButtonStyle}
                    >
                      <FontAwesomeIcon
                        icon={faSliders}
                        style={{ width: 18, height: 18, color: "#4b5563" }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomMenu} />
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {filtersVisible && departementId && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="filters-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  padding: "16px 20px",
                  minHeight: 0,
                }}
              >
                <div
                  className="filters-icon-section"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                    marginLeft: "-8px",
                    marginRight: "14%",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4a90a4"
                    strokeWidth="2"
                    className="filters-icon"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <span className="filters-title">Filtres</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >

                  {/* Statut */}
                  <div style={{ display: "flex", alignItems: "center", margin: 0, marginRight: "46px" }}>
                    <label className="filter-label" style={{ fontSize: "0.9rem", margin: 0, marginRight: "-44px", whiteSpace: "nowrap", minWidth: "auto", fontWeight: 600, color: "#2c3e50" }}>
                      Statut
                    </label>
                    <select
                      value={filterStatut}
                      onChange={(e) => setFilterStatut(e.target.value)}
                      className="filter-input"
                      style={{ minWidth: 100, maxWidth: 120, height: 30, fontSize: "0.9rem", padding: "2px 6px", borderRadius: 6 }}
                    >
                      <option value="">Tous</option>
                      <option value="EN_COURS">En cours</option>
                      <option value="TERMINEE">Validée</option>
                      <option value="ANNULEE">Refusée</option>
                      <option value="REMBOURSEE">Remboursée</option>
                    </select>
                  </div>

                  {/* N° Adhérent */}
                  <div style={{ display: "flex", alignItems: "center", margin: 0, marginRight: "46px" }}>
                    <label className="filter-label" style={{ fontSize: "0.9rem", margin: 0, marginRight: "-44px", whiteSpace: "nowrap", minWidth: "auto", fontWeight: 600, color: "#2c3e50" }}>
                      N° Adhérent
                    </label>
                    <input
                      type="text"
                      value={filterNumeroAdherent}
                      onChange={(e) => setFilterNumeroAdherent(e.target.value)}
                      placeholder="N° Adhérent"
                      className="filter-input"
                      style={{ minWidth: 100, maxWidth: 120, height: 30, fontSize: "0.9rem", padding: "2px 6px", borderRadius: 6 }}
                    />
                  </div>

                  {/* N° Dossier */}
                  <div style={{ display: "flex", alignItems: "center", margin: 0, marginRight: "46px" }}>
                    <label className="filter-label" style={{ fontSize: "0.9rem", margin: 0, marginRight: "-44px", whiteSpace: "nowrap", minWidth: "auto", fontWeight: 600, color: "#2c3e50" }}>
                      N° Dossier
                    </label>
                    <input
                      type="text"
                      value={filterNumeroDossier}
                      onChange={(e) => setFilterNumeroDossier(e.target.value)}
                      placeholder="N° Dossier"
                      className="filter-input"
                      style={{ minWidth: 100, maxWidth: 120, height: 30, fontSize: "0.9rem", padding: "2px 6px", borderRadius: 6 }}
                    />
                  </div>

                  {/* Reset Button */}
                  <div style={{ marginTop: "12px", width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        setFilterNom("");
                        setFilterStatut("");
                        setFilterNumeroAdherent("");
                        setFilterNumeroDossier("");
                      }}
                      title="Réinitialiser les filtres"
                    >
                      <FontAwesomeIcon icon={faClose} className="me-1" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ExpandRAffiliationTable
            columns={visibleColumns}
            data={dossiers}
            searchTerm={(globalSearch || "").toLowerCase()}
            selectedItems={selectedIds}
            handleSelectAllChange={handleSelectAllChange}
            handleCheckboxChange={handleCheckboxChange}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            handleChangePage={(e, p) => setCurrentPage(p)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            renderCustomActions={(row) => (
              <button
                className="btn btn-sm"
                style={{
                  color: "#307a82",
                  fontWeight: "700",
                  backgroundColor: "transparent",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  fontSize: "14px"
                }}
                onClick={() => {
                  setSelectedDossierNumero(row.numero_dossier);
                  setShowAddOperation(false);
                }}
              >
                <Eye size={18} strokeWidth={2.5} /> Gérer
              </button>
            )}
            emptyMessage={
              !departementId
                ? "Veuillez sélectionner un département pour afficher les dossiers."
                : (loading ? "Chargement..." : error || "Aucun dossier trouvé pour ce département.")
            }
          />
        </div>

        {showSidePanel && (
          <div style={{
            flex: '0 0 50%',
            overflowY: 'auto',
            height: '100%',
            backgroundColor: '#fdfdfd',
            boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.05)',
            borderLeft: '1px solid #e0e0e0',
            transition: 'all 0.3s ease-in-out',
            zIndex: 10
          }}>
            {showAddOperation ? (
              <AddMutuelleOperation
                onClose={() => setShowAddOperation(false)}
                onSaved={() => {
                  setShowAddOperation(false);
                  fetchDossiers();
                }}
                isSidebar={true}
              />
            ) : (
              <DossierMutuelleDetails
                numeroDossier={selectedDossierNumero}
                onClose={() => setSelectedDossierNumero(null)}
                onUpdate={fetchDossiers}
                isSidebar={true}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DossierMutuelleTable;
