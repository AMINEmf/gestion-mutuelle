import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { Button, Form } from "react-bootstrap";
import { faSliders, faFilter, faClose, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import { IoFolderOpenOutline } from "react-icons/io5";
import { FaMinus, FaPlus } from "react-icons/fa6";
import ExpandRTable from "../Employe/ExpandRTable";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import SectionTitle from "../CNSS/SectionTitle";
import AddPoste from "./AddPoste";
import { EmployeeProfileDrawer } from "./CarrieresTable";
import PosteSuggestionsDrawer from "./PosteSuggestionsDrawer";
import apiClient from "../../services/apiClient";
import "../Style.css";
import "../Employe/DepartementManager.css";
import "./CareerTraining.css";

const normalizeValue = (value) => (value == null ? "" : String(value).toLowerCase().trim());
const getSkillName = (skill) => {
  if (!skill) return "";
  if (typeof skill === "string") return skill;
  return skill.nom ?? skill.label ?? skill.name ?? "";
};

const findFirstDepartment = (items) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  const first = items[0];
  if (first?.id) return first;
  if (Array.isArray(first?.children) && first.children.length > 0) {
    return findFirstDepartment(first.children);
  }
  return null;
};

const normalizeDepartmentTree = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.id != null)
    .map((item) => ({
      id: item.id,
      nom: item.nom ?? item.name ?? "",
      children: normalizeDepartmentTree(item.children ?? []),
    }));
};

const hasDepartments = (items) =>
  Array.isArray(items) && items.length > 0 && items.some((item) => item?.id != null);

const DEBUG_POSTES = false;
const DEBUG_PROFILE = false;

const PositionsGrades = () => {
  const { setTitle, clearActions, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();

  const [departements, setDepartements] = useState([]);
  const [selectedDepartementId, setSelectedDepartementId] = useState(null);
  const [selectedDepartementName, setSelectedDepartementName] = useState(null);
  const [expandedDepartements, setExpandedDepartements] = useState({});
  const [includeSubDepartments, setIncludeSubDepartments] = useState(false);

  const [positions, setPositions] = useState([]);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [selectedAiEmployee, setSelectedAiEmployee] = useState(null);
  const [showAiDetailsDrawer, setShowAiDetailsDrawer] = useState(false);
  const [selectedAiPosteEmployee, setSelectedAiPosteEmployee] = useState(null);
  const [expandedPosteId, setExpandedPosteId] = useState(null);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [detailsPosteId, setDetailsPosteId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [competencesData, setCompetencesData] = useState([]);
  const [loadingCompetences, setLoadingCompetences] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [assigningEmployeeId, setAssigningEmployeeId] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);

  const dropdownRef = useRef(null);

  const allColumns = useMemo(
    () => [
      { key: "poste", label: "Poste" },
      { key: "grade", label: "Grade" },
      { key: "domaine", label: "Domaine" },
      {
        key: "statut",
        label: "Statut",
        render: (item) => (
          <span className={`career-badge ${item.statut === "Vacant" ? "warning" : "success"}`}>
            {item.statut}
          </span>
        ),
      },
      { key: "niveau", label: "Niveau" },
    ],
    []
  );

  useEffect(() => {
    setTitle("Gestion des Postes");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  const mapPosteRow = useCallback((poste) => {
    const unite = poste?.unite ?? null;
    const departement = poste?.departement ?? unite?.departement ?? null;
    const grade = poste?.grade ?? null;

    return {
      ...poste,
      id: poste?.id,
      poste: poste?.nom ?? poste?.poste ?? "",
      departement:
        departement?.nom ??
        poste?.departement_nom ??
        poste?.departementName ??
        unite?.nom ??
        poste?.departement ??
        "",
      departement_id: poste?.departement_id ?? departement?.id ?? unite?.departement_id ?? null,
      grade_id: grade?.id ?? poste?.grade_id ?? null,
      grade_obj: grade, 
      grade: grade?.code ? `${grade.code} - ${grade.label ?? ""}`.trim() : grade?.label ?? poste?.grade_nom ?? poste?.grade ?? "",
      domaine: poste?.domaine ?? "-",
      statut: poste?.statut ?? "-",
      niveau: poste?.niveau ?? "-",
      competences:
        Array.isArray(poste?.competences)
          ? poste.competences.map((comp) => (typeof comp === "string" ? comp : comp?.nom ?? comp?.label ?? comp?.name ?? ""))
          : [],
      // Ensure we keep the raw objects for detail views if needed, though the expand view uses strings
      raw_competences: poste?.competences || [],
    };
  }, []);

  const fetchPostes = useCallback(async () => {
    let hasCachedData = false;

    try {
      const cachedData = localStorage.getItem("postes_cache");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPositions(parsed);
          setLoadingPositions(false);
          hasCachedData = true;
        }
      }
    } catch (cacheError) {
      console.warn("POSTES_CACHE_READ_ERROR", cacheError);
    }

    if (!hasCachedData) {
      setLoadingPositions(true);
    }

    try {
      const response = await apiClient.get("/postes");
      if (DEBUG_POSTES) {
        console.log("POSTES_API_RESPONSE", response?.data);
      }
      const payload = response?.data?.data ?? response?.data ?? [];
      const rows = Array.isArray(payload) ? payload.map(mapPosteRow) : [];
      setPositions(rows);

      try {
        localStorage.setItem("postes_cache", JSON.stringify(rows));
      } catch (cacheWriteError) {
        console.warn("POSTES_CACHE_WRITE_ERROR", cacheWriteError);
      }
    } catch (error) {
      console.error("POSTES_API_ERROR", error);
      if (!hasCachedData) {
        setPositions([]);
      }
    } finally {
      setLoadingPositions(false);
    }
  }, [mapPosteRow]);

  useEffect(() => {
    fetchPostes();
  }, [fetchPostes]);

  const fetchCompetences = useCallback(async () => {
    setLoadingCompetences(true);
    try {
      const response = await apiClient.get("/competences");
      const payload = response?.data?.data ?? response?.data ?? [];
      setCompetencesData(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error("COMPETENCES_API_ERROR", error);
      setCompetencesData([]);
    } finally {
      setLoadingCompetences(false);
    }
  }, []);

  const fetchGrades = useCallback(async () => {
    setLoadingGrades(true);
    try {
        const response = await apiClient.get('/grades');
        const data = response.data?.data ?? response.data ?? [];
        setGrades(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("GRADES_API_ERROR", error);
        setGrades([]); 
    } finally {
        setLoadingGrades(false);
    }
  }, []);

  const fetchAiSuggestions = useCallback(async (posteId) => {
    if (!posteId) return;
    setLoadingAiSuggestions(true);
    try {
      const response = await apiClient.get(`/postes/${posteId}/suggestions`);
      const payload = response?.data?.data ?? response?.data ?? [];
      const rows = Array.isArray(payload) ? payload : [];
      setAiSuggestions(rows);
    } catch (error) {
      console.error("AI_SUGGESTIONS_ERROR", error);
      setAiSuggestions([]);
    } finally {
      setLoadingAiSuggestions(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetences();
    fetchGrades();
  }, [fetchCompetences, fetchGrades]);

  const fetchDepartmentHierarchy = async () => {
    const applyTree = (rawItems) => {
      const normalized = normalizeDepartmentTree(rawItems);
      if (!hasDepartments(normalized)) return false;
      setDepartements(normalized);
      localStorage.setItem("departmentHierarchy", JSON.stringify(normalized));
      return true;
    };

    try {
      const response = await apiClient.get("/departements/hierarchy");
      const data = response?.data?.data ?? response?.data ?? [];
      if (applyTree(data)) return;
    } catch (error) {
      // continue to fallbacks
    }

    try {
      const legacyTree = JSON.parse(localStorage.getItem("departements") || "[]");
      if (applyTree(legacyTree)) return;
    } catch {
      // ignore parse error
    }

    try {
      const response = await apiClient.get("/employes/list");
      const employees = response?.data?.data ?? response?.data ?? [];
      const map = new Map();

      if (Array.isArray(employees)) {
        employees.forEach((emp) => {
          const deptId = emp?.departement_id ?? emp?.departement?.id ?? null;
          const deptName = emp?.departement?.nom ?? null;
          if (deptId != null && !map.has(String(deptId))) {
            map.set(String(deptId), {
              id: deptId,
              nom: deptName ?? `Département ${deptId}`,
              children: [],
            });
          }

          if (Array.isArray(emp?.departements)) {
            emp.departements.forEach((d) => {
              if (d?.id != null && !map.has(String(d.id))) {
                map.set(String(d.id), {
                  id: d.id,
                  nom: d.nom ?? d.name ?? `Département ${d.id}`,
                  children: [],
                });
              }
            });
          }
        });
      }

      if (applyTree(Array.from(map.values()))) return;
    } catch {
      // ignore fallback error
    }

    Swal.fire({
      icon: "error",
      title: "Accès refusé",
      text: "Impossible de charger les départements pour cette page.",
    });
  };

  useEffect(() => {
    const departmentsFromStorage = localStorage.getItem("departmentHierarchy");
    if (departmentsFromStorage) {
      setDepartements(JSON.parse(departmentsFromStorage));
    }
    fetchDepartmentHierarchy();
  }, []);

  useEffect(() => {
    const savedVisibility = localStorage.getItem("postesColumnVisibility");
    if (savedVisibility) {
      const parsed = JSON.parse(savedVisibility);
      const merged = { ...parsed };
      allColumns.forEach((col) => {
        if (merged[col.key] === undefined) merged[col.key] = true;
      });
      setColumnVisibility(merged);
      localStorage.setItem("postesColumnVisibility", JSON.stringify(merged));
    } else {
      const defaultVisibility = {};
      allColumns.forEach((col) => {
        defaultVisibility[col.key] = true;
      });
      setColumnVisibility(defaultVisibility);
      localStorage.setItem("postesColumnVisibility", JSON.stringify(defaultVisibility));
    }
  }, [allColumns]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!selectedPoste && showProfileDrawer) {
      setShowProfileDrawer(false);
      setSelectedAiEmployee(null);
    }
  }, [selectedPoste, showProfileDrawer]);

  const toggleExpand = (departementId) => {
    setExpandedDepartements((prev) => ({
      ...prev,
      [departementId]: !prev[departementId],
    }));
  };

  const handleDepartementClick = (departementId, departementName) => {
    if (departementId) {
      setSelectedDepartementId(departementId);
      setSelectedDepartementName(departementName);
      
      // Fermer tous les drawers lors du changement de département
      setIsSuggestionOpen(false);
      // setShowAICard(false); // Variable non définie - commentée
      setDetailsPosteId(null);
      setShowAiDetailsDrawer(false);
      setSelectedAiPosteEmployee(null);
      setShowAddForm(false);
      setEditingPostId(null);
      setShowProfileDrawer(false);
      setSelectedAiEmployee(null);
      setSelectedPoste(null);
      setExpandedPosteId(null);
    }
  };

  // Ferme tous les drawers d'ajout/modification lors du changement de département
  useEffect(() => {
    if (selectedDepartementId !== null) {
      setShowAddForm(false);
      setEditingPostId(null);
    }
  }, [selectedDepartementId]);

  const renderDepartement = (departement) => (
    <li key={departement.id} style={{ listStyleType: "none" }}>
      <div className={`department-item ${departement.id === selectedDepartementId ? "selected" : ""}`}>
        <div className="department-item-content">
          {departement.children && departement.children.length > 0 && (
            <button className="expand-button" onClick={() => toggleExpand(departement.id)}>
              {expandedDepartements[departement.id] ? <FaMinus size={14} /> : <FaPlus size={14} />}
            </button>
          )}
          {(!departement.children || departement.children.length === 0) && (
            <div style={{ width: "24px", marginRight: "8px" }}></div>
          )}

          <span
            onClick={() => handleDepartementClick(departement.id, departement.nom)}
            className={`common-text ${selectedDepartementId === departement.id ? "selected" : ""}`}
          >
            <IoFolderOpenOutline size={18} />
            {departement.nom}
          </span>
        </div>
      </div>

      {expandedDepartements[departement.id] && departement.children && departement.children.length > 0 && (
        <ul className="sub-departments">{departement.children.map((child) => renderDepartement(child))}</ul>
      )}
    </li>
  );

  const [filterOptions, setFilterOptions] = useState({
    filters: [
      { key: "poste", label: "Poste", type: "select", value: "", options: [], placeholder: "Tous" },
      { key: "domaine", label: "Domaine", type: "select", value: "", options: [], placeholder: "Tous" },
      { key: "grade", label: "Grade", type: "select", value: "", options: [], placeholder: "Tous" },
      {
        key: "statut",
        label: "Statut",
        type: "select",
        value: "",
        options: [
          { label: "Actif", value: "Actif" },
          { label: "Vacant", value: "Vacant" },
        ],
        placeholder: "Tous",
      },
      { key: "niveau", label: "Niveau", type: "select", value: "", options: [], placeholder: "Tous" },
    ],
  });

  const selectedDeptName = useMemo(() => {
    if (selectedDepartementName) return normalizeValue(selectedDepartementName);
    if (!selectedDepartementId) return "";
    const findDepartment = (list, id) => {
      for (let dept of list) {
        if (dept.id === id) return dept;
        if (dept.children && dept.children.length > 0) {
          const found = findDepartment(dept.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    const found = findDepartment(departements, selectedDepartementId);
    if (found?.nom) return normalizeValue(found.nom);
    return "";
  }, [selectedDepartementName, selectedDepartementId, departements]);

  const hasSelectedDepartement = Boolean(selectedDepartementId || selectedDeptName);

  const departmentIdSet = useMemo(() => {
    if (!hasSelectedDepartement) return new Set();

    const ids = [];
    const addIds = (dept) => {
      if (!dept) return;
      ids.push(dept.id);
      if (includeSubDepartments && dept.children && dept.children.length > 0) {
        dept.children.forEach(addIds);
      }
    };
    const findDepartment = (list, id) => {
      for (let dept of list) {
        if (dept.id === id) return dept;
        if (dept.children && dept.children.length > 0) {
          const found = findDepartment(dept.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    if (selectedDepartementId) {
      const target = findDepartment(departements, selectedDepartementId);
      addIds(target);
    }

    return new Set(ids.map((id) => String(id)));
  }, [hasSelectedDepartement, includeSubDepartments, departements, selectedDepartementId]);

  const scopedPositions = useMemo(() => {
    if (!hasSelectedDepartement || !departmentIdSet.size) return [];

    return positions.filter((row) => {
      const rowDeptId =
        row?.departement_id ??
        row?.departementId ??
        row?.departement?.id ??
        row?.unite?.departement_id ??
        row?.unite?.departement?.id ??
        null;
      return rowDeptId != null && departmentIdSet.has(String(rowDeptId));
    });
  }, [positions, hasSelectedDepartement, departmentIdSet]);

  useEffect(() => {
    const postes = [...new Set(scopedPositions.map((row) => row.poste).filter(Boolean))];
    const domaines = [...new Set(scopedPositions.map((row) => row.domaine).filter(Boolean))];
    const gradesOptions = [...new Set(scopedPositions.map((row) => row.grade).filter(Boolean))];
    const niveaux = [...new Set(scopedPositions.map((row) => row.niveau).filter(Boolean))];

    setFilterOptions((prev) => ({
      ...prev,
      filters: prev.filters.map((filter) => {
        let options = filter.options ?? [];

        if (filter.key === "poste") {
          options = postes.map((value) => ({ label: value, value }));
        } else if (filter.key === "domaine") {
          options = domaines.map((value) => ({ label: value, value }));
        } else if (filter.key === "grade") {
          options = gradesOptions.map((value) => ({ label: value, value }));
        } else if (filter.key === "niveau") {
          options = niveaux.map((value) => ({ label: value, value }));
        }

        if (filter.type === "select" && filter.value) {
          const exists = options.some((opt) => normalizeValue(opt.value) === normalizeValue(filter.value));
          if (!exists) {
            return { ...filter, value: "", options };
          }
        }

        return { ...filter, options };
      }),
    }));
  }, [scopedPositions]);

  const applyFilters = useCallback(
    (rows) =>
      rows.filter((row) => {
        return filterOptions.filters.every((filter) => {
          if (filter.type !== "select" || !filter.value) return true;
          return normalizeValue(row[filter.key]) === normalizeValue(filter.value);
        });
      }),
    [filterOptions.filters]
  );

  const normalizedGlobalSearch = normalizeValue(searchQuery);

  const filteredPositions = useMemo(() => {
    let filtered = scopedPositions;

    filtered = applyFilters(filtered);

    if (normalizedGlobalSearch) {
      filtered = filtered.filter((row) =>
        [row.poste, row.departement, row.grade, row.statut, row.niveau]
          .filter(Boolean)
          .some((value) => normalizeValue(value).includes(normalizedGlobalSearch))
      );
    }

    return filtered;
  }, [scopedPositions, applyFilters, normalizedGlobalSearch]);

  const visibleColumns = useMemo(() => {
    return allColumns.filter((col) => columnVisibility[col.key]);
  }, [allColumns, columnVisibility]);

  const iconButtonStyle = {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.2s ease",
  };

  const CustomMenu = React.forwardRef(({ className, "aria-labelledby": labeledBy }, menuRef) => {
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
      >
        <Form>
          {allColumns.map((column) => (
            <Form.Check
              key={column.key}
              type="checkbox"
              id={`checkbox-${column.key}`}
              label={column.label}
              checked={columnVisibility[column.key]}
              onChange={() => handleColumnsChange(column.key)}
            />
          ))}
        </Form>
      </div>
    );
  });

  const handleColumnsChange = useCallback((column) => {
    setColumnVisibility((prev) => {
      const newVisibility = { ...prev, [column]: !prev[column] };
      localStorage.setItem("postesColumnVisibility", JSON.stringify(newVisibility));
      return newVisibility;
    });
  }, []); // Remove unused dependency

  const handleAssignEmployee = useCallback(async (employeeId, employeeName) => {
    if (!selectedPoste?.id) {
       Swal.fire("Attention", "Veuillez sélectionner un poste.", "warning");
       return;
    }

    setAssigningEmployeeId(employeeId);
    try {
        await apiClient.post(`/postes/${selectedPoste.id}/assign-employe`, {
            employe_id: employeeId
        });
        
        Swal.fire({
            title: "Succès",
            text: `L'employé ${employeeName} a été assigné au poste avec succès.`,
            icon: "success",
            timer: 2000
        });
        
        // Refresh positions to reflect changes
        fetchPostes();
        setAiSuggestions((prev) =>
          prev.filter((employee) => (employee.id ?? employee.employee_id) !== employeeId)
        );
        fetchAiSuggestions(selectedPoste.id);
        
        // Remove employee from suggestions if desired (optional)
        // For now just refresh
    } catch (error) {
        console.error("ASSIGN_ERROR", error);
        Swal.fire("Erreur", "Impossible d'assigner l'employé.", "error");
    } finally {
        setAssigningEmployeeId(null);
    }
  }, [selectedPoste, fetchPostes, fetchAiSuggestions]);
  const handleAddNewPoste = useCallback(() => {
    if (!hasSelectedDepartement || showAddForm) return;
    setSelectedPoste(null);
    setEditingPostId(null);
    setShowProfileDrawer(false);
    setIsSuggestionOpen(false);
    setDetailsPosteId(null);
    setShowAiDetailsDrawer(false);
    setSelectedAiPosteEmployee(null);
    setShowAddForm(true);
  }, [hasSelectedDepartement, showAddForm]);

  const handleEditPoste = useCallback((poste) => {
    setSelectedPoste(poste);
    setEditingPostId(poste.id);
    setShowProfileDrawer(false);
    setIsSuggestionOpen(false);
    setDetailsPosteId(null);
    setShowAiDetailsDrawer(false);
    setSelectedAiPosteEmployee(null);
    setShowAddForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedPoste(null);
    setEditingPostId(null);
    setShowAddForm(false);
  }, []);

  const handleOpenSuggestionPanel = useCallback((poste) => {
    if (!poste) return;
    setSelectedPoste(poste);
    setDetailsPosteId(poste.id);
    setIsSuggestionOpen(true);
    setShowProfileDrawer(false);
    setSelectedAiEmployee(null);
    setShowAiDetailsDrawer(false);
    setSelectedAiPosteEmployee(null);
  }, []);

  const handleCloseSuggestionPanel = useCallback(() => {
    setIsSuggestionOpen(false);
    setDetailsPosteId(null);
    setSelectedPoste(null);
    setSelectedAiEmployee(null);
    setShowProfileDrawer(false);
    setShowAiDetailsDrawer(false);
    setSelectedAiPosteEmployee(null);
    setAiSuggestions([]);
  }, []);


  const handleDeletePoste = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action supprimera définitivement le poste.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
      });

      if (!result.isConfirmed) return;

      try {
        await apiClient.delete(`/postes/${id}`);
        setPositions((prev) => prev.filter((item) => item.id !== id));
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
        Swal.fire("Supprimé", "Le poste a été supprimé.", "success");
        fetchPostes();
      } catch (error) {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message ||
          (status === 409
            ? "Impossible de supprimer : des employés sont assignés à ce poste."
            : "Une erreur est survenue lors de la suppression.");
        Swal.fire(status === 409 ? "Suppression bloquée" : "Erreur", message, "error");
      }
    },
    [fetchPostes]
  );

  const handlePosteAdded = useCallback((poste) => {
    if (poste) {
      setPositions((prev) => [...prev, poste]);
    }
    setEditingPostId(null);
    setShowAddForm(false);
    fetchPostes(); 
  }, [fetchPostes]);

  const handlePosteUpdated = useCallback((poste) => {
    if (poste?.id) {
      setPositions((prev) => prev.map((item) => (item.id === poste.id ? { ...item, ...poste } : item)));
    }
    setEditingPostId(null);
    setShowAddForm(false);
    fetchPostes(); 
  }, [fetchPostes]);

  const handleSelectAllChange = useCallback(
    (eventOrChecked) => {
      const checked =
        typeof eventOrChecked === "boolean"
          ? eventOrChecked
          : Boolean(eventOrChecked?.target?.checked);

      if (checked) {
        setSelectedItems(filteredPositions.map((item) => item.id));
      } else {
        setSelectedItems([]);
      }
    },
    [filteredPositions]
  );

  const handleCheckboxChange = useCallback((id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (!selectedItems.length) return;

    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    const deletions = await Promise.allSettled(
      selectedItems.map((id) => apiClient.delete(`/postes/${id}`))
    );

    const failed = deletions.filter((res) => res.status === "rejected");
    const succeededIds = deletions
      .map((res, index) => (res.status === "fulfilled" ? selectedItems[index] : null))
      .filter(Boolean);

    if (succeededIds.length) {
      setPositions((prev) => prev.filter((item) => !succeededIds.includes(item.id)));
    }
    setSelectedItems([]);
    fetchPostes();

    if (failed.length) {
      const any409 = failed.some((res) => res.reason?.response?.status === 409);
      Swal.fire(
        any409 ? "Suppression partielle" : "Erreur",
        any409
          ? "Certains postes n'ont pas pu être supprimés (employés assignés)."
          : "Une erreur est survenue lors de la suppression.",
        any409 ? "warning" : "error"
      );
      return;
    }

    Swal.fire("Supprimés!", "Les postes ont été supprimés.", "success");
  }, [selectedItems, fetchPostes]);

  const handleChangePage = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

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

  const handleResetFilters = useCallback(() => {
    setFilterOptions((prev) => ({
      ...prev,
      filters: prev.filters.map((filter) => ({ ...filter, value: "" })),
    }));
    setCurrentPage(0);
  }, []);

  const handleFiltersToggle = (isVisible) => {
    if (isVisible) {
      setFiltersVisible(true);
    } else {
      setTimeout(() => {
        setFiltersVisible(false);
      }, 300);
    }
  };

  const toggleRowExpansion = useCallback(
    (id) => {
      setExpandedPosteId((prev) => {
        if (prev === id) {
           // If clicking the same row -> Collapse & Clear Selection
           // We need to schedule these updates outside of this pure function if possible,
           // but for simplicity in this codebase, we just trigger them here.
           // Note: In strict mode, this might run twice, but setting null/false is idempotent.
           setTimeout(() => {
             setSelectedPoste(null);
             setShowAddForm(false);
             setShowProfileDrawer(false);
             setSelectedAiEmployee(null);
             setShowAiDetailsDrawer(false);
             setSelectedAiPosteEmployee(null);
           }, 0);
           return null;
        }

        // If clicking a new row -> Expand & Select
        const selected = filteredPositions.find((row) => row.id === id) || null;
        setTimeout(() => {
             setSelectedPoste(selected);
             setShowAddForm(false);
             setShowProfileDrawer(false);
             setSelectedAiEmployee(null);
             // Fermer le drawer de profil lors de la sélection d'un nouveau poste
             setShowAiDetailsDrawer(false);
             setSelectedAiPosteEmployee(null);
        }, 0);
        return id;
      });
    },
    [filteredPositions]
  );

  const expandedRows = useMemo(
    () => (expandedPosteId ? { [expandedPosteId]: true } : {}),
    [expandedPosteId]
  );

  const renderExpandedRow = (item) => (
    <div style={{ padding: "12px 24px", backgroundColor: "#fcfdfe", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ fontWeight: 700, marginBottom: "12px", fontSize: "0.9rem", color: "#1e293b" }}>Compétences requises</div>
      <div className="career-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {item.competences && item.competences.length > 0 ? (
          item.competences.map((skill, index) => (
            <span key={`${item.id}-skill-${index}-${skill}`} style={{
              backgroundColor: "#e6f2f2",
              color: "#2c767c",
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              border: "1px solid rgba(44, 118, 124, 0.1)"
            }}>
              {skill}
            </span>
          ))
        ) : (
          <span className="text-muted" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>Aucune compétence renseignée.</span>
        )}
      </div>
    </div>
  );

  const getRowStyle = useCallback(
    (item) => ({
      backgroundColor: (item.id === expandedPosteId || item.id === editingPostId || item.id === detailsPosteId) ? "#f0fdf9" : "white",
      cursor: "pointer",
      borderLeft: (item.id === expandedPosteId || item.id === editingPostId || item.id === detailsPosteId) ? "4px solid #2c767c" : "none",
      "&:hover": {
        backgroundColor: (item.id === expandedPosteId || item.id === editingPostId || item.id === detailsPosteId) ? "#ecfdf5" : "#f9fafb",
      },
    }),
    [expandedPosteId, editingPostId, detailsPosteId]
  );


  const handleOpenProfile = useCallback(
    async (employee) => {
      if (!employee) return;
      setShowAddForm(false);
      setSelectedAiEmployee(employee);
      setShowProfileDrawer(true);

      const employeeId =
        employee.id ??
        employee.employe_id ??
        employee.employeId ??
        employee.employee_id ??
        null;
      if (!employeeId) return;

      try {
        const response = await apiClient.get(`/employes/${employeeId}`);
        if (DEBUG_PROFILE) {
          console.log("EMPLOYEE_PROFILE_RESPONSE", response?.data);
        }
        const payload = response?.data?.data ?? response?.data ?? {};
        setSelectedAiEmployee((prev) => ({
          ...prev,
          ...payload,
        }));
      } catch (error) {
        if (error?.response?.status === 404) {
          try {
            const fallbackResponse = await apiClient.get(`/employees/${employeeId}`);
            if (DEBUG_PROFILE) {
              console.log("EMPLOYEE_PROFILE_FALLBACK_RESPONSE", fallbackResponse?.data);
            }
            const payload = fallbackResponse?.data?.data ?? fallbackResponse?.data ?? {};
            setSelectedAiEmployee((prev) => ({
              ...prev,
              ...payload,
            }));
            return;
          } catch (fallbackError) {
            console.error("EMPLOYEE_PROFILE_FALLBACK_ERROR", fallbackError);
          }
        }
        console.error("EMPLOYEE_PROFILE_ERROR", error);
      }
    },
    []
  );

  const handleCloseProfile = useCallback(() => {
    setShowProfileDrawer(false);
    setSelectedAiEmployee(null);
  }, []);

  useEffect(() => {
    if (!isSuggestionOpen || !detailsPosteId) {
      setAiSuggestions([]);
      return;
    }
    fetchAiSuggestions(detailsPosteId);
  }, [isSuggestionOpen, detailsPosteId, fetchAiSuggestions]);

  useEffect(() => {
    const payload = selectedPoste
      ? {
        id: selectedPoste.id,
        poste: selectedPoste.poste ?? selectedPoste.nom ?? "",
        competences: Array.isArray(selectedPoste.competences)
          ? selectedPoste.competences.map(getSkillName).filter(Boolean)
          : [],
      }
      : null;

    try {
      if (payload) {
        localStorage.setItem("selectedPosteForSkills", JSON.stringify(payload));
      } else {
        localStorage.removeItem("selectedPosteForSkills");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("postes-selected", { detail: payload }));
      }
    } catch (error) {
      console.error("POSTE_STORAGE_ERROR", error);
    }
  }, [selectedPoste]);

  const showAICard = !showAddForm && !showProfileDrawer && !showAiDetailsDrawer && isSuggestionOpen;
  const isSidePanelOpen = showAddForm || showProfileDrawer || showAICard || showAiDetailsDrawer;
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12, minHeight: "calc(100vh - 130px)" }}>
          <div className="departement_home1" style={{ gap: "8px", padding: "8px" }}>
            <ul className="departement_list">
              <li style={{ listStyleType: "none" }}>
                <div
                  className="checkbox-container"
                  style={{
                    marginTop: "5%",
                    width: "90%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "5%",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeSubDepartments}
                    onChange={(event) => setIncludeSubDepartments(event.target.checked)}
                    id="include-sub-deps-postes"
                  />
                  <label htmlFor="include-sub-deps-postes">Inclure les sous-départements</label>
                </div>
              </li>
              <div className="separator" style={{ marginTop: "-1%" }}></div>
              {departements.length === 0 && (
                <li style={{ listStyleType: "none", padding: "1rem", color: "#666" }}>
                  Aucun département trouvé
                </li>
              )}
              {departements.map((departement) => renderDepartement(departement))}
            </ul>

            <div style={{ flex: 1, width: "100%" }}>
              <style>{`
                .with-split-view .addemp-overlay,
                .with-split-view .add-cnss-container,
                .with-split-view .add-accident-container,
                .with-split-view .side-panel-container,
                .with-split-view .cnss-side-panel {
                  position: relative !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                  box-shadow: none !important;
                  animation: none !important;
                  border-radius: 0 !important;
                }
              `}</style>

              <div
                className="with-split-view"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gap: "24px",
                  boxSizing: "border-box",
                  alignItems: "stretch",
                  height: "calc(100vh - 150px)", // Restore fixed height for the grid container
                  overflow: "hidden", // Ensure container doesn't scroll, only children do
                }}
              >
                <div
                  style={{
                    gridColumn: isSidePanelOpen ? "span 8" : "span 12",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    padding: "18px 22px 20px",
                    height: "100%", // Take full height of container
                    overflowY: "auto", // Allow scrolling inside the panel
                  }}
                >
                  <div className="section-header mb-3">
                    <div className="d-flex align-items-center justify-content-between" style={{ gap: 24 }}>
                      <div>
                        {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#2c767c",
                          display: "inline-block",
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1f2937" }}>Postes</span>
                      </div> */}
                        <SectionTitle icon="fas fa-briefcase" text="Postes" />
                        {!showAddForm && (
                          <p className="section-description text-muted mb-0">
                            {filteredPositions.length} poste{filteredPositions.length !== 1 ? "s" : ""} affiché{filteredPositions.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "12px" }}>
                        <FontAwesomeIcon
                          onClick={() => handleFiltersToggle(!filtersVisible)}
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
                            if (!hasSelectedDepartement) return;
                            handleAddNewPoste();
                          }}
                          className={`d-flex align-items-center justify-content-center ${!hasSelectedDepartement ? "disabled-btn" : ""}`}
                          size="sm"
                          style={{
                            minWidth: "182px",
                            height: "38px",
                            backgroundColor: hasSelectedDepartement ? "#3a8a90" : "#9ca3af",
                            border: "none",
                            borderRadius: "8px",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            boxShadow: hasSelectedDepartement ? "0 3px 8px rgba(58, 138, 144, 0.28)" : "none",
                          }}
                        >
                          <FaPlusCircle className="me-2" />
                          Ajouter un poste
                        </Button>

                        <Dropdown ref={dropdownRef} show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                          <Dropdown.Toggle
                            as="button"
                            id="dropdown-visibility"
                            title="Visibilité Colonnes"
                            style={iconButtonStyle}
                          >
                            <FontAwesomeIcon icon={faSliders} style={{ width: 18, height: 18, color: "#4b5563" }} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu as={CustomMenu} />
                        </Dropdown>
                      </div>
                    </div>
                  </div>

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
                          alignItems: "center",
                          gap: "30px",
                          padding: "15px 25px",
                          overflowX: "auto",
                          flexWrap: "nowrap",
                          width: "100%",
                          WebkitOverflowScrolling: "touch",
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          className="filters-icon-section"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexShrink: 0,
                            marginRight: "5px",
                            position: "relative",
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a90a4" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                          </svg>
                          <span className="filters-title">Filtres</span>
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            style={{
                              border: "1px solid #cbd5e1",
                              background: "#fff",
                              color: "#334155",
                              borderRadius: "6px",
                              height: "30px",
                              padding: "0 10px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              marginLeft: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Réinitialiser
                          </button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            flexWrap: "nowrap",
                            flexShrink: 0,
                          }}
                        >
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
                                  onChange={(event) => handleFilterChange(filter.key, event.target.value)}
                                  className="filter-input"
                                  style={{
                                    minWidth: 110,
                                    maxWidth: 150,
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
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <ExpandRTable
                    columns={visibleColumns}
                    data={filteredPositions}
                    searchTerm={normalizedGlobalSearch}
                    loading={loadingPositions}
                    loadingText="Chargement des postes..."
                    selectAll={selectedItems.length === filteredPositions.length && filteredPositions.length > 0}
                    selectedItems={selectedItems}
                    handleSelectAllChange={handleSelectAllChange}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDeleteSelected={handleDeleteSelected}
                    rowsPerPage={itemsPerPage}
                    page={currentPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    handleEdit={handleEditPoste}
                    handleDelete={handleDeletePoste}
                    renderActions={(item) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSuggestionPanel(item);
                        }}
                        aria-label="Voir détails"
                        title="Voir détails"
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} style={{ color: "#2c767c", fontSize: "14px" }} />
                      </button>
                    )}
                    onRowClick={(item) => toggleRowExpansion(item.id)}
                    toggleRowExpansion={toggleRowExpansion}
                    expandedRows={expandedRows}
                    renderExpandedRow={renderExpandedRow}
                    getRowStyle={getRowStyle}
                  />
                </div>

                {showAddForm && (
                  <div
                    style={{
                      height: "100%", // Fill grid height
                      gridColumn: "span 4",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                      position: "relative",
                      overflowY: "auto", // Enable scrolling directly on this container
                    }}
                  >
                    <AddPoste
                      selectedDepartementId={selectedDepartementId}
                      selectedDepartementName={selectedDepartementName}
                      togglePosteForm={handleCloseForm}
                      onPosteAdded={handlePosteAdded}
                      selectedPoste={selectedPoste}
                      onPosteUpdated={handlePosteUpdated}
                      grades={grades}
                      competences={competencesData}
                      loadingGrades={loadingGrades}
                      loadingCompetences={loadingCompetences}
                      onCompetencesChanged={fetchCompetences}
                    />
                  </div>
                )}


                {showProfileDrawer && (
                  <div style={{ height: "100%", gridColumn: "span 4", position: "relative" }}>
                    <style>{`
                      .employee-drawer-wrapper {
                        height: 100%;
                        overflow: hidden;
                      }
                      .employee-drawer-wrapper {
                        height: 100%; /* Ensure wrapper is full height */
                        overflow: hidden; /* Prevent wrapper from scrolling */
                      }
                      
                      .employee-drawer-wrapper > div {
                        width: 100% !important;
                        flex: 1 !important; /* Allow growing */
                        box-shadow: 0 2px 12px rgba(0,0,0,0.07) !important;
                        border-radius: 10px !important;
                        border: 1px solid #e2e8f0 !important;
                        height: 100% !important; 
                        overflow: hidden !important; /* Hide overflow on the container, let internal body scroll */
                        display: flex !important;
                        flex-direction: column !important;
                      }
                    `}</style>
                    <div className="employee-drawer-wrapper">
                      <EmployeeProfileDrawer
                        employee={selectedAiEmployee}
                        onClose={handleCloseProfile}
                      />
                    </div>
                  </div>
                )}

                {showAICard && (
                  <div
                    style={{
                      height: "100%",
                      gridColumn: "span 4",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden", 
                    }}
                  >
                    <div className="career-card" style={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: "none", border: "none", background: "transparent", overflow: "hidden" }}>
                      <div
                        className="career-card-header"
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          padding: "18px 22px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h5 className="career-card-title" style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                          Suggestion - Occupation de poste
                        </h5>
                        <button
                          type="button"
                          className="cnss-close-btn"
                          onClick={handleCloseSuggestionPanel}
                          aria-label="Fermer"
                        >
                          ×
                        </button>
                      </div>
                      <div className="career-card-body" style={{ padding: "20px 22px", flex: 1, overflowY: "auto" }}>
                        {!selectedPoste && (
                          <div className="text-center py-4">
                            <span className="text-muted" style={{ fontSize: "0.9rem" }}>Sélectionnez un poste pour voir les suggestions .</span>
                          </div>
                        )}
                        {selectedPoste && loadingAiSuggestions && (
                          <div className="text-center py-4">
                            <span className="text-muted" style={{ fontSize: "0.9rem" }}>Chargement des suggestions...</span>
                          </div>
                        )}
                        {selectedPoste && !loadingAiSuggestions && aiSuggestions.length === 0 && (
                          <div className="text-center py-4">
                            <span className="text-muted" style={{ fontSize: "0.9rem" }}>Aucune suggestion disponible pour ce poste.</span>
                          </div>
                        )}
                        {selectedPoste && !loadingAiSuggestions && aiSuggestions.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {aiSuggestions.map((employee) => {
                              const matchLevel =
                                employee.match_level ||
                                (employee.score >= 71 ? "high" : employee.score >= 31 ? "medium" : "low");
                              const matchLabel =
                                matchLevel === "high" ? "Match élevé" : matchLevel === "medium" ? "Match moyen" : "Match faible";
                              const matchBg =
                                matchLevel === "high" ? "#dcfce7" : matchLevel === "medium" ? "#fef3c7" : "#fee2e2";
                              const matchColor =
                                matchLevel === "high" ? "#166534" : matchLevel === "medium" ? "#92400e" : "#991b1b";

                              return (
                                <div
                                  key={employee.id}
                                  style={{
                                    border: "1px solid #f1f5f9",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    background: "#fcfdfe",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                    <div>
                                      <div style={{ fontWeight: 700, color: "#334155", fontSize: "0.95rem" }}>{employee.full_name || employee.nom}</div>
                                      <div className="text-muted" style={{ fontSize: "0.82rem", marginTop: "4px" }}>
                                        Compatibilité : <span style={{ fontWeight: 600, color: "#2c767c" }}>{employee.score}%</span>
                                      </div>
                                    </div>
                                    <span
                                      style={{
                                        padding: "4px 10px",
                                        borderRadius: "4px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        backgroundColor: matchBg,
                                        color: matchColor,
                                      }}
                                    >
                                      {matchLabel}
                                    </span>
                                  </div>
                                  <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      style={{
                                        backgroundColor: "#fefefe",
                                        color: "#2c767c",
                                        borderRadius: "8px",
                                        padding: "5px 14px",
                                        border: "1px solid #2c767c",
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        transition: "all 0.2s",
                                      }}
                                      onClick={() => {
                                        setSelectedAiPosteEmployee(employee);
                                        setShowAiDetailsDrawer(true);
                                      }}
                                    >
                                      Voir analyse
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm"
                                      onClick={() => handleAssignEmployee(employee.id, `${employee.full_name || employee.nom}`)}
                                      disabled={assigningEmployeeId === employee.id}
                                      style={{
                                        backgroundColor: "#2c767c",
                                        color: "white",
                                        borderRadius: "8px",
                                        padding: "5px 14px",
                                        border: "none",
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        opacity: assigningEmployeeId === employee.id ? 0.7 : 1,
                                      }}
                                    >
                                      {assigningEmployeeId === employee.id ? "..." : "Assigner"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showAiDetailsDrawer && selectedAiPosteEmployee && selectedPoste && (
                  <div
                    style={{
                      height: "100%",
                      gridColumn: "span 4",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                      position: "relative",
                      overflowY: "auto",
                    }}
                  >
                    <PosteSuggestionsDrawer
                      employee={selectedAiPosteEmployee}
                      poste={selectedPoste}
                      onClose={() => {
                        setShowAiDetailsDrawer(false);
                        setSelectedAiPosteEmployee(null);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PositionsGrades;

