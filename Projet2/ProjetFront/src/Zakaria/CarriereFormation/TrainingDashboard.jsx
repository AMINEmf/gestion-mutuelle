import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  ThemeProvider,
  Typography,
  createTheme,
  Toolbar,
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  BookOpen,
  Users,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Target,
} from "lucide-react";
import { useHeader } from "../../Acceuil/HeaderContext";
import { useOpen } from "../../Acceuil/OpenProvider";
import apiClient from "../../services/apiClient";

const themeColors = {
  teal: "#2c767c",
  tealLight: "#4db6ac",
  tealDark: "#004d40",
  secondary: "#26a69a",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  hoverBg: "#f8fafc",
  divider: "rgba(44, 118, 124, 0.2)",
};

const CACHE_TTL = 5 * 60 * 1000;
const TRAINING_DASHBOARD_CACHE_KEY = "dashboard-formations-cache-v2";

const DEFAULT_TRAINING_DASHBOARD = {
  kpis: {
    formations_actives: 0,
    participants_total: 0,
    taux_reussite: 0,
    budget_total: 0,
    demandes_formation_total: 0,
    demandes_en_etude: 0,
    demandes_validees: 0,
  },
  charts: {
    month_labels: [],
    month_data: [],
    by_status: [],
    domaine_data: [],
  },
};

const normalizeTrainingDashboard = (payload) => {
  const source = payload && typeof payload === "object" ? payload : {};
  const kpis = source.kpis && typeof source.kpis === "object" ? source.kpis : {};
  const charts = source.charts && typeof source.charts === "object" ? source.charts : {};

  return {
    kpis: {
      ...DEFAULT_TRAINING_DASHBOARD.kpis,
      ...kpis,
    },
    charts: {
      ...DEFAULT_TRAINING_DASHBOARD.charts,
      ...charts,
      month_labels: Array.isArray(charts.month_labels) ? charts.month_labels : [],
      month_data: Array.isArray(charts.month_data) ? charts.month_data : [],
      by_status: Array.isArray(charts.by_status) ? charts.by_status : [],
      domaine_data: Array.isArray(charts.domaine_data) ? charts.domaine_data : [],
    },
  };
};

const TrainingDashboard = () => {
  const { setTitle, clearActions } = useHeader();
  const { dynamicStyles } = useOpen();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(DEFAULT_TRAINING_DASHBOARD);

  useEffect(() => {
    setTitle("Tableau de bord Formations");
    return () => {
      clearActions();
    };
  }, [setTitle, clearActions]);

  useEffect(() => {
    const fetchData = async () => {
      let hasCachedData = false;

      try {
        const cachedRaw = localStorage.getItem(TRAINING_DASHBOARD_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          const isFresh = cached?.timestamp && Date.now() - Number(cached.timestamp) < CACHE_TTL;
          if (isFresh && cached?.data) {
            setDashboardData(normalizeTrainingDashboard(cached.data));
            setLoading(false);
            hasCachedData = true;
          }
        }
      } catch (e) {
        console.warn("Cache dashboard formations invalide:", e);
      }

      try {
        const response = await apiClient.get("/dashboard/formations");
        const normalized = normalizeTrainingDashboard(response?.data);
        setDashboardData(normalized);

        try {
          localStorage.setItem(
            TRAINING_DASHBOARD_CACHE_KEY,
            JSON.stringify({
              data: normalized,
              timestamp: Date.now(),
            })
          );
        } catch (e) {
          console.warn("Erreur sauvegarde cache dashboard formations:", e);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard formations:", error);
        if (!hasCachedData) {
          setDashboardData(DEFAULT_TRAINING_DASHBOARD);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}08 0%, ${color}04 100%)`,
        borderRadius: "1.5rem",
        boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.08)",
        border: `0.0625rem solid ${color}15`,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-0.25rem)",
          boxShadow: "0 0.75rem 2.5rem rgba(0,0,0,0.12)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "0.25rem",
          background: `linear-gradient(90deg, ${themeColors.teal}, ${themeColors.tealLight})`,
        },
      }}
    >
      <CardContent sx={{ p: "1.5rem" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: themeColors.textSecondary,
                mb: "0.5rem",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: themeColors.tealDark,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                lineHeight: 1,
              }}
            >
              {loading ? "..." : value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}26`,
              borderRadius: "1rem",
              p: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={24} color={color} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const kpis = [
    {
      title: "Formations Actives",
      value: dashboardData.kpis.formations_actives,
      icon: BookOpen,
      color: themeColors.teal,
    },
    {
      title: "Participants Inscrits",
      value: dashboardData.kpis.participants_total,
      icon: Users,
      color: themeColors.secondary,
    },
    {
      title: "Taux de Réussite",
      value: `${dashboardData.kpis.taux_reussite}%`,
      icon: CheckCircle,
      color: themeColors.success,
    },
    {
      title: "Budget Total Formations",
      value: `${Number(dashboardData.kpis.budget_total || 0).toLocaleString("fr-FR")} MAD`,
      icon: DollarSign,
      color: themeColors.warning,
    },
    {
      title: "Demandes Formation",
      value: dashboardData.kpis.demandes_formation_total,
      icon: TrendingUp,
      color: themeColors.info,
    },
    {
      title: "Demandes en étude",
      value: dashboardData.kpis.demandes_en_etude,
      icon: Target,
      color: themeColors.tealDark,
    },
  ];

  return (
    <ThemeProvider theme={createTheme()}>
      <Box
        sx={{
          ...dynamicStyles,
          backgroundColor: "#ffffff",
          height: "100vh",
          overflowY: "auto",
          minHeight: "100vh",
          boxSizing: "border-box",
          p: { xs: "1rem", sm: "1.5rem", md: "2rem" },
          pb: { xs: "3rem", sm: "4rem", md: "5rem" },
          "&::-webkit-scrollbar": {
            width: "0.5rem",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "0.25rem",
          },
        }}
      >
        <Toolbar />

        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.5rem", fontWeight: 700, color: themeColors.textPrimary }}
          >
            Tableau de bord Formations
          </Typography>
          <Typography variant="body2" sx={{ color: themeColors.textSecondary, mt: 0.5 }}>
            Suivi des formations, participants et budget
          </Typography>
        </Box>

        {/* KPI Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpis.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <StatCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Budget par mois */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                borderRadius: "1.5rem",
                boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.08)",
                border: `0.0625rem solid ${themeColors.divider}`,
              }}
            >
              <CardContent sx={{ p: "1.5rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: "1.5rem",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${themeColors.teal}26`,
                      borderRadius: "0.75rem",
                      p: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TrendingUp size={20} color={themeColors.teal} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: themeColors.textPrimary,
                    }}
                  >
                    Budget Formation par Mois
                  </Typography>
                </Box>
                {loading ? (
                  <Box sx={{ textAlign: "center", py: 8, color: themeColors.textSecondary }}>
                    Chargement...
                  </Box>
                ) : dashboardData.charts.month_data.length > 0 ? (
                  <Box sx={{ width: "100%", height: 300 }}>
                    <BarChart
                      height={300}
                      xAxis={[{ data: dashboardData.charts.month_labels, scaleType: "band" }]}
                      series={[{ data: dashboardData.charts.month_data, color: themeColors.teal }]}
                      margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 8, color: themeColors.textSecondary }}>
                    Aucune donnée disponible
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Répartition par statut */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                borderRadius: "1.5rem",
                boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.08)",
                border: `0.0625rem solid ${themeColors.divider}`,
              }}
            >
              <CardContent sx={{ p: "1.5rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: "1.5rem",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${themeColors.info}26`,
                      borderRadius: "0.75rem",
                      p: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle size={20} color={themeColors.info} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: themeColors.textPrimary,
                    }}
                  >
                    Répartition par Statut
                  </Typography>
                </Box>
                {loading ? (
                  <Box sx={{ textAlign: "center", py: 8, color: themeColors.textSecondary }}>
                    Chargement...
                  </Box>
                ) : dashboardData.charts.by_status.length > 0 ? (
                  <Box sx={{ width: "100%", height: 300 }}>
                    <PieChart
                      height={300}
                      series={[
                        {
                          data: dashboardData.charts.by_status,
                          innerRadius: 50,
                          outerRadius: 120,
                          paddingAngle: 2,
                        },
                      ]}
                      margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 8, color: themeColors.textSecondary }}>
                    Aucune donnée disponible
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Participants par domaine */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "1.5rem",
                boxShadow: "0 0.25rem 1.25rem rgba(0,0,0,0.08)",
                border: `0.0625rem solid ${themeColors.divider}`,
              }}
            >
              <CardContent sx={{ p: "1.5rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: "1.5rem",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: `${themeColors.secondary}26`,
                      borderRadius: "0.75rem",
                      p: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Target size={20} color={themeColors.secondary} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: themeColors.textPrimary,
                    }}
                  >
                    Participants par Domaine
                  </Typography>
                </Box>
                {loading ? (
                  <Box sx={{ textAlign: "center", py: 8, color: themeColors.textSecondary }}>
                    Chargement...
                  </Box>
                ) : dashboardData.charts.domaine_data.length > 0 ? (
                  <Box sx={{ width: "100%", height: 300 }}>
                    <BarChart
                      height={300}
                      xAxis={[
                        {
                          data: dashboardData.charts.domaine_data.map((d) => d.label),
                          scaleType: "band",
                        },
                      ]}
                      series={[
                        {
                          data: dashboardData.charts.domaine_data.map((d) => d.value),
                          color: themeColors.secondary,
                        },
                      ]}
                      margin={{ left: 40, right: 20, top: 20, bottom: 60 }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 8, color: themeColors.textSecondary }}>
                    Aucune donnée disponible
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default TrainingDashboard;
