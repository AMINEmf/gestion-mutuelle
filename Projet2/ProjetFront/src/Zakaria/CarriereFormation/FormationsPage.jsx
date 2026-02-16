import React, { useEffect, useState } from "react";
import { Box, ThemeProvider, createTheme, Tabs, Tab } from "@mui/material";
import { X } from "lucide-react";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import TrainingCatalog from "./TrainingCatalog";
import TrainingDetails from "./TrainingDetails";
import TrainingTracking from "./TrainingTracking";
import { trainings } from "./mockData";
import "./CareerTraining.css";
import "../Style.css";

const TabPanel = ({ value, index, children }) => {
  if (value !== index) return null;
  return <div style={{ paddingTop: "16px" }}>{children}</div>;
};

const FormationsPage = () => {
  const { setTitle, clearActions } = useHeader();
  const { dynamicStyles } = useOpen();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState(0);
  const [selectedTraining, setSelectedTraining] = useState(trainings[0] || null);

  useEffect(() => {
    setTitle("Formations");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  const handleViewDetails = (training) => {
    setSelectedTraining(training);
    setDrawerTab(0);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div
            className="with-split-view"
            style={{
              display: "flex",
              width: "100%",
              height: drawerOpen ? "calc(100vh - 120px)" : "auto",
              overflow: drawerOpen ? "hidden" : "visible"
            }}
          >
            <style>
              {`
                .with-split-view .side-panel-container {
                  position: relative !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                  box-shadow: none !important;
                  animation: none !important;
                  border-radius: 0 !important;
                }
              `}
            </style>

            <div
              style={{
                flex: drawerOpen ? "0 0 50%" : "1 1 100%",
                overflowY: drawerOpen ? "auto" : "visible",
                overflowX: "auto",
                borderRight: drawerOpen ? "2px solid #eef2f5" : "none",
                transition: "flex 0.3s ease-in-out",
                padding: "0 20px"
              }}
            >
              <div className="career-page">
                <div className="section-header">
                  <h4 className="section-title">Formations</h4>
                  <p className="section-description">
                    Catalogue, details et suivi des formations.
                  </p>
                </div>

                <div className="career-section">
                  <TrainingCatalog embedded showHeader={false} onViewDetails={handleViewDetails} />
                </div>
              </div>
            </div>

            {drawerOpen && (
              <div
                style={{
                  flex: "0 0 50%",
                  overflowY: "auto",
                  backgroundColor: "#fdfdfd",
                  boxShadow: "-4px 0 15px rgba(0,0,0,0.05)",
                  position: "relative"
                }}
              >
                <div className="side-panel-container" onClick={(event) => event.stopPropagation()}>
                  <div className="form-header">
                    <div>
                      <h3>{selectedTraining?.titre || "Formation"}</h3>
                      <span className="career-chip">{selectedTraining?.statut || "-"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="form-body">
                    <Tabs
                      value={drawerTab}
                      onChange={(event, value) => setDrawerTab(value)}
                      textColor="primary"
                      indicatorColor="primary"
                      sx={{ borderBottom: "1px solid #e5e7eb" }}
                    >
                      <Tab label="Infos" />
                      <Tab label="Participants" />
                      <Tab label="Suivi & Evaluation" />
                    </Tabs>

                    <TabPanel value={drawerTab} index={0}>
                      <TrainingDetails
                        embedded
                        showHeader={false}
                        section="info"
                        training={selectedTraining}
                      />
                    </TabPanel>
                    <TabPanel value={drawerTab} index={1}>
                      <TrainingDetails
                        embedded
                        showHeader={false}
                        section="participants"
                        training={selectedTraining}
                      />
                    </TabPanel>
                    <TabPanel value={drawerTab} index={2}>
                      <TrainingTracking embedded showHeader={false} />
                    </TabPanel>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FormationsPage;
