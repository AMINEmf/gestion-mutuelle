import React, { useEffect } from "react";
import { Box, Card, CardContent, Grid, ThemeProvider, Typography, createTheme } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { TrendingUp, Users, Briefcase } from "lucide-react";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import { careerDashboardStats } from "./mockData";
import "./CareerTraining.css";
import "../Style.css";

const themeColors = {
  primary: "#2c767c",
  primaryLight: "#3a8a90",
  textPrimary: "#1f2937",
  textSecondary: "#64748b"
};

const CareerDashboard = () => {
  const { setTitle, clearActions } = useHeader();
  const { dynamicStyles } = useOpen();

  useEffect(() => {
    setTitle("Dashboard Carrieres");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  const stats = [
    {
      label: "Promotions",
      value: careerDashboardStats.promotions,
      icon: TrendingUp,
      color: themeColors.primary
    },
    {
      label: "Repartition par grade",
      value: careerDashboardStats.grades.reduce((sum, item) => sum + item.value, 0),
      icon: Users,
      color: themeColors.primaryLight
    },
    {
      label: "Postes vacants",
      value: careerDashboardStats.vacancies,
      icon: Briefcase,
      color: "#f59e0b"
    }
  ];

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0, mt: 12 }}>
          <div className="career-page">
            <div className="section-header">
              <h4 className="section-title">Dashboard Carrieres</h4>
              <p className="section-description">
                Vue globale des promotions, grades et postes critiques.
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
                    <h5 className="career-card-title">Promotions par mois</h5>
                  </div>
                  <div className="career-card-body">
                    <BarChart
                      height={280}
                      xAxis={[{ data: careerDashboardStats.promotionsByMonth.map((item) => item.month), scaleType: "band" }]}
                      series={[
                        {
                          data: careerDashboardStats.promotionsByMonth.map((item) => item.value),
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
                    <h5 className="career-card-title">Repartition par grade</h5>
                  </div>
                  <div className="career-card-body">
                    <PieChart
                      height={280}
                      series={[
                        {
                          data: careerDashboardStats.grades.map((item, index) => ({
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

export default CareerDashboard;
