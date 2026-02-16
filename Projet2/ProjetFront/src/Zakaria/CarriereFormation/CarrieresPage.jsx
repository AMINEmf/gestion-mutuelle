import React, { useEffect, useState } from "react";
import { Box, ThemeProvider, createTheme, Tabs, Tab } from "@mui/material";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import CareerPaths from "./CareerPaths";
import SkillsManagement from "./SkillsManagement";
import "./CareerTraining.css";
import "../Style.css";

const TabPanel = ({ value, index, children }) => {
  if (value !== index) return null;
  return <div style={{ paddingTop: "16px" }}>{children}</div>;
};

const CarrieresPage = () => {
  const { setTitle, clearActions } = useHeader();
  const { dynamicStyles, open } = useOpen();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTitle("Carrieres");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  return (
    <ThemeProvider theme={createTheme()}>
      <Box
        sx={{
          ...dynamicStyles,
          position: "relative",
          left: 0,
          right: "auto",
          width: "auto",
          marginLeft: open ? "13.8%" : "4.5%",
          minHeight: "auto",
          height: "auto",
          overflow: "visible",
          backgroundColor: "#f5f5f5"
        }}
      >
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div className="career-page">
            <div className="section-header">
              <h4 className="section-title">Carrieres</h4>
              <p className="section-description">
                Parcours des employes et gestion des competences.
              </p>
            </div>

            <div className="career-card">
              <div className="career-card-header">
                <h5 className="career-card-title">Vue globale des carrieres</h5>
              </div>
              <div className="career-card-body">
                <Tabs
                  value={tabIndex}
                  onChange={(event, value) => setTabIndex(value)}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <Tab label="Carriere & Parcours" />
                  <Tab label="Competences" />
                </Tabs>

                <TabPanel value={tabIndex} index={0}>
                  <CareerPaths embedded showHeader={false} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                  <SkillsManagement embedded showHeader={false} />
                </TabPanel>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CarrieresPage;
