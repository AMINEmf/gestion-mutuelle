import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useOpen } from "../../Acceuil/OpenProvider";
import { useHeader } from "../../Acceuil/HeaderContext";
import ConflitTable from "./ConflitTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel, faPrint, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../Style.css";

const ConflitManager = () => {
  const { dynamicStyles } = useOpen();
  const { setTitle } = useHeader();
  const [globalSearch, setGlobalSearch] = useState("");
  const [isAddingEmploye, setIsAddingEmploye] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [preloadedEmployees, setPreloadedEmployees] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    setTitle("Gestion des Conflits / Incidents");
  }, [setTitle]);

  // Précharger les employés dès le montage du composant
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/employes/light", { withCredentials: true })
      .then(res => {
        if (Array.isArray(res.data)) {
          setPreloadedEmployees(res.data);
        }
      })
      .catch(err => console.error("Error preloading employees", err));
  }, []);

  const handleExportPDF = () => {
    if (tableRef.current?.exportToPDF) {
      tableRef.current.exportToPDF();
    }
  };

  const handleExportExcel = () => {
    if (tableRef.current?.exportToExcel) {
      tableRef.current.exportToExcel();
    }
  };

  const handlePrint = () => {
    if (tableRef.current?.handlePrint) {
      tableRef.current.handlePrint();
    }
  };

  return (
    <div className="main-content" style={dynamicStyles}>
      <div className="main-content-inner" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header avec recherche et actions */}
        <div className="header-section mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: '16px' }}>
            {/* Barre de recherche */}
            <div className="search-container" style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ color: '#64748b' }} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un conflit..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderLeft: 'none',
                    padding: '10px 15px',
                  }}
                />
              </div>
            </div>

            {/* Boutons d'export */}
            <div className="d-flex gap-2">
              <button
                onClick={handleExportPDF}
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                style={{ borderRadius: '8px' }}
                title="Exporter en PDF"
              >
                <FontAwesomeIcon icon={faFilePdf} style={{ color: '#dc2626' }} />
                <span className="d-none d-md-inline">PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                style={{ borderRadius: '8px' }}
                title="Exporter en Excel"
              >
                <FontAwesomeIcon icon={faFileExcel} style={{ color: '#16a34a' }} />
                <span className="d-none d-md-inline">Excel</span>
              </button>
              <button
                onClick={handlePrint}
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                style={{ borderRadius: '8px' }}
                title="Imprimer"
              >
                <FontAwesomeIcon icon={faPrint} style={{ color: '#2563eb' }} />
                <span className="d-none d-md-inline">Imprimer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table des conflits */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          <ConflitTable
            ref={tableRef}
            globalSearch={globalSearch}
            isAddingEmploye={isAddingEmploye}
            setIsAddingEmploye={setIsAddingEmploye}
            filtersVisible={filtersVisible}
            handleFiltersToggle={setFiltersVisible}
            preloadedEmployees={preloadedEmployees}
          />
        </div>
      </div>
    </div>
  );
};

export default ConflitManager;
