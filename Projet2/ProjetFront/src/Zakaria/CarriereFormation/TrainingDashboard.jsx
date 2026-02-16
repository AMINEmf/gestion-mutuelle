import React, { useEffect } from "react";
import { Box, Card, CardContent, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { BookOpen, DollarSign, CheckCircle } from "lucide-react";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { trainingDashboardStats } from "./mockData";
import "./CareerTraining.css";
import "../Style.css";

const themeColors = {
  primary: "#2c767c",
  primaryLight: "#3a8a90",
  textPrimary: "#1f2937",
  textSecondary: "#64748b"
};

const TrainingDashboard = () => {
  const { setTitle, clearActions } = useHeader();
  const { dynamicStyles } = useOpen();

  useEffect(() => {
    setTitle("Dashboard Formations");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  const stats = [
    {
      label: "Formations actives",
      value: trainingDashboardStats.active,
      icon: BookOpen,
      color: themeColors.primary
    },
    {
      label: "Taux de reussite",
      value: `${trainingDashboardStats.successRate}%`,
      icon: CheckCircle,
      color: "#16a34a"
    },
    {
      label: "Budget utilise",
      value: `${trainingDashboardStats.budgetUsed} MAD`,
      icon: DollarSign,
      color: "#f59e0b"
    }
  ];

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div className="career-page">
            <div className="section-header">
              <h4 className="section-title">Dashboard Formations</h4>
              <p className="section-description">
                Suivi global des budgets, activites et reussite.
              </p>
            </div>

            <Grid container spacing={3} sx={{ marginBottom: 3 }}>
              {stats.map((stat) => (
                <Grid item xs={12} md={4} key={stat.label}>
                  <Card className="career-card">
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: themeColors.textSecondary }}>
                            {stat.label}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: themeColors.textPrimary }}>
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: `${stat.color}20`,
                            borderRadius: "12px",
                            padding: "10px"
                          }}
                        >
                          <stat.icon size={22} color={stat.color} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card className="career-card">
                  <div className="career-card-header">
                    <h5 className="career-card-title">Budget formation par mois</h5>
                  </div>
                  <div className="career-card-body">
                    <BarChart
                      height={280}
                      xAxis={[{ data: trainingDashboardStats.budgetByMonth.map((item) => item.month), scaleType: "band" }]}
                      series={[
                        {
                          data: trainingDashboardStats.budgetByMonth.map((item) => item.value),
                          color: themeColors.primary
                        }
                      ]}
                      margin={{ left: 40, right: 20, top: 10, bottom: 40 }}
                    />
                  </div>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card className="career-card">
                  <div className="career-card-header">
                    <h5 className="career-card-title">Repartition par statut</h5>
                  </div>
                  <div className="career-card-body">
                    <PieChart
                      height={280}
                      series={[
                        {
                          data: trainingDashboardStats.byStatus.map((item, index) => ({
                            id: index,
                            label: item.label,
                            value: item.value
                          })),
                          innerRadius: 40,
                          outerRadius: 110,
                          paddingAngle: 4
                        }
                      ]}
                      margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                    />
                  </div>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default TrainingDashboard;
