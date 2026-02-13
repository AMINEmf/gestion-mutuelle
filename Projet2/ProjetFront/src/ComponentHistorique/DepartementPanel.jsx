import React, { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { IoFolderOpenOutline } from "react-icons/io5";
import { FaMinus, FaPlus } from "react-icons/fa6";
import "./DepartementPanel.css";

export const DepartmentPanel = memo(
  ({
    onSelectDepartment,
    selectedDepartmentId,
    includeSubDepartments,
    onIncludeSubDepartmentsChange,
    employees = [],
    selectedEmployee = null,
    selectedEmployees = new Set(),
    processedEmployees = new Set(),
    onSelectEmployee = () => {},
    onCheckEmployee = () => {},
    findDepartmentName = () => "",
    filtersVisible = false,
    compactLayout = false, // when true: only the department sidebar is shown
  }) => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedDepartments, setExpandedDepartments] = useState({});
    const [searchTerms, setSearchTerms] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const fetchDepartments = useCallback(async () => {
      setError(null);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/departements/hierarchy"
        );
        const data = response.data || [];
        const initialExpandedState = {};
        data.forEach((dept) => {
          if (dept.children && dept.children.length > 0) {
            initialExpandedState[dept.id] = false;
          }
        });
        setExpandedDepartments(initialExpandedState);
        setDepartments(data);
        localStorage.setItem("departmentPanelData", JSON.stringify(data));
      } catch (e) {
        setError("An error occurred while fetching departments. Please try again.");
        setDepartments([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      const departmentsFromStorage = localStorage.getItem("departmentPanelData");
      if (departmentsFromStorage) {
        const cached = JSON.parse(departmentsFromStorage);
        setDepartments(cached);
        const initialExpandedState = {};
        cached.forEach((dept) => {
          if (dept.children && dept.children.length > 0) {
            initialExpandedState[dept.id] = false;
          }
        });
        setExpandedDepartments(initialExpandedState);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      fetchDepartments();
    }, [fetchDepartments]);

    const handleSearchChange = (e) => {
      const terms = e.target.value
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      setSearchTerms(terms);
    };

    const toggleExpand = useCallback((departmentId, e) => {
      e.stopPropagation();
      setExpandedDepartments((prev) => ({
        ...prev,
        [departmentId]: !prev[departmentId],
      }));
    }, []);

    const filteredDepartments =
      searchTerms.length === 0
        ? departments
        : departments.filter((dept) =>
            searchTerms.some((t) => (dept.nom || "").toLowerCase().includes(t))
          );

    const renderDepartment = useCallback(
      (department) => {
        const hasChildren = department.children && department.children.length > 0;
        return (
          <li key={department.id} style={{ listStyleType: "none" }}>
            <div
              className={`department-item ${
                selectedDepartmentId === department.id ? "selected" : ""
              }`}
            >
              <div className="department-item-content">
                {hasChildren && (
                  <button
                    className="expand-button"
                    onClick={(e) => toggleExpand(department.id, e)}
                    aria-label={
                      expandedDepartments[department.id]
                        ? "Collapse department"
                        : "Expand department"
                    }
                  >
                    {expandedDepartments[department.id] ? <FaMinus /> : <FaPlus />}
                  </button>
                )}
                {!hasChildren && (
                  <div style={{ width: "24px", marginRight: "8px" }}></div>
                )}
                <span
                  className={`common-text ${
                    selectedDepartmentId === department.id ? "selected" : ""
                  }`}
                  onClick={() => onSelectDepartment(department.id)}
                >
                  <IoFolderOpenOutline />
                  {department.nom}
                </span>
              </div>
            </div>

            {expandedDepartments[department.id] && hasChildren && (
              <ul className="sub-departments">
                {department.children.map((child) => renderDepartment(child))}
              </ul>
            )}
          </li>
        );
      },
      [expandedDepartments, selectedDepartmentId, onSelectDepartment, toggleExpand]
    );

    const departmentListBlock = (
      <div
        className="departement_list"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: "0 0 100%",
          minWidth: "220px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1,
            paddingBottom: 8,
          }}
        >
          <div className="checkbox-container" style={{ marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={includeSubDepartments}
              onChange={(e) => onIncludeSubDepartmentsChange(e.target.checked)}
              id="include-sub-deps"
            />
            <label htmlFor="include-sub-deps">Inclure les sous-départements</label>
          </div>
          <div className="separator" />
          <input
            type="text"
            placeholder="Rechercher"
            onChange={handleSearchChange}
            className="search-input"
            style={{ marginBottom: 12 }}
          />
        </div>

        <div className="departement-list-scroll">
          {isLoading && departments.length === 0 ? (
            <p>Chargement des départements...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : departments.length === 0 ? (
            <p>Aucun département trouvé</p>
          ) : (
            <ul style={{ paddingLeft: 0, margin: 0 }}>
              {filteredDepartments.map((department) => renderDepartment(department))}
            </ul>
          )}
        </div>
      </div>
    );

    // Employee block shown only when not compact
    const employeeBlock = !compactLayout && (
      <div className="employee-panel">
        <input
          type="text"
          placeholder="Rechercher"
          onChange={handleSearchChange}
          className="search-input"
        />

        {employees.length > 0 && (
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="selectAllEmployees"
              checked={selectAll}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setSelectAll(isChecked);
                onCheckEmployee(e, { id: "all" }, isChecked);
              }}
            />
            <label htmlFor="selectAllEmployees">Sélectionner tous les employés</label>
          </div>
        )}

        {employees.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Veuillez sélectionner un département pour voir ses employés.
          </p>
        ) : (
          <ul className="employee-list">
            {employees.map((employee) => {
              const isProcessed = processedEmployees.has(employee.id);
              const isSelected = selectedEmployees.has(employee.id);
              const isCurrentlySelectedEmployee =
                selectedEmployee && selectedEmployee.id === employee.id;
              return (
                <li
                  key={employee.id}
                  className={`employee-item ${
                    isCurrentlySelectedEmployee ? "selected" : ""
                  }`}
                  onClick={() => onSelectEmployee(employee)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        marginRight: "15px",
                        fontSize: "20px",
                        color: "#3a8a90",
                        pointerEvents: isProcessed ? "none" : "auto",
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: isProcessed ? "not-allowed" : "pointer",
                          opacity: isProcessed ? 0.5 : 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isProcessed) {
                            onCheckEmployee(e, employee);
                          }
                        }}
                        disabled={isProcessed}
                      >
                        {isSelected ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3a8a90"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M9 12l2 2 4-4"></path>
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ddd"
                            strokeWidth="2"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="employee-info">
                      <div className="employee-name">
                        {employee.nom} {employee.prenom}
                      </div>
                      <div className="employee-details">
                        {employee.matricule}
                        <span style={{ marginLeft: "10px" }}></span>
                        {findDepartmentName(employee.departement_id)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );

    return (
      <div
        className={`departement_historique ${filtersVisible ? "" : ""}`}
        style={{ flexDirection: compactLayout ? "column" : "row" }}
      >
        {departmentListBlock}
        {employeeBlock}
      </div>
    );
  }
);

DepartmentPanel.propTypes = {
  onSelectDepartment: PropTypes.func.isRequired,
  selectedDepartmentId: PropTypes.number,
  includeSubDepartments: PropTypes.bool,
  onIncludeSubDepartmentsChange: PropTypes.func.isRequired,
  employees: PropTypes.array,
  selectedEmployee: PropTypes.object,
  selectedEmployees: PropTypes.instanceOf(Set),
  processedEmployees: PropTypes.instanceOf(Set),
  onSelectEmployee: PropTypes.func,
  onCheckEmployee: PropTypes.func,
  findDepartmentName: PropTypes.func,
  filtersVisible: PropTypes.bool,
  compactLayout: PropTypes.bool,
};

export default DepartmentPanel;
