import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import Swal from "sweetalert2";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import apiClient from "../../services/apiClient";
import { API_BASE_URL } from "../../services/apiConfig";
import DemandeMobiliteTable from "./DemandeMobiliteTable";
import AddDemandeMobilite from "./AddDemandeMobilite";
import EditDemandeMobilite from "./EditDemandeMobilite";
import ViewDemandeMobilite from "./ViewDemandeMobilite";
import "../Style.css";
import "./CareerTraining.css";

const DEMANDES_MOBILITE_CACHE_KEY = "demandes-mobilite:rows";

const extractApiError = (error, fallback) => {
  const apiMessage = error?.response?.data?.message;
  const validation = error?.response?.data?.errors;

  if (validation && typeof validation === "object") {
    const firstKey = Object.keys(validation)[0];
    if (firstKey && Array.isArray(validation[firstKey]) && validation[firstKey][0]) {
      return validation[firstKey][0];
    }
  }

  return apiMessage || fallback;
};

const DemandeMobilitePage = () => {
  const [rows, setRows] = useState(() => {
    try {
      const raw = sessionStorage.getItem(DEMANDES_MOBILITE_CACHE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [employees, setEmployees] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [drawerMode, setDrawerMode] = useState(null);
  const [selectedDemande, setSelectedDemande] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    statut: "",
    type_mobilite: "",
    departement_id: "",
    date_from: "",
    date_to: "",
  });

  const { setTitle, clearActions } = useHeader();
  const { dynamicStyles } = useOpen();

  const isDrawerOpen = drawerMode !== null;

  const fetchDemandes = useCallback(async (activeFilters = filters) => {
    const shouldShowBlockingLoading = rows.length === 0;
    if (shouldShowBlockingLoading) {
      setLoading(true);
    }

    try {
      const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
      );

      let data = [];

      try {
        const response = await apiClient.get("/demandes-mobilite", { params, timeout: 30000 });
        data = Array.isArray(response.data) ? response.data : [];
      } catch (primaryError) {
        const fallbackResponse = await axios.get(`${API_BASE_URL}/demandes-mobilite`, {
          params,
          timeout: 30000,
          headers: { Accept: "application/json" },
        });
        data = Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
      }

      setRows(data);
      try {
        sessionStorage.setItem(DEMANDES_MOBILITE_CACHE_KEY, JSON.stringify(data));
      } catch {
      }
    } catch (error) {
      console.error("Erreur chargement demandes mobilité:", error);
      const statusCode = error?.response?.status;
      const statusText = statusCode ? ` (code ${statusCode})` : "";
      Swal.fire("Erreur", `Impossible de charger les demandes de mobilité${statusText}.`, "error");

      if (rows.length === 0) {
        setRows([]);
      }
    } finally {
      if (shouldShowBlockingLoading) {
        setLoading(false);
      }
    }
  }, [filters, rows.length]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await apiClient.get("/employes/list");
      const data = Array.isArray(response.data) ? response.data : [];
      setEmployees(data);
    } catch (error) {
      console.error("Erreur chargement employés:", error);
      setEmployees([]);
    }
  }, []);

  const fetchDepartements = useCallback(async () => {
    try {
      const response = await apiClient.get("/departements");
      const data = Array.isArray(response.data) ? response.data : [];
      setDepartements(data);
    } catch (error) {
      console.error("Erreur chargement départements:", error);
      setDepartements([]);
    }
  }, []);

  const fetchPostes = useCallback(async () => {
    try {
      const response = await apiClient.get("/postes");
      const data = Array.isArray(response.data) ? response.data : [];
      setPostes(data);
    } catch (error) {
      console.error("Erreur chargement postes:", error);
      setPostes([]);
    }
  }, []);

  useEffect(() => {
    setTitle("Demandes de mobilité interne");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  useEffect(() => {
    fetchDemandes();
    fetchEmployees();
    fetchDepartements();
    fetchPostes();
  }, [fetchDemandes, fetchEmployees, fetchDepartements, fetchPostes]);

  const handleFiltersChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
    fetchDemandes(nextFilters);
  }, [fetchDemandes]);

  const handleResetFilters = useCallback(() => {
    const reset = {
      search: "",
      statut: "",
      type_mobilite: "",
      departement_id: "",
      date_from: "",
      date_to: "",
    };
    setFilters(reset);
    fetchDemandes(reset);
  }, [fetchDemandes]);

  const handleOpenAdd = useCallback(() => {
    setSelectedDemande(null);
    setDrawerMode("add");
  }, []);

  const handleOpenEdit = useCallback((row) => {
    setSelectedDemande(row);
    setDrawerMode("edit");
  }, []);

  const handleOpenView = useCallback((row) => {
    setSelectedDemande(row);
    setDrawerMode("view");
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedDemande(null);
    setDrawerMode(null);
  }, []);

  const submitDemande = useCallback(async (payload, mode, id) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    if (mode === "add") {
      await apiClient.post("/demandes-mobilite", payload, config);
      Swal.fire("Succès", "La demande de mobilité a été créée.", "success");
    } else {
      await apiClient.post(`/demandes-mobilite/${id}?_method=PUT`, payload, config);
      Swal.fire("Succès", "La demande de mobilité a été mise à jour.", "success");
    }

    await fetchDemandes();
    handleCloseDrawer();
  }, [fetchDemandes, handleCloseDrawer]);

  const handleCreate = useCallback(async (formData) => {
    try {
      await submitDemande(formData, "add");
    } catch (error) {
      Swal.fire("Erreur", extractApiError(error, "Création impossible."), "error");
    }
  }, [submitDemande]);

  const handleUpdate = useCallback(async (formData) => {
    if (!selectedDemande?.id) return;
    try {
      await submitDemande(formData, "edit", selectedDemande.id);
    } catch (error) {
      Swal.fire("Erreur", extractApiError(error, "Mise à jour impossible."), "error");
    }
  }, [selectedDemande, submitDemande]);

  const handleDelete = useCallback(async (row) => {
    const confirm = await Swal.fire({
      title: "Supprimer cette demande ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!confirm.isConfirmed) return;

    try {
      await apiClient.delete(`/demandes-mobilite/${row.id}`);
      Swal.fire("Supprimée", "La demande a été supprimée.", "success");
      await fetchDemandes();
      if (selectedDemande?.id === row.id) handleCloseDrawer();
    } catch (error) {
      Swal.fire("Erreur", extractApiError(error, "Suppression impossible."), "error");
    }
  }, [fetchDemandes, selectedDemande, handleCloseDrawer]);

  const handleStatusChange = useCallback(async (row, statut) => {
    try {
      await apiClient.post(`/demandes-mobilite/${row.id}/statut`, { statut });
      await fetchDemandes();
      if (selectedDemande?.id === row.id) {
        const response = await apiClient.get(`/demandes-mobilite/${row.id}`);
        setSelectedDemande(response?.data || null);
      }
      Swal.fire("Succès", "Statut mis à jour.", "success");
    } catch (error) {
      Swal.fire("Erreur", extractApiError(error, "Mise à jour du statut impossible."), "error");
    }
  }, [fetchDemandes, selectedDemande]);

  const drawerTitle = useMemo(() => {
    if (drawerMode === "add") return "Ajouter une demande de mobilité";
    if (drawerMode === "edit") return "Modifier la demande de mobilité";
    if (drawerMode === "view") return "Détail de la demande";
    return "";
  }, [drawerMode]);

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            mt: 12,
            minHeight: "calc(100vh - 130px)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "8px", width: "100%" }}>
              <div
                className={`with-split-view ${isDrawerOpen ? "split-active" : ""}`}
                style={{
                  display: "flex",
                  gap: isDrawerOpen ? "10px" : "0",
                  width: "100%",
                  minHeight: "calc(100vh - 130px)",
                  overflowX: isDrawerOpen ? "auto" : "visible",
                  overflowY: "visible",
                  boxSizing: "border-box",
                }}
              >
                <style>
                  {`
                    @media (max-width: 1200px) {
                      .with-split-view.split-active {
                        flex-direction: column !important;
                        overflow-x: hidden !important;
                        overflow-y: auto !important;
                      }

                      .with-split-view.split-active > div {
                        min-width: 100% !important;
                        max-width: 100% !important;
                        flex: 0 0 auto !important;
                      }
                    }
                  `}
                </style>
                <div
                  style={{
                    flex: isDrawerOpen ? "0 0 58%" : "1 1 100%",
                    minWidth: 0,
                    transition: "all .25s ease",
                  }}
                >
                  <DemandeMobiliteTable
                    rows={rows}
                    loading={loading && rows.length === 0}
                    filters={filters}
                    departements={departements}
                    onFiltersChange={handleFiltersChange}
                    onResetFilters={handleResetFilters}
                    onAdd={handleOpenAdd}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                </div>

                {isDrawerOpen && (
                  <div className="cnss-form-section" style={{ flex: "0 0 42%", minWidth: 340, maxWidth: "100%" }}>
                    <div className="cnss-form-header d-flex justify-content-between align-items-center">
                      <h5 style={{ margin: 0 }}>{drawerTitle}</h5>
                      <button className="cnss-close-btn" onClick={handleCloseDrawer} type="button" aria-label="Fermer">
                        ×
                      </button>
                    </div>

                    <div className="cnss-form-body" style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>
                      {drawerMode === "add" && (
                        <AddDemandeMobilite
                          employees={employees}
                          postes={postes}
                          departements={departements}
                          onSubmit={handleCreate}
                          onCancel={handleCloseDrawer}
                        />
                      )}

                      {drawerMode === "edit" && selectedDemande && (
                        <EditDemandeMobilite
                          demande={selectedDemande}
                          employees={employees}
                          postes={postes}
                          departements={departements}
                          onSubmit={handleUpdate}
                          onCancel={handleCloseDrawer}
                        />
                      )}

                      {drawerMode === "view" && selectedDemande && (
                        <ViewDemandeMobilite
                          demande={selectedDemande}
                          onClose={handleCloseDrawer}
                          onEdit={() => setDrawerMode("edit")}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DemandeMobilitePage;
