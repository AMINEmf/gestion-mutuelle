import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "../Employe/DepartementManager.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AffiliationMutuelleTable from "./AffiliationMutuelleTable";
import { IoFolderOpenOutline } from "react-icons/io5";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";

function MutuelleManager() {
  const [mutuelles, setMutuelles] = useState([]);
  const [isAddingAffiliation, setIsAddingAffiliation] = useState(false);
  const [selectedMutuelleId, setSelectedMutuelleId] = useState(null);
  const [selectedMutuelleName, setSelectedMutuelleName] = useState(null);

  const { setTitle, searchQuery, clearActions } = useHeader();
  const { dynamicStyles } = useOpen();

  // Référence vers le composant AffiliationMutuelleTable
  const affiliationTableRef = useRef(null);

  useEffect(() => {
    setTitle("Gestion des Affiliations Mutuelles");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  const fetchMutuelles = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/mutuelles');
      if (response.data.success && Array.isArray(response.data.data)) {
        setMutuelles(response.data.data);
        localStorage.setItem('mutuelles', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des mutuelles:", error);
      setMutuelles([]);
    }
  }, []);

  useEffect(() => {
    const mutuellesFromStorage = localStorage.getItem('mutuelles');
    if (mutuellesFromStorage) {
      setMutuelles(JSON.parse(mutuellesFromStorage));
    }
    fetchMutuelles();
  }, [fetchMutuelles]);

  const handleMutuelleClick = (mutuelleId, mutuelleName) => {
    if (mutuelleId) {
      setSelectedMutuelleId(mutuelleId);
      setSelectedMutuelleName(mutuelleName);
    }
  };

  const renderMutuelle = (mutuelle) => (
    <li key={mutuelle.id} style={{ listStyleType: "none" }}>
      <div 
        className={`department-item ${mutuelle.id === selectedMutuelleId ? 'selected' : ''}`}
      >
        <div className="department-item-content">
          <div style={{ width: "24px", marginRight: "8px" }}></div>
          <span
            onClick={() => handleMutuelleClick(mutuelle.id, mutuelle.nom)}
            className={`common-text ${selectedMutuelleId === mutuelle.id ? 'selected' : ''}`}
          >
            <IoFolderOpenOutline size={18} />
            {mutuelle.nom}
          </span>
        </div>
      </div>
    </li>
  );

  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleFiltersToggle = (isVisible) => {
    if (isVisible) {
      setFiltersVisible(true);
    } else {
      setTimeout(() => {
        setFiltersVisible(false);
      }, 300);
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div className="departement_home1">
            <ul className="departement_list">
              <li style={{ listStyleType: "none" }}>
                <div className="checkbox-container" style={{ marginTop:'5%', width:'90%',display: 'flex',alignItems: 'center', justifyContent:'center',marginLeft:'5%' }}>
                  <label htmlFor="filter-mutuelle">Filtrer par mutuelle</label>
                </div>
              </li>
              <div className="separator" style={{marginTop:'-1%'}}></div>
              {mutuelles.map((mutuelle) => renderMutuelle(mutuelle))}
            </ul>

            <AffiliationMutuelleTable
              departementId={selectedMutuelleId}
              departementName={selectedMutuelleName}
              onClose={() => setSelectedMutuelleId(null)}
              isAddingAffiliation={isAddingAffiliation}
              setIsAddingAffiliation={setIsAddingAffiliation}
              includeSubDepartments={false}
              getSubDepartmentIds={() => []}
              departements={[]}
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

export default MutuelleManager;
