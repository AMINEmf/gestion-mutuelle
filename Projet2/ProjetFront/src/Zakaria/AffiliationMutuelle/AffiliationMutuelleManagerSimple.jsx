import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../Employe/DepartementManager.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AffiliationMutuelleTable from "./AffiliationMutuelleTable";
import AddAffiliationMutuelle from "./AddAffiliationMutuelle";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { IoFolderOpenOutline } from "react-icons/io5";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

function AffiliationMutuelleManagerSimple() {
  const [departements, setDepartements] = useState([]);
  const [selectedDepartementId, setSelectedDepartementId] = useState(null);
  const [selectedDepartementName, setSelectedDepartementName] = useState(null);
  const [isAddingAffiliation, setIsAddingAffiliation] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [includeSubDepartments, setIncludeSubDepartments] = useState(false);
  const [expandedDepartements, setExpandedDepartements] = useState({});
  const departementRef = useRef({});

  const { setTitle, searchQuery, clearActions, setOnPrint, setOnExportPDF, setOnExportExcel } = useHeader();
  const { dynamicStyles } = useOpen();
  const affiliationTableRef = useRef(null);

  useEffect(() => {
    setTitle("Gestion des Affiliations Mutuelles");
    
    if (selectedDepartementId) {
      setOnPrint(() => () => affiliationTableRef.current?.handlePrint());
      setOnExportPDF(() => () => affiliationTableRef.current?.exportToPDF());
      setOnExportExcel(() => () => affiliationTableRef.current?.exportToExcel());
    } else {
      setOnPrint(null);
      setOnExportPDF(null);
      setOnExportExcel(null);
    }

    return () => clearActions();
  }, [setTitle, clearActions, selectedDepartementId, setOnPrint, setOnExportPDF, setOnExportExcel]);

  const fetchDepartmentHierarchy = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/departements/hierarchy');
      setDepartements(response.data);
      localStorage.setItem('departmentHierarchy', JSON.stringify(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération de la hiérarchie des départements:", error);
    }
  }, []);

  useEffect(() => {
    const departmentsFromStorage = localStorage.getItem('departmentHierarchy');
    if (departmentsFromStorage) {
      setDepartements(JSON.parse(departmentsFromStorage));
    }
    fetchDepartmentHierarchy();
  }, [fetchDepartmentHierarchy]);

  const handleDepartementClick = (departementId, departementName) => {
    setSelectedDepartementId(departementId);
    setSelectedDepartementName(departementName);
  };

  const handleFiltersToggle = (isVisible) => {
    if (isVisible) {
      setFiltersVisible(true);
    } else {
      setTimeout(() => {
        setFiltersVisible(false);
      }, 300);
    }
  };

  const toggleExpand = (departementId) => {
    setExpandedDepartements((prev) => ({
      ...prev,
      [departementId]: !prev[departementId],
    }));
  };

  const renderDepartement = (departement) => (
    <li key={departement.id} style={{ listStyleType: "none" }}>
      <div 
        className={`department-item ${departement.id === selectedDepartementId ? 'selected' : ''}`}
        ref={(el) => (departementRef.current[departement.id] = el)}
      >
        <div className="department-item-content">
          {departement.children && departement.children.length > 0 && (
            <button
              className="expand-button"
              onClick={() => toggleExpand(departement.id)}
            >
              {expandedDepartements[departement.id] ? (
                <FaMinus size={14} />
              ) : (
                <FaPlus size={14} />
              )}
            </button>
          )}
          {departement.children && departement.children.length === 0 && (
            <div style={{ width: "24px", marginRight: "8px" }}></div>
          )}
          {!departement.children && (
            <div style={{ width: "24px", marginRight: "8px" }}></div>
          )}
          
          <span
            onClick={() => handleDepartementClick(departement.id, departement.nom)}
            className={`common-text ${selectedDepartementId === departement.id ? 'selected' : ''}`}
          >
            <IoFolderOpenOutline size={18} />
            {departement.nom}
          </span>
        </div>
      </div>
      
      {expandedDepartements[departement.id] &&
        departement.children &&
        departement.children.length > 0 && (
          <ul className="sub-departments">
            {departement.children.map((child) => renderDepartement(child))}
          </ul>
        )}
    </li>
  );

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div className="departement_home1">
            <ul className="departement_list">
              <li style={{ listStyleType: "none" }}>
                <div className="checkbox-container" style={{ 
                  marginTop:'5%', 
                  width:'90%',
                  display: 'flex',
                  alignItems: 'center', 
                  justifyContent:'center',
                  marginLeft:'5%'
                }}>
                  <input
                    type="checkbox"
                    checked={includeSubDepartments}
                    onChange={(e) => setIncludeSubDepartments(e.target.checked)}
                    id="include-sub-deps"
                  />
                  <label htmlFor="include-sub-deps">Inclure les sous-départements</label>
                </div>
              </li>
              <div className="separator" style={{marginTop:'-1%'}}></div>
              {departements.map((departement) => renderDepartement(departement))}
            </ul>

            <AffiliationMutuelleTable
              departementId={selectedDepartementId}
              departementName={selectedDepartementName}
              isAddingAffiliation={isAddingAffiliation}
              setIsAddingAffiliation={setIsAddingAffiliation}
              includeSubDepartments={includeSubDepartments}
              departements={departements}
              getSubDepartmentIds={() => []}
              ref={affiliationTableRef}
              globalSearch={searchQuery}
              filtersVisible={filtersVisible}
              handleFiltersToggle={handleFiltersToggle}
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AffiliationMutuelleManagerSimple;