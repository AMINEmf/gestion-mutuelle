import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import "../Employe/DepartementManager.css";
import "../AffiliationMutuelle/AffiliationMutuelleManager.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import DossierMutuelleTable from "./DossierMutuelleTable";
import { IoFolderOpenOutline } from "react-icons/io5";
import { FaMinus, FaPlus } from "react-icons/fa6";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

function DossierMutuelle() {
  const [departements, setDepartements] = useState([]);
  const [selectedDepartementId, setSelectedDepartementId] = useState(null);
  const [selectedDepartementName, setSelectedDepartementName] = useState(null);
  const [includeSubDepartments, setIncludeSubDepartments] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedDepartements, setExpandedDepartements] = useState({});
  const departementRef = useRef({});

  const { setTitle, searchQuery, setSearchQuery, clearActions, setShowSearch } = useHeader();
  const { dynamicStyles } = useOpen();

  useEffect(() => {
    setTitle("Dossier Mutuelle");
    setShowSearch(true);
    setSearchQuery(""); // ✅ Clear search to avoid filtering out results from previous page
    return () => {
      clearActions();
      setShowSearch(true);
    };
  }, [setTitle, clearActions, setShowSearch, setSearchQuery]);

  const fetchDepartmentHierarchy = useCallback(async () => {
    try {
      const response = await api.get("/departements/hierarchy");
      const data = response.data;
      setDepartements(Array.isArray(data) ? data : []);
      if (Array.isArray(data)) {
        localStorage.setItem("departmentHierarchy", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la hiérarchie:", error);
    }
  }, []);

  useEffect(() => {
    const departmentsFromStorage = localStorage.getItem("departmentHierarchy");
    if (departmentsFromStorage) {
      setDepartements(JSON.parse(departmentsFromStorage));
    }
    fetchDepartmentHierarchy();
  }, [fetchDepartmentHierarchy]);

  const handleDepartementClick = (departementId, departementName) => {
    setSelectedDepartementId(departementId);
    setSelectedDepartementName(departementName);
  };

  const toggleExpand = (departementId) => {
    setExpandedDepartements((prev) => ({
      ...prev,
      [departementId]: !prev[departementId],
    }));
  };

  const renderDepartement = (departement, level = 0) => (
    <li key={departement.id} style={{ listStyleType: "none", paddingLeft: level > 0 ? "20px" : "0" }}>
      <div
        className={`department-item ${departement.id === selectedDepartementId ? "selected" : ""}`}
        ref={(el) => (departementRef.current[departement.id] = el)}
      >
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

      {expandedDepartements[departement.id] &&
        departement.children &&
        departement.children.length > 0 && (
          <ul className="sub-departments" style={{ paddingLeft: 0 }}>
            {departement.children.map((child) => renderDepartement(child, level + 1))}
          </ul>
        )}
    </li>
  );

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div className="departement_home1">
            <ul
              className="departement_list"
              style={{
                margin: 0,
                padding: 0,
                flex: "0 0 20%",
                minWidth: "280px",
                overflowY: "auto",
                minHeight: 0,
              }}
            >
              <li style={{ listStyleType: "none" }}>
                <div
                  className="checkbox-container"
                  style={{
                    marginTop: "16px",
                    width: "90%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "5%",
                    marginBottom: "16px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includeSubDepartments}
                    onChange={(e) => setIncludeSubDepartments(e.target.checked)}
                    id="include-sub-deps"
                  />
                  <label htmlFor="include-sub-deps" style={{ marginLeft: "8px", fontSize: "0.9rem", userSelect: "none", cursor: "pointer" }}>Inclure sous-dépts</label>
                </div>
              </li>
              <div className="separator" style={{ marginTop: "-1%" }}></div>
              {departements.map((departement) => renderDepartement(departement))}
            </ul>

            <DossierMutuelleTable
              departementId={selectedDepartementId}
              departementName={selectedDepartementName}
              includeSubDepartments={includeSubDepartments}
              globalSearch={searchQuery}
              filtersVisible={filtersVisible}
              handleFiltersToggle={setFiltersVisible}
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DossierMutuelle;
