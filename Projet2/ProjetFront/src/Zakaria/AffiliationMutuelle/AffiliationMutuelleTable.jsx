import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import {
  faTrash,
  faFilePdf,
  faFileExcel,
  faSliders,
  faFilter,
  faClose,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trash2, Edit2 } from "lucide-react";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";

import AddAffiliationMutuelle from "./AddAffiliationMutuelle";
import ExpandRAffiliationTable from "./ExpandRAffiliationTable";
import AffiliationMutuelleFichePrint from "./AffiliationMutuelleFichePrint";
import "../Style.css";
import { useOpen } from "../../Acceuil/OpenProvider";

/**
 * ✅ IMPORTANT
 * Utilise le même host partout dans le projet.
 * Ton Manager utilise http://localhost:8000, donc on garde pareil ici.
 */
const API_BASE = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ indispensable si tu utilises cookies/session
});

const getApiErrorMessage = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  // On essaie de récupérer le message le plus précis possible
  const serverMsg =
    data?.error || // Souvent le message d'exception précis du backend
    data?.message || // Message global
    (typeof data === "string" ? data : null);

  return {
    status,
    message:
      serverMsg ||
      error?.message ||
      "Une erreur est survenue. Vérifiez la console et l'onglet Network.",
    data,
  };
};

const AffiliationMutuelleTable = forwardRef((props, ref) => {
  const {
    globalSearch,
    setIsAddingAffiliation,
    isAddingAffiliation,
    departementId,
    departementName,
    includeSubDepartments,
    departements,
    getSubDepartmentIds,
    filtersVisible,
    handleFiltersToggle,
  } = props;

  const { dynamicStyles } = useOpen();
  const { open } = useOpen();

  // --------------------------
  // VISIBILITE COLONNES (comme EmployeTable)
  // --------------------------
  const getInitialColumnVisibility = () => {
    const storedVisibility = localStorage.getItem(
      "affiliationMutuelleColumnVisibility"
    );
    return storedVisibility
      ? JSON.parse(storedVisibility)
      : {
          matricule: true,
          nom: true,
          prenom: true,
          mutuelle: true,
          regime: true,
          date_adhesion: true,
          date_resiliation: true,
          statut: true,
          ayant_droit: true,
        };
  };

  // --------------------------
  // STATE
  // --------------------------
  const [affiliationsWithDetails, setAffiliationsWithDetails] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedAffiliations, setSelectedAffiliations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [affiliationsPerPage, setAffiliationsPerPage] = useState(10);

  const [columnVisibility, setColumnVisibility] = useState(
    getInitialColumnVisibility()
  );

  const dropdownRef = useRef(null);
  const [showActions, setShowActions] = useState(true);

  // Print fiche
  const [showFicheModal, setShowFicheModal] = useState(false);
  const [selectedAffiliationForPrint, setSelectedAffiliationForPrint] =
    useState(null);

  // Mutuelles filtres
  const [filtresMutuelle, setFiltresMutuelle] = useState([]);
  const [selectedMutuelleFilter, setSelectedMutuelleFilter] = useState("");

  // Filters
  const [filterOptions, setFilterOptions] = useState({
    filters: [
      {
        key: "statut",
        label: "Statut",
        value: "",
        placeholder: "Statut",
        type: "select",
      },
      {
        key: "nom_mutuelle",
        label: "Mutuelle",
        value: "",
        placeholder: "Mutuelle",
        type: "select",
      },
      {
        key: "date_affiliation",
        label: "Date Affiliation",
        type: "range",
        min: "",
        max: "",
        placeholderMin: "Du",
        placeholderMax: "Au",
      },
      {
        key: "part_employeur",
        label: "Part Employeur",
        type: "range",
        min: "",
        max: "",
        placeholderMin: "Min",
        placeholderMax: "Max",
      },
      {
        key: "part_employe",
        label: "Part Employé",
        type: "range",
        min: "",
        max: "",
        placeholderMin: "Min",
        placeholderMax: "Max",
      },
    ],
  });

  // --------------------------
  // FETCH (mutuelles + affiliations) - table vide si pas de departement
  // --------------------------
  const fetchMutuelles = useCallback(async () => {
    try {
      const response = await api.get("/mutuelles");
      if (response.data?.success && Array.isArray(response.data.data)) {
        setFiltresMutuelle(response.data.data);
      }
    } catch (error) {
      const e = getApiErrorMessage(error);
      console.error("Erreur lors de la récupération des mutuelles:", e);
    }
  }, []);

  useEffect(() => {
    fetchMutuelles();
  }, [fetchMutuelles]);

  const fetchAffiliationsWithDetails = useCallback(async () => {
    if (!departementId) {
      setAffiliationsWithDetails([]);
      localStorage.removeItem("affiliationsWithDetails");
      return;
    }

    try {
      const params = { departement_id: departementId };
      if (selectedMutuelleFilter) params.mutuelle_id = selectedMutuelleFilter;

      const response = await api.get("/affiliations-mutuelle", { params });

      if (response.data?.success && Array.isArray(response.data.data)) {
        setAffiliationsWithDetails(response.data.data);
        localStorage.setItem(
          "affiliationsWithDetails",
          JSON.stringify(response.data.data)
        );
      } else {
        setAffiliationsWithDetails([]);
      }
    } catch (error) {
      const e = getApiErrorMessage(error);
      console.error("Erreur lors de la récupération des affiliations:", e);
      setAffiliationsWithDetails([]);
    }
  }, [departementId, selectedMutuelleFilter]);

  useEffect(() => {
    if (!departementId) {
      setAffiliationsWithDetails([]);
      setSelectedAffiliations([]);
      setExpandedRows({});
      return;
    }
    fetchAffiliationsWithDetails();
  }, [departementId, fetchAffiliationsWithDetails]);

  // Click outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --------------------------
  // COLUMNS (comme EmployeTable : allColumns -> visibleColumns)
  // --------------------------
  const allColumns = useMemo(
    () => [
      {
        key: "matricule",
        label: "Matricule",
        render: (item) => item.employe?.matricule || "N/A",
      },
      {
        key: "nom",
        label: "Nom",
        render: (item) => item.employe?.nom || "N/A",
      },
      {
        key: "prenom",
        label: "Prénom",
        render: (item) => item.employe?.prenom || "N/A",
      },
      {
        key: "mutuelle",
        label: "Mutuelle",
        render: (item) => item.mutuelle?.nom || "N/A",
      },
      {
        key: "regime",
        label: "Régime",
        render: (item) => item.regime?.libelle || "N/A",
      },
      {
        key: "date_adhesion",
        label: "Date Adhésion",
        render: (item) => {
          if (!item.date_adhesion) return "N/A";
          return new Date(item.date_adhesion).toLocaleDateString("fr-FR");
        },
      },
      {
        key: "date_resiliation",
        label: "Date Résiliation",
        render: (item) => {
          if (!item.date_resiliation) {
            return (
              <span style={{ color: "#6b7280", fontStyle: "italic" }}>-</span>
            );
          }
          const date = new Date(item.date_resiliation);
          return (
            <span style={{ color: "#dc2626", fontWeight: 500 }}>
              {date.toLocaleDateString("fr-FR")}
            </span>
          );
        },
      },
      {
        key: "statut",
        label: "Statut",
        render: (item) => (
          <span
            className={`badge ${
              item.statut === "ACTIVE" ? "bg-success" : "bg-danger"
            }`}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.8rem",
            }}
          >
            {item.statut === "ACTIVE" ? "Actif" : "Résilié"}
          </span>
        ),
      },
      {
        key: "ayant_droit",
        label: "Ayant Droit",
        render: (item) => (
          <span
            className={`badge ${
              item.ayant_droit ? "bg-primary" : "bg-secondary"
            }`}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.8rem",
            }}
          >
            {item.ayant_droit ? "Oui" : "Non"}
          </span>
        ),
      },
    ],
    []
  );

  const visibleColumns = useMemo(() => {
    return allColumns.filter((col) => columnVisibility[col.key]);
  }, [allColumns, columnVisibility]);

  const handleColumnsChange = useCallback((columnKey) => {
    setColumnVisibility((prev) => {
      const next = { ...prev, [columnKey]: !prev[columnKey] };
      localStorage.setItem(
        "affiliationMutuelleColumnVisibility",
        JSON.stringify(next)
      );
      return next;
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("affiliationMutuelleColumnVisibility");
    if (saved) {
      setColumnVisibility(JSON.parse(saved));
    } else {
      const defaults = {};
      allColumns.forEach((c) => (defaults[c.key] = true));
      setColumnVisibility(defaults);
      localStorage.setItem(
        "affiliationMutuelleColumnVisibility",
        JSON.stringify(defaults)
      );
    }
  }, [allColumns]);

  // --------------------------
  // LOGIQUE ADD/EDIT/CLOSE (copie EmployeTable)
  // --------------------------
  const handleAddNewAffiliation = useCallback(() => {
    if (!showAddForm) {
      setSelectedAffiliation(null);
      setShowAddForm(true);
      setIsAddingAffiliation(true);
      setShowActions(false);
    }
  }, [showAddForm, setIsAddingAffiliation]);

  const handleEditAffiliation = useCallback(
    (affiliation) => {
      setSelectedAffiliation(affiliation);
      setShowAddForm(true);
      setIsAddingAffiliation(true);
      setShowActions(false);
    },
    [setIsAddingAffiliation]
  );

  useEffect(() => {
    if (!showAddForm) setShowActions(true);
  }, [showAddForm]);

  const handleCloseForm = useCallback(() => {
    setSelectedAffiliation(null);
    setShowAddForm(false);
    setIsAddingAffiliation(false);
  }, [setIsAddingAffiliation]);

  const handleAffiliationAdded = useCallback(
    async (newAffiliation) => {
      // Recharger complètement les données depuis le serveur pour être sûr
      // d'avoir les formats corrects (dates, relations, etc.)
      await fetchAffiliationsWithDetails();
      handleCloseForm();
    },
    [handleCloseForm, fetchAffiliationsWithDetails]
  );

  const handleAffiliationUpdated = useCallback(
    async (updatedAffiliation) => {
      // Recharger complètement les données depuis le serveur pour être sûr
      await fetchAffiliationsWithDetails();
      handleCloseForm();
    },
    [handleCloseForm, fetchAffiliationsWithDetails]
  );

  // --------------------------
  // DELETE / RESILIER (Logique Active/Resiliée)
  // --------------------------
  const handleDeleteAffiliation = useCallback(
    async (affiliation) => {
      // Si l'argument n'est pas un objet (ex: si appelé avec un ID), on tente de retrouver l'objet
      let targetAffiliation = affiliation;
      if (typeof affiliation !== 'object') {
        targetAffiliation = affiliationsWithDetails.find(a => a.id === affiliation) || { id: affiliation, statut: 'UNKNOWN' };
      }

      // 1. Si ACTIVE => on propose la RESILIATION (PUT)
      if (targetAffiliation.statut === "ACTIVE") {
        const result = await Swal.fire({
          title: "Résilier l'affiliation ?",
          text: "Cette affiliation est ACTIVE. Vous devez la résilier avant de pouvoir la supprimer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#f59e0b", // Orange/Warning
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Oui, résilier",
          cancelButtonText: "Annuler",
          input: "date",
          inputLabel: "Date de résiliation",
          // Utiliser la date locale pour éviter les problèmes de fuseau horaire UTC
          inputValue: new Date().toLocaleDateString('en-CA'), 
          inputAttributes: { required: true },
        });

        if (result.isConfirmed && result.value) {
          try {
            await api.put(
              `/affiliations-mutuelle/${targetAffiliation.id}/resilier`,
              {
                date_resiliation: result.value,
                commentaire: "Résiliation via interface web",
              }
            );

            Swal.fire({
              icon: "success",
              title: "Résiliée !",
              text: "L'affiliation a été passée au statut RÉSILIÉ avec succès.",
              timer: 2000,
              showConfirmButton: false,
            });

            fetchAffiliationsWithDetails();
          } catch (error) {
            console.error("Erreur résiliation:", error);
            const msg = error.response?.data?.message || error.response?.data?.error || "Une erreur est survenue lors de la résiliation.";
            Swal.fire({
              icon: "error",
              title: `Erreur ${error.response?.status || ""}`,
              text: msg,
            });
          }
        }
      } 
      // 2. Si non active (donc RESILIÉ) => on propose la SUPPRESSION DEFINITIVE (DELETE)
      else {
        const result = await Swal.fire({
          title: "Suppression définitive ?",
          text: "Attention ! Cette action supprimera définitivement l'historique de cette affiliation.",
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#dc2626", // Rouge
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Supprimer définitivement",
          cancelButtonText: "Annuler",
        });

        if (result.isConfirmed) {
          try {
            await api.delete(
              `/affiliations-mutuelle/${targetAffiliation.id}`
            );

            Swal.fire({
              icon: "success",
              title: "Supprimée !",
              text: "L'affiliation a été supprimée de la base de données.",
              timer: 2000,
              showConfirmButton: false,
            });

            fetchAffiliationsWithDetails();
          } catch (error) {
            console.error("Erreur suppression:", error);
            const msg = error.response?.data?.message || error.response?.data?.error || "Impossible de supprimer cette affiliation.";
             Swal.fire({
              icon: "error",
              title: `Erreur ${error.response?.status || ""}`,
              text: msg,
            });
          }
        }
      }
    },
    [fetchAffiliationsWithDetails, affiliationsWithDetails]
  );

  // --------------------------
  // FILTERS + SEARCH
  // --------------------------
  const handleFilterChange = (key, value) => {
    setFilterOptions((prev) => {
      const newFilters = prev.filters.map((filter) => {
        if (filter.key === key && filter.type === "select") {
          return { ...filter, value };
        }
        return filter;
      });
      return { ...prev, filters: newFilters };
    });
  };

  const handleRangeFilterChange = (key, type, value) => {
    setFilterOptions((prev) => {
      const newFilters = prev.filters.map((filter) => {
        if (filter.key === key && filter.type === "range") {
          return { ...filter, [type]: value };
        }
        return filter;
      });
      return { ...prev, filters: newFilters };
    });
  };

  const applyFilters = (affiliations) => {
    return affiliations.filter((affiliation) => {
      const statutFilter = filterOptions.filters.find((f) => f.key === "statut");
      const mutuelleFilter = filterOptions.filters.find(
        (f) => f.key === "nom_mutuelle"
      );
      const dateFilter = filterOptions.filters.find(
        (f) => f.key === "date_affiliation"
      );
      const partEmployeurFilter = filterOptions.filters.find(
        (f) => f.key === "part_employeur"
      );
      const partEmployeFilter = filterOptions.filters.find(
        (f) => f.key === "part_employe"
      );

      const matchesStatut =
        !statutFilter?.value ||
        affiliation.statut?.toLowerCase() === statutFilter.value.toLowerCase();

      // ✅ rendu plus robuste : mutuelle?.nom OU nom_mutuelle
      const mutuelleName =
        affiliation.mutuelle?.nom || affiliation.nom_mutuelle || "";

      const matchesMutuelle =
        !mutuelleFilter?.value ||
        String(mutuelleName)
          .toLowerCase()
          .includes(mutuelleFilter.value.toLowerCase());

      const matchesDate = (() => {
        if (!dateFilter?.min && !dateFilter?.max) return true;
        if (!affiliation.date_affiliation) return false;

        const d = new Date(affiliation.date_affiliation);
        const minD = dateFilter.min
          ? new Date(dateFilter.min)
          : new Date("1900-01-01");
        const maxD = dateFilter.max
          ? new Date(dateFilter.max)
          : new Date("2100-12-31");
        return d >= minD && d <= maxD;
      })();

      const matchesPartEmployeur = (() => {
        if (!partEmployeurFilter?.min && !partEmployeurFilter?.max) return true;
        const part = parseFloat(affiliation.part_employeur) || 0;
        const min = partEmployeurFilter.min
          ? parseFloat(partEmployeurFilter.min)
          : 0;
        const max = partEmployeurFilter.max
          ? parseFloat(partEmployeurFilter.max)
          : 100;
        return part >= min && part <= max;
      })();

      const matchesPartEmploye = (() => {
        if (!partEmployeFilter?.min && !partEmployeFilter?.max) return true;
        const part = parseFloat(affiliation.part_employe) || 0;
        const min = partEmployeFilter.min
          ? parseFloat(partEmployeFilter.min)
          : 0;
        const max = partEmployeFilter.max
          ? parseFloat(partEmployeFilter.max)
          : 100;
        return part >= min && part <= max;
      })();

      return (
        matchesStatut &&
        matchesMutuelle &&
        matchesDate &&
        matchesPartEmployeur &&
        matchesPartEmploye
      );
    });
  };

  useEffect(() => {
    const getUniqueValues = (data, key) => {
      return [...new Set(data.map((x) => x?.[key]).filter(Boolean))];
    };

    setFilterOptions((prev) => ({
      filters: prev.filters.map((filter) => {
        if (filter.type !== "select") return filter;

        let options = [];
        if (filter.key === "statut") {
          options = getUniqueValues(affiliationsWithDetails, "statut").map((v) => ({
            label: v,
            value: v,
          }));
        } else if (filter.key === "nom_mutuelle") {
          // ✅ robuste
          const values = affiliationsWithDetails
            .map((a) => a?.mutuelle?.nom || a?.nom_mutuelle)
            .filter(Boolean);
          options = [...new Set(values)].map((v) => ({ label: v, value: v }));
        }

        return { ...filter, options };
      }),
    }));
  }, [affiliationsWithDetails]);

  // base list : departement + search
  const filteredAffiliations = useMemo(() => {
    if (!departementId) return [];

    let result = includeSubDepartments
      ? affiliationsWithDetails.filter((a) => {
          const subIds = getSubDepartmentIds(departements, departementId);
          return subIds.includes(a.employe?.departement_id);
        })
      : affiliationsWithDetails.filter(
          (a) => a.employe?.departement_id === departementId
        );

    if (globalSearch.trim()) {
      const s = globalSearch.toLowerCase().trim();
      result = result.filter((a) => {
        const searchValues = [
          a.employe?.matricule,
          a.employe?.nom,
          a.employe?.prenom,
          a.mutuelle?.nom,
          a.regime?.libelle,
          a.date_adhesion,
          a.date_resiliation,
          a.statut,
          a.ayant_droit,
          a.commentaire,
          a.numero_adherent,
        ];
        return searchValues.some(
          (v) => v && v.toString().toLowerCase().includes(s)
        );
      });
    }

    return result;
  }, [
    affiliationsWithDetails,
    departementId,
    includeSubDepartments,
    getSubDepartmentIds,
    departements,
    globalSearch,
  ]);

  const normalizeValue = (value) => String(value).toLowerCase().trim();

  const filteredAffiliationsWithFilters = useMemo(() => {
    const searched = filteredAffiliations.filter((a) =>
      globalSearch
        .toLowerCase()
        .split(/\s+/)
        .every((term) =>
          Object.values(a).some((value) => {
            if (value === null || value === undefined) return false;
            return normalizeValue(value.toString()).includes(normalizeValue(term));
          })
        )
    );

    return applyFilters(searched);
  }, [filteredAffiliations, globalSearch, filterOptions]);

  // highlightText JSX (comme EmployeTable)
  const highlightText = useCallback((text, searchTerm) => {
    if (!text || !searchTerm) return text;

    const textStr = String(text);
    const searchTermLower = searchTerm.toLowerCase();

    if (!textStr.toLowerCase().includes(searchTermLower)) return textStr;

    const parts = textStr.split(new RegExp(`(${searchTerm})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === searchTermLower ? (
        <mark key={i} style={{ backgroundColor: "yellow" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  }, []);

  // --------------------------
  // EXPAND ROW
  // --------------------------
  const toggleRowExpansion = useCallback((id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const renderExpandedRow = useCallback(
    (affiliation) => {
      return (
        <tr key={`expanded-${affiliation.id}`}>
          <td
            colSpan={visibleColumns.length + 3}
            style={{ backgroundColor: "#f8f9fa", padding: "20px" }}
          >
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              <div>
                <h6 style={{ color: "#495057", marginBottom: "10px" }}>
                  Informations Détaillées
                </h6>
                <p>
                  <strong>Numéro d'adhérent:</strong>{" "}
                  {affiliation.numero_adherent || "-"}
                </p>
                <p>
                  <strong>Date d'affiliation:</strong>{" "}
                  {affiliation.date_adhesion || "-"}
                </p>
                <p>
                  <strong>Statut:</strong> {affiliation.statut || "-"}
                </p>
              </div>

              <div>
                <h6 style={{ color: "#495057", marginBottom: "10px" }}>
                  Répartition
                </h6>
                <p>
                  <strong>Part employeur:</strong>{" "}
                  {affiliation.regime?.part_employeur_pct ?? "-"}%
                </p>
                <p>
                  <strong>Part employé:</strong>{" "}
                  {affiliation.regime?.part_employe_pct ?? "-"}%
                </p>
              </div>

              <div>
                <h6 style={{ color: "#495057", marginBottom: "10px" }}>
                  Observations
                </h6>
                <p>{affiliation.commentaire || "Aucune observation"}</p>
              </div>
            </div>
          </td>
        </tr>
      );
    },
    [visibleColumns.length]
  );

  // --------------------------
  // ACTIONS
  // --------------------------
  const handlePrintFiche = useCallback((affiliation) => {
    setSelectedAffiliationForPrint(affiliation);
    setShowFicheModal(true);
  }, []);

  const renderCustomActions = useCallback(
    (affiliation) => (
      <>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAffiliation(affiliation);
          }}
          aria-label="Modifier"
          title="Modifier"
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          <FontAwesomeIcon icon={faSliders} style={{ color: "#0d6efd", fontSize: 14 }} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrintFiche(affiliation);
          }}
          aria-label="Fiche"
          title="Fiche"
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          <FontAwesomeIcon icon={faIdCard} style={{ color: "#17a2b8", fontSize: 14 }} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAffiliation(affiliation);
          }}
          aria-label="Résilier"
          title="Résilier"
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faTrash} style={{ color: "#dc3545", fontSize: 14 }} />
        </button>
      </>
    ),
    [handleDeleteAffiliation, handleEditAffiliation, handlePrintFiche]
  );

  // --------------------------
  // SELECT / DELETE SELECTED
  // --------------------------
  const handleSelectAllChange = useCallback(() => {
    if (selectedAffiliations.length === filteredAffiliationsWithFilters.length) {
      setSelectedAffiliations([]);
    } else {
      setSelectedAffiliations(filteredAffiliationsWithFilters.map((a) => a.id));
    }
  }, [filteredAffiliationsWithFilters, selectedAffiliations]);

  const handleCheckboxChange = useCallback((id) => {
    setSelectedAffiliations((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedAffiliations.length === 0) return;

    // Récupérer les objets complets pour vérifier le statut
    const selectedObjects = selectedAffiliations.map(id => 
      affiliationsWithDetails.find(a => a.id === id)
    ).filter(Boolean);

    // Vérifier s'il y a des affiliations ACTIVE
    const hasActive = selectedObjects.some(a => a.statut === "ACTIVE");

    if (hasActive) {
      // MODE RÉSILIATION MASSIVE
      const result = await Swal.fire({
        title: "Résilier la sélection ?",
        text: `Vous avez sélectionné ${selectedAffiliations.length} élément(s) dont certains sont ACTIFS. Ils seront résiliés.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f59e0b",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Oui, résilier tout",
        cancelButtonText: "Annuler",
        input: "date",
        inputLabel: "Date de résiliation",
        inputValue: new Date().toLocaleDateString('en-CA'),
        inputAttributes: { required: true },
      });

      if (result.isConfirmed && result.value) {
        try {
          // Filtrer pour ne résilier que ceux qui sont ACTIVE
          const activeOnes = selectedObjects.filter(a => a.statut === "ACTIVE");

          if (activeOnes.length > 0) {
            await Promise.all(
              activeOnes.map((item) =>
                api.put(
                  `/affiliations-mutuelle/${item.id}/resilier`,
                  {
                    date_resiliation: result.value,
                    commentaire: "Résiliation de masse via interface web",
                  }
                )
              )
            );
            Swal.fire("Résiliées !", `${activeOnes.length} affiliation(s) ont été résiliées.`, "success");
          } else {
            Swal.fire("Info", "Aucune affiliation active n'était sélectionnée pour la résiliation.", "info");
          }

          await fetchAffiliationsWithDetails();
          setSelectedAffiliations([]);

        } catch (error) {
          console.error("Erreur résiliation masse:", error);
          const msg = error.response?.data?.message || "Une erreur est survenue lors de la résiliation de masse.";
          Swal.fire("Erreur !", `${msg}`, "error");
        }
      }
    } else {
      // MODE SUPPRESSION MASSIVE (TOUTES SONT DÉJÀ RÉSILIÉES)
      const result = await Swal.fire({
        title: "Supprimer la sélection ?",
        text: `Vous allez supprimer définitivement ${selectedAffiliations.length} affiliation(s). Cette action est irréversible.`,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Oui, supprimer tout",
        cancelButtonText: "Annuler",
      });

      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedAffiliations.map((id) =>
              api.delete(`/affiliations-mutuelle/${id}`)
            )
          );

          await fetchAffiliationsWithDetails();
          setSelectedAffiliations([]);

          Swal.fire("Supprimées !", "Les affiliations ont été supprimées.", "success");
        } catch (error) {
          console.error("Erreur suppression masse:", error);
          const msg = error.response?.data?.message || "Une erreur est survenue lors de la suppression de masse.";
          Swal.fire("Erreur !", `${msg}`, "error");
        }
      }
    }
  }, [selectedAffiliations, affiliationsWithDetails, fetchAffiliationsWithDetails]);

  // --------------------------
  // PAGINATION
  // --------------------------
  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setAffiliationsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

  // --------------------------
  // EXPORTS (PDF/EXCEL/PRINT)
  // --------------------------
  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();

    const tableColumn = visibleColumns.map((col) => col.label);

    const tableRows = filteredAffiliationsWithFilters.map((a) =>
      visibleColumns.map((col) => {
        if (col.key === "matricule") return a.employe?.matricule || "";
        if (col.key === "nom") return a.employe?.nom || "";
        if (col.key === "prenom") return a.employe?.prenom || "";
        if (col.key === "mutuelle") return a.mutuelle?.nom || "";
        if (col.key === "regime") return a.regime?.libelle || "";
        return a[col.key] ?? "";
      })
    );

    doc.setFontSize(18);
    doc.text(`Affiliations Mutuelle - ${departementName || ""}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    });

    doc.save(
      `affiliations_mutuelle_${departementName || "departement"}_${new Date().toISOString()}.pdf`
    );
  }, [visibleColumns, filteredAffiliationsWithFilters, departementName]);

  const exportToExcel = useCallback(() => {
    const tableData = filteredAffiliationsWithFilters.map((a) => {
      const row = {};
      visibleColumns.forEach((col) => {
        if (col.key === "matricule") row[col.label] = a.employe?.matricule || "";
        else if (col.key === "nom") row[col.label] = a.employe?.nom || "";
        else if (col.key === "prenom") row[col.label] = a.employe?.prenom || "";
        else if (col.key === "mutuelle") row[col.label] = a.mutuelle?.nom || "";
        else if (col.key === "regime") row[col.label] = a.regime?.libelle || "";
        else row[col.label] = a[col.key] ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Affiliations Mutuelle");
    XLSX.writeFile(
      wb,
      `affiliations_mutuelle_${departementName || "departement"}_${new Date().toISOString()}.xlsx`
    );
  }, [visibleColumns, filteredAffiliationsWithFilters, departementName]);

  const handlePrint = useCallback(() => {
    const tableColumn = visibleColumns.map((col) => col.label);

    const tableRows = filteredAffiliationsWithFilters.map((a) =>
      visibleColumns.map((col) => {
        if (col.key === "matricule") return a.employe?.matricule || "";
        if (col.key === "nom") return a.employe?.nom || "";
        if (col.key === "prenom") return a.employe?.prenom || "";
        if (col.key === "mutuelle") return a.mutuelle?.nom || "";
        if (col.key === "regime") return a.regime?.libelle || "";
        return a[col.key] ?? "";
      })
    );

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
            @page { margin: 0; }
            body { margin: 1cm; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Affiliations Mutuelle dans ${departementName || ""}</h1>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>${tableColumn.map((col) => `<th>${col}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${tableRows
                .map(
                  (row) =>
                    `<tr>${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [visibleColumns, filteredAffiliationsWithFilters, departementName]);

  useImperativeHandle(ref, () => ({
    exportToPDF,
    exportToExcel,
    handlePrint,
  }));

  // --------------------------
  // DROPDOWN COLONNES
  // --------------------------
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
  };

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <div
      style={{
        position: "relative",
        top: "0",
        height: "calc(100vh - 120px)",
        flex: 1,
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        display: "flex", 
        flexDirection: "column"
      }}
      className="container_employee"
    >
      <div className="mt-4">
        <div className="section-header mb-3">
          <div
            className="d-flex align-items-center justify-content-between flex-wrap"
            style={{ gap: "16px" }}
          >
            {/* Bloc titre */}
            <div style={{ flex: "1 1 300px", minWidth: 0 }}>
              <span
                className="section-title mb-1"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#2c767c",
                }}
              >
                <i className="fas fa-users me-2"></i>
                Affiliations Mutuelle
              </span>

              {!showAddForm && (
                <p className="section-description text-muted mb-0">
                  {departementId ? filteredAffiliationsWithFilters.length : 0}{" "}
                  affiliation
                  {filteredAffiliationsWithFilters.length > 1 ? "s" : ""}{" "}
                  actuellement affichée
                  {filteredAffiliationsWithFilters.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Bloc actions */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <FontAwesomeIcon
                onClick={() =>
                  handleFiltersToggle && handleFiltersToggle(!filtersVisible)
                }
                icon={filtersVisible ? faClose : faFilter}
                color={filtersVisible ? "green" : ""}
                style={{
                  cursor: "pointer",
                  fontSize: "1.9rem",
                  color: "#2c767c",
                  marginTop: "1.3%",
                  marginRight: "8px",
                }}
              />

              <Button
                onClick={() => {
                  if (!departementId) return;
                  handleAddNewAffiliation();
                }}
                className={`btn btn-outline-primary d-flex align-items-center ${
                  !departementId ? "disabled-btn" : ""
                }`}
                size="sm"
                style={{
                  marginRight: "30px !important",
                  width: "190px",
                }}
              >
                <FaPlusCircle className="me-2" />
                Ajouter Affiliation
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

      <div style={{ display: 'flex', gap: '20px', transition: 'all 0.3s' }}>
        <div style={{ flex: '1', width: showAddForm ? '50%' : '100%', transition: 'all 0.3s', minWidth: 0 }}>
      {/* Section filtres */}
      <AnimatePresence>
        {filtersVisible && (
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
              {/* Mutuelle dropdown */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: 0,
                  marginRight: "46px",
                }}
              >
                <label
                  className="filter-label"
                  style={{
                    fontSize: "0.9rem",
                    margin: 0,
                    marginRight: "-44px",
                    whiteSpace: "nowrap",
                    minWidth: "auto",
                    fontWeight: 600,
                    color: "#2c3e50",
                  }}
                >
                  Mutuelle
                </label>
                <select
                  value={selectedMutuelleFilter}
                  onChange={(e) => setSelectedMutuelleFilter(e.target.value)}
                  className="filter-input"
                  style={{
                    minWidth: 120,
                    maxWidth: 150,
                    height: 30,
                    fontSize: "0.9rem",
                    padding: "2px 6px",
                    borderRadius: 6,
                  }}
                >
                  <option value="">Toutes</option>
                  {filtresMutuelle.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              {filterOptions.filters.map((filter, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 0,
                    marginRight: "46px",
                  }}
                >
                  <label
                    className="filter-label"
                    style={{
                      fontSize: "0.9rem",
                      margin: 0,
                      marginRight: "-44px",
                      whiteSpace: "nowrap",
                      minWidth: "auto",
                      fontWeight: 600,
                      color: "#2c3e50",
                    }}
                  >
                    {filter.label}
                  </label>

                  {filter.type === "select" ? (
                    <select
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="filter-input"
                      style={{
                        minWidth: 80,
                        maxWidth: 110,
                        height: 30,
                        fontSize: "0.9rem",
                        padding: "2px 6px",
                        borderRadius: 6,
                      }}
                    >
                      <option value="">{filter.placeholder}</option>
                      {filter.options?.map((option, optIndex) => (
                        <option key={optIndex} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === "range" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <input
                        type={
                          filter.key === "date_affiliation" ? "date" : "number"
                        }
                        value={filter.min}
                        onChange={(e) =>
                          handleRangeFilterChange(
                            filter.key,
                            "min",
                            e.target.value
                          )
                        }
                        placeholder={filter.placeholderMin}
                        className="filter-input filter-range-input"
                        style={{
                          minWidth: 50,
                          maxWidth: 70,
                          height: 30,
                          fontSize: "0.9rem",
                          padding: "2px 4px",
                          borderRadius: 6,
                        }}
                      />
                      <span
                        className="filter-range-separator"
                        style={{
                          margin: "0 2px",
                          fontSize: "0.9rem",
                          color: "#666",
                        }}
                      >
                        -
                      </span>
                      <input
                        type={
                          filter.key === "date_affiliation" ? "date" : "number"
                        }
                        value={filter.max}
                        onChange={(e) =>
                          handleRangeFilterChange(
                            filter.key,
                            "max",
                            e.target.value
                          )
                        }
                        placeholder={filter.placeholderMax}
                        className="filter-input filter-range-input"
                        style={{
                          minWidth: 50,
                          maxWidth: 70,
                          height: 30,
                          fontSize: "0.9rem",
                          padding: "2px 4px",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE */}
      <ExpandRAffiliationTable
        columns={visibleColumns}
        data={filteredAffiliationsWithFilters}
        searchTerm={(globalSearch || "").toLowerCase()}
        highlightText={highlightText}
        selectAll={
          selectedAffiliations.length === filteredAffiliationsWithFilters.length &&
          filteredAffiliationsWithFilters.length > 0
        }
        selectedItems={selectedAffiliations}
        handleSelectAllChange={handleSelectAllChange}
        handleCheckboxChange={handleCheckboxChange}
        handleEdit={handleEditAffiliation}
        handleDelete={handleDeleteAffiliation}
        handleDeleteSelected={handleDeleteSelected}
        rowsPerPage={affiliationsPerPage}
        page={currentPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        expandedRows={expandedRows}
        toggleRowExpansion={toggleRowExpansion}
        renderExpandedRow={renderExpandedRow}
        renderCustomActions={renderCustomActions}
      />
      </div>

      {showAddForm && (
        <div style={{ flex: '0 0 50%', maxWidth: '50%', transition: 'all 0.3s', minWidth: '380px' }}>
        <AddAffiliationMutuelle
          toggleAffiliationForm={handleCloseForm}
          selectedDepartementId={departementId}
          onAffiliationAdded={handleAffiliationAdded}
          selectedAffiliation={selectedAffiliation}
          onAffiliationUpdated={handleAffiliationUpdated}
          fetchAffiliations={fetchAffiliationsWithDetails}
          isSidebar={true}
        />
        </div>
      )}
      </div>

      <AffiliationMutuelleFichePrint
        show={showFicheModal}
        onHide={() => {
          setShowFicheModal(false);
          setSelectedAffiliationForPrint(null);
        }}
        affiliation={selectedAffiliationForPrint}
      />
    </div>
  );
});

export default AffiliationMutuelleTable;
