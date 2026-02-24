import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [onPrint, setOnPrint] = useState(undefined);
  const [onExportPDF, setOnExportPDF] = useState(undefined);
  const [onExportExcel, setOnExportExcel] = useState(undefined);
  const [showSearch, setShowSearch] = useState(true);
  const location = useLocation();

  const clearActions = useCallback(() => {
    setOnPrint(undefined);
    setOnExportPDF(undefined);
    setOnExportExcel(undefined);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  useEffect(() => {
    clearSearch();
  }, [location.pathname, clearSearch]);

  const value = useMemo(
    () => ({
      title,
      setTitle,
      searchQuery,
      setSearchQuery,
      clearSearch,
      onPrint,
      setOnPrint,
      onExportPDF,
      setOnExportPDF,
      onExportExcel,
      setOnExportExcel,
      showSearch,
      setShowSearch,
      clearActions,
    }),
    [title, searchQuery, onPrint, onExportPDF, onExportExcel, showSearch, clearActions, clearSearch]
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within a HeaderProvider");
  return ctx;
} 
