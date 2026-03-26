import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useHeader } from "../../../Acceuil/HeaderContext";
import { useOpen } from "../../../Acceuil/OpenProvider";
import {
  Box,
  Grid,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Calendar,
  AlertCircle,
  XCircle,
  Clock,
  ArrowRight,
  TrendingDown
} from "lucide-react";

// --- Configuration & Styling ---

const COLORS = {
  primary: "#2c767c",
  primaryLight: "#4db6ac",
  primaryDark: "#004d40",
  secondary: "#26a69a",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  hoverBg: "#f8fafc",
  bg: "#ffffff"
};

const theme = createTheme({
  palette: {
    primary: { main: COLORS.primary, light: COLORS.primaryLight, dark: COLORS.primaryDark },
    secondary: { main: COLORS.secondary },
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.error },
    info: { main: COLORS.info },
    text: { primary: COLORS.textPrimary, secondary: COLORS.textSecondary },
    background: { default: COLORS.bg, paper: "#ffffff" }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: COLORS.textPrimary },
    h5: { fontWeight: 600, color: COLORS.textPrimary },
    h6: { fontWeight: 600, color: COLORS.textPrimary },
    subtitle1: { color: COLORS.textSecondary },
    subtitle2: { color: COLORS.textSecondary, fontWeight: 500 },
    body1: { color: COLORS.textPrimary },
    body2: { color: COLORS.textPrimary }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: COLORS.textSecondary,
          fontWeight: 600,
          borderBottom: `1px solid ${COLORS.primary}20`,
        },
        body: {
          paddingTop: 16,
          paddingBottom: 16,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        }
      }
    }
  }
});

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card
    sx={{
      position: 'relative',
      overflow: 'visible',
      background: `linear-gradient(135deg, ${color}05 0%, #ffffff 100%)`,
      border: `1px solid ${color}20`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color}, ${color}80)`,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      },
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
      },
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.primaryDark, fontSize: { xs: '2rem', lg: '2.5rem' } }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          bgcolor: `${color}15`,
          p: 1.5,
          borderRadius: '16px',
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={28} />
      </Box>
    </Box>
  </Card>
);

const StatusBadge = ({ status }) => {
  const s = status ? status.toUpperCase().trim() : "INCONNU";

  const labels = {
    "ACTIVE": "Actif",
    "ACTIF": "Actif",
    "RESILIE": "Résilié",
    "RÉSILIE": "Résilié",
    "EN_COURS": "En cours",
    "EN COURS": "En cours",
    "TERMINEE": "Terminée",
    "TERMINÉE": "Terminée",
    "REMBOURSEE": "Remboursée",
    "REMBOURSÉE": "Remboursée",
    "ANNULEE": "Annulée",
    "ANNULÉE": "Annulée",
    "REFUSEE": "Refusée",
    "REFUSÉE": "Refusée",
  };

  const label = labels[s] || s;

  let config = { bg: COLORS.textSecondary, color: COLORS.textSecondary };

  if (["ACTIVE", "ACTIF", "TERMINÉE", "TERMINEE", "VALIDÉE", "VALIDEE", "DECLAREE", "REMBOURSEE", "REMBOURSÉE"].includes(s)) {
    config = { bg: COLORS.success, color: COLORS.success };
  } else if (["EN_COURS", "EN_ATTENTE", "EN COURS"].includes(s)) {
    config = { bg: COLORS.warning, color: COLORS.warning };
  } else if (["RESILIE", "RÉSILIE", "REFUSÉE", "REFUSEE", "ANNULEE", "ANNULÉE", "INACTIF"].includes(s)) {
    config = { bg: COLORS.error, color: COLORS.error };
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: '8px',
        bgcolor: `${config.bg}20`,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        border: `1px solid ${config.bg}30`
      }}
    >
      {label}
    </Box>
  );
};

const TableSection = ({ title, icon: Icon, columns, data, emptyMessage, statusIndex }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.primary}10`, display: 'flex', alignItems: 'center', bgcolor: COLORS.hoverBg }}>
      <Box sx={{ bgcolor: `${COLORS.primary}15`, p: 1, borderRadius: 2, mr: 2, color: COLORS.primary }}>
        <Icon size={20} />
      </Box>
      <Typography variant="h6">{title}</Typography>
    </Box>
    <TableContainer sx={{ flexGrow: 1 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell key={idx} sx={{ bgcolor: COLORS.hoverBg }}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                <Typography variant="subtitle2">{emptyMessage}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rIdx) => (
              <TableRow
                key={rIdx}
                hover
                sx={{
                  '&:hover': { bgcolor: COLORS.hoverBg },
                  cursor: 'default',
                  transition: 'background-color 0.2s'
                }}
              >
                {row.map((cell, cIdx) => (
                  <TableCell key={cIdx}>
                    {statusIndex === cIdx ? <StatusBadge status={cell} /> : (
                      <Typography variant="body2" sx={{
                        fontWeight: cIdx === 0 ? 600 : 400,
                        color: cIdx === 0 ? COLORS.textPrimary : COLORS.textSecondary,
                        fontSize: '0.875rem'
                      }}>
                        {cell}
                      </Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
);

const ChartSection = ({ distribution }) => {
  const total = distribution.total || 1; // Prevent division by zero

  const items = [
    { label: "En cours", value: distribution.EN_COURS || 0, color: COLORS.warning, icon: Clock },
    { label: "Validée / Terminée", value: distribution.TERMINEE || 0, color: COLORS.success, icon: CheckCircle },
    { label: "Refusée / Annulée", value: distribution.ANNULEE || 0, color: COLORS.error, icon: XCircle },
  ];

  return (
    <Card sx={{ p: 0 }}>
      {/* Header matching table style */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${COLORS.primary}10`, display: 'flex', alignItems: 'center', bgcolor: COLORS.hoverBg }}>
        <Box sx={{ bgcolor: `${COLORS.secondary}15`, p: 1, borderRadius: 2, mr: 2, color: COLORS.secondary }}>
          <TrendingUp size={20} />
        </Box>
        <Typography variant="h6">Répartition des Statuts (Opérations)</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {items.map((item, idx) => {
            const percent = Math.round((item.value / total) * 100);
            return (
              <Grid item xs={12} md={4} key={idx}>
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <item.icon size={16} color={item.color} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>
                    {item.value} <Typography component="span" variant="caption" sx={{ color: COLORS.textSecondary }}>({percent}%)</Typography>
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percent}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: item.color,
                      borderRadius: 4
                    }
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Card>
  );
};

// --- Main Layout ---

function MutuelleDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setTitle, searchQuery } = useHeader();
  const { dynamicStyles } = useOpen();
  const normalizedSearch = (searchQuery || "").toLowerCase().trim();

  // Responsive handling
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  useEffect(() => {
    setTitle("Tableau de Bord Assurances");
  }, [setTitle]);

  useEffect(() => {
    const fetchStats = async () => {
      // Tentative de récupération depuis le cache pour un chargement instantané
      const cachedData = sessionStorage.getItem('mutuelle_dashboard_cache');
      const cacheTimestamp = sessionStorage.getItem('mutuelle_dashboard_timestamp');
      const now = Date.now();

      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 120000) { // 2 minutes de cache
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const resp = await api.get("/mutuelle/dashboard-stats");
        setData(resp.data);
        // Mise en cache des résultats
        sessionStorage.setItem('mutuelle_dashboard_cache', JSON.stringify(resp.data));
        sessionStorage.setItem('mutuelle_dashboard_timestamp', now.toString());
      } catch (e) {
        console.error("Dashboard Error:", e);
        setError("Impossible de charger les données.");
        setData({
          kpis: { affiliations_actives: 0, affiliations_inactives: 0, dossiers_en_cours: 0, dossiers_termines: 0 },
          latest_affiliations: [],
          latest_dossiers: [],
          distribution: { EN_COURS: 0, TERMINEE: 0, ANNULEE: 0, total: 0 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Format Helpers
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("fr-FR", { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  // Data Preparation
  const kpis = data?.kpis || { affiliations_actives: 0, affiliations_inactives: 0, dossiers_en_cours: 0, dossiers_termines: 0 };

  // Calculate specific counters if missing in KPI object but present in lists
  const rawAffList = data?.latest_affiliations || data?.recentAffiliations || [];
  const filteredAffiliations = useMemo(() => {
    if (!normalizedSearch) return rawAffList;
    return rawAffList.filter((a) => {
      const values = [
        a.employe?.nom,
        a.employe?.prenom,
        a.employe?.matricule,
        a.statut,
        a.date_adhesion || a.date_affiliation,
      ];
      return values.some((v) => v && v.toString().toLowerCase().includes(normalizedSearch));
    });
  }, [rawAffList, normalizedSearch]);

  const computedActive = data?.kpis?.affiliations_actives ?? rawAffList.filter(a => (a.statut || "").trim() === "ACTIVE").length;
  const computedInactive = data?.kpis?.affiliations_inactives ?? rawAffList.filter(a => (a.statut || "").trim() === "RESILIE").length;

  const displayKpis = {
    active: kpis.affiliations_actives || computedActive || 0,
    inactive: kpis.affiliations_inactives || computedInactive || 0,
    pending: kpis.dossiers_en_cours || 0,
    completed: kpis.dossiers_termines || 0
  };

  const affRows = filteredAffiliations.slice(0, 5).map(a => [
    `${a.employe?.nom || ""} ${a.employe?.prenom || ""}`,
    a.employe?.matricule || "-",
    formatDate(a.date_adhesion || a.date_affiliation),
    a.statut || "-"
  ]);

  const filteredDossiers = useMemo(() => {
    const list = data?.latest_dossiers || data?.recentDossiers || [];
    if (!normalizedSearch) return list;
    return list.filter((d) => {
      const values = [
        d.type_operation || d.type,
        d.statut,
        d.date_operation || d.date,
        `${d.employe?.nom || ""} ${d.employe?.prenom || ""}`,
      ];
      return values.some((v) => v && v.toString().toLowerCase().includes(normalizedSearch));
    });
  }, [data, normalizedSearch]);

  const dosRows = filteredDossiers.slice(0, 5).map(d => [
    formatDate(d.date_operation || d.date),
    d.type_operation || d.type || "-",
    `${d.employe?.nom || ""} ${d.employe?.prenom || ""}`,
    d.statut || "-"
  ]);

  const distribution = data?.distribution || data?.statusBreakdown || { EN_COURS: 0, TERMINEE: 0, ANNULEE: 0, total: 0 };
  // Ensure total exists
  if (!distribution.total) {
    distribution.total = (distribution.EN_COURS || 0) + (distribution.TERMINEE || 0) + (distribution.ANNULEE || 0);
  }

  if (loading) {
    return (
      <Box sx={{ ...dynamicStyles, mt: '80px', p: 4, display: 'flex', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        ...dynamicStyles,
        mt: '80px',
        bgcolor: COLORS.bg,
        height: 'calc(100vh - 80px)',
        overflowY: 'auto',
        p: { xs: 2, md: 4 },
        transition: 'margin-left 0.3s ease'
      }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>Tableau de Bord Assurances</Typography>
          <Typography variant="subtitle1">Aperçu global des affiliations et des opérations</Typography>
        </Box>

        {/* KPIs Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Affiliations Actives"
              value={displayKpis.active}
              icon={Users}
              color={COLORS.success}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Affiliations Résiliées"
              value={displayKpis.inactive}
              icon={XCircle}
              color={COLORS.error}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Opérations En Cours"
              value={displayKpis.pending}
              icon={Clock}
              color={COLORS.info} // Blue for specific info/pending state
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Opérations Traitées"
              value={displayKpis.completed}
              icon={CheckCircle}
              color={COLORS.success}
            />
          </Grid>
        </Grid>

        {/* Distribution Chart */}
        <Box sx={{ mb: 4 }}>
          <ChartSection distribution={distribution} />
        </Box>

        {/* Tables Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} xl={6}>
            <TableSection
              title="Dernières Affiliations"
              icon={Users}
              columns={["Employé", "Matricule", "Date", "Statut"]}
              data={affRows}
              emptyMessage="Aucune affiliation récente"
              statusIndex={3}
            />
          </Grid>
          <Grid item xs={12} xl={6}>
            <TableSection
              title="Dernières Opérations"
              icon={FileText}
              columns={["Date", "Type", "Employé", "Statut"]}
              data={dosRows}
              emptyMessage="Aucune opération récente"
              statusIndex={3}
            />
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
}

export default MutuelleDashboard;



