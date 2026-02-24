import React from 'react';
import { Box, Typography, Card, CardContent, IconButton, Divider } from '@mui/material';
import { X } from 'lucide-react';
import { BarChart, PieChart } from '@mui/x-charts';

const OperationStatsPanel = ({ stats, onClose }) => {
    if (!stats) return null;

    const { totals, statusDistribution, typeDistribution } = stats;

    const barData = [
        { label: 'Frais', value: totals.frais },
        { label: 'Remboursé', value: totals.rembourse },
        { label: 'Reste', value: totals.reste },
    ];

    const statusColors = {
        'ANNULEE': '#2196f3',    // Blue
        'EN_COURS': '#ffa726',   // Orange
        'TERMINEE': '#2c767c',   // Teal
        'REMBOURSEE': '#4db6ac',  // Mint
    };

    const pieData = Object.entries(statusDistribution).map(([label, value], id) => ({
        id,
        value,
        label,
        color: statusColors[label] || '#4b5563'
    }));

    const typeBarData = Object.entries(typeDistribution).map(([label, value]) => ({
        label,
        value,
    }));

    const hasData = Object.keys(statusDistribution).length > 0;

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#fff',
            borderLeft: '1px solid #e0e0e0',
            width: '100%',
            overflowY: 'auto'
        }}>
            <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                position: 'relative'
            }}>
                <Typography variant="h6" sx={{
                    color: '#4b5563',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    Statistiques des Opérations
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: '#64748b',
                        position: 'absolute',
                        right: 16,
                        '&:hover': { backgroundColor: '#f1f5f9' }
                    }}
                >
                    <X size={20} />
                </IconButton>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                {!hasData ? (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        textAlign: 'center',
                        color: '#64748b'
                    }}>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Aucune donnée disponible pour cet employé.
                        </Typography>
                        <Typography variant="caption">
                            Ajoutez des opérations pour voir les statistiques.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Chart 1: Totals */}
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Totaux (Frais, Remboursé, Reste)
                                </Typography>
                                <Box sx={{ height: 300, width: '100%' }}>
                                    <BarChart
                                        series={[{ data: barData.map(d => d.value), label: 'Montant', color: '#2c767c' }]}
                                        xAxis={[{
                                            data: barData.map(d => d.label),
                                            scaleType: 'band',
                                            tickLabelStyle: { fontSize: 11 }
                                        }]}
                                        yAxis={[{
                                            tickLabelStyle: { fontSize: 11 }
                                        }]}
                                        height={250}
                                        margin={{ top: 10, bottom: 60, left: 45, right: 10 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: { vertical: 'bottom', horizontal: 'middle' },
                                                padding: 0,
                                                labelStyle: {
                                                    fontSize: 12,
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Chart 2: Status Distribution */}
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Répartition par statut
                                </Typography>
                                <Box sx={{ height: 320, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: pieData,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                arcLabel: (item) => `${item.value}`,
                                                cx: '50%',
                                                cy: '50%',
                                            },
                                        ]}
                                        height={300}
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: { vertical: 'bottom', horizontal: 'middle' },
                                                padding: 0,
                                                labelStyle: {
                                                    fontSize: 12,
                                                },
                                            },
                                        }}
                                        margin={{ top: 20, bottom: 80, left: 20, right: 20 }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Chart 3: Type Distribution */}
                        <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Répartition par type
                                </Typography>
                                <Box sx={{ height: 300, width: '100%' }}>
                                    <BarChart
                                        series={[{ data: typeBarData.map(d => d.value), label: 'Nombre d\'opérations', color: '#2196f3' }]}
                                        xAxis={[{
                                            data: typeBarData.map(d => d.label),
                                            scaleType: 'band',
                                            tickLabelStyle: { fontSize: 11 }
                                        }]}
                                        yAxis={[{
                                            tickLabelStyle: { fontSize: 11 }
                                        }]}
                                        height={250}
                                        margin={{ top: 10, bottom: 60, left: 40, right: 10 }}
                                        slotProps={{
                                            legend: {
                                                direction: 'row',
                                                position: { vertical: 'bottom', horizontal: 'middle' },
                                                padding: 0,
                                                labelStyle: {
                                                    fontSize: 12,
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default OperationStatsPanel;
