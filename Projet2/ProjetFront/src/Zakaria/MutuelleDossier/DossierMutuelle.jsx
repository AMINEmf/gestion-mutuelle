
import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import GestionOperationsEmployes from "./GestionOperationsEmployes";

function DossierMutuelle() {
  const { setTitle, clearActions, setShowSearch } = useHeader();
  const { dynamicStyles } = useOpen();

  useEffect(() => {
    setTitle("Gestion des Opérations Assurance");
    setShowSearch(true);
    return () => {
      clearActions();
      setShowSearch(true);
    };
  }, [setTitle, clearActions, setShowSearch]);

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 9 }}>
          <GestionOperationsEmployes />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default DossierMutuelle;
