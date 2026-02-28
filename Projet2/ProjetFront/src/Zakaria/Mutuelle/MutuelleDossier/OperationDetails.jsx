import React from "react";
import { Box, Typography, IconButton, Button as MuiButton } from "@mui/material";
import { X, Calendar, MessageSquare, FileText, DollarSign, User, Info, CreditCard, Shield, Eye, Download } from "lucide-react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faDownload } from "@fortawesome/free-solid-svg-icons";

function OperationDetails({ operation, employe, onClose }) {
    if (!operation) return null;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";
        return date.toLocaleDateString("fr-FR");
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(amount || 0) + " DH";
    };

    const getStatutLabel = (statut) => {
        const labels = {
            EN_COURS: "En cours",
            TERMINEE: "Validée",
            REMBOURSEE: "Remboursée",
            ANNULEE: "Refusée",
        };
        return labels[statut] || statut;
    };

    // Vérifier si le type d'opération nécessite des montants
    const typeNecessiteMontant = (typeOperation) => {
        const typesAvecMontant = ['Remboursement', 'Prise en Charge', 'Régularisation'];
        return typesAvecMontant.some(type => 
            typeOperation && typeOperation.toLowerCase().includes(type.toLowerCase())
        );
    };

    // Vérifier si on doit afficher les cartes de montants
    const shouldShowAmountCards = () => {
        const hasValidAmount = operation.montant_total !== null && 
                              operation.montant_total !== undefined && 
                              operation.montant_total > 0;
        const needsAmount = typeNecessiteMontant(operation.type_operation);
        return hasValidAmount && needsAmount;
    };

    // ── Styles ──────────────────────────────────────────────────────────────
    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
        marginTop: '24px'
    };

    const sectionTitleStyle = {
        fontWeight: 700,
        color: '#4b5563',
        fontSize: '0.85rem',
        letterSpacing: '0.02em',
        textTransform: 'none'
    };

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#9ca3af',
        marginBottom: '0.25rem',
        textTransform: 'uppercase',
        letterSpacing: '0.025em'
    };

    const valueStyle = {
        fontSize: '0.875rem',
        color: '#374151',
        fontWeight: 500,
        minHeight: '20px'
    };

    const fullName = employe ? `${employe.nom || ''} ${employe.prenom || ''}`.trim() : "—";

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#fff'
        }}>
            {/* HEADER */}
            <Box sx={{
                p: 2,
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                bgcolor: '#f8fafc', // Correspond à l'image 2
                zIndex: 10
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: '#4b5563',
                    lineHeight: 1.2,
                    fontSize: '1.1rem',
                    textAlign: 'center'
                }}>
                    Détails Opération
                    <Typography component="span" sx={{ color: '#6b7280', fontSize: '0.8rem', ml: 1, fontWeight: 400 }}>
                        — {fullName}
                    </Typography>
                </Typography>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: '#64748b',
                        position: 'absolute',
                        right: 16,
                        '&:hover': { bgcolor: '#f1f5f9' }
                    }}
                    aria-label="Fermer"
                >
                    <X size={20} />
                </IconButton>
            </Box>

            {/* CONTENT */}
            <Box sx={{ flex: 1, overflow: 'auto', p: '24px' }}>

                {/* SECTION: MONTANTS - Cards Summary (style image 2) */}
                {shouldShowAmountCards() && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
                        {/* Carte MONTANT TOTAL */}
                        <Box sx={{
                            backgroundColor: '#E3F2FD',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minHeight: '85px'
                        }}>
                            <Typography sx={{ 
                                fontSize: '0.65rem', 
                                fontWeight: 600, 
                                color: '#1565C0', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.3px',
                                mb: 0.5
                            }}>
                                MONTANT TOTAL
                            </Typography>
                            <Typography sx={{
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: '#0D47A1',
                                my: 0.5
                            }}>
                                {new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(operation.montant_total || 0)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#1565C0', fontWeight: 600 }}>MAD</Typography>
                        </Box>

                        {/* Carte REMBOURSÉ */}
                        <Box sx={{
                            backgroundColor: '#E8F5E9',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minHeight: '85px'
                        }}>
                            <Typography sx={{ 
                                fontSize: '0.65rem', 
                                fontWeight: 600, 
                                color: '#2E7D32', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.3px',
                                mb: 0.5
                            }}>
                                REMBOURSÉ
                            </Typography>
                            <Typography sx={{
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: '#1B5E20',
                                my: 0.5
                            }}>
                                {new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(operation.montant_rembourse || 0)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#2E7D32', fontWeight: 600 }}>MAD</Typography>
                        </Box>

                        {/* Carte RESTE À CHARGE */}
                        <Box sx={{
                            backgroundColor: '#FFF3E0',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            minHeight: '85px'
                        }}>
                            <Typography sx={{ 
                                fontSize: '0.65rem', 
                                fontWeight: 600, 
                                color: '#E65100', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.3px',
                                mb: 0.5
                            }}>
                                RESTE À CHARGE
                            </Typography>
                            <Typography sx={{
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: '#BF360C',
                                my: 0.5
                            }}>
                                {new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2 }).format(operation.reste_a_charge || 0)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#E65100', fontWeight: 600 }}>MAD</Typography>
                        </Box>
                    </Box>
                )}


                {/* SECTION: EMPLOYÉ CONCERNÉ */}
                <Box sx={sectionHeaderStyle} style={{ marginTop: 0 }}>
                    <User size={16} color="#007580" />
                    <Typography variant="subtitle2" sx={sectionTitleStyle}>Employé concerné</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 1fr', gap: '20px 40px', mb: 4 }}>
                    <Box>
                        <Typography sx={labelStyle}>NOM ET PRÉNOM</Typography>
                        <Typography sx={valueStyle}>{fullName}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>MATRICULE</Typography>
                        <Typography sx={valueStyle}>{employe?.matricule || "—"}</Typography>
                    </Box>
                </Box>

                {/* SECTION: INFORMATIONS OPÉRATION */}
                <Box sx={sectionHeaderStyle}>
                    <Calendar size={16} color="#007580" />
                    <Typography variant="subtitle2" sx={sectionTitleStyle}>Informations opération</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', mb: 4 }}>
                    <Box>
                        <Typography sx={labelStyle}>DATE OPÉRATION</Typography>
                        <Typography sx={valueStyle}>{formatDate(operation.date_operation)}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>TYPE D'INTERVENTION</Typography>
                        <Typography sx={{ ...valueStyle, textTransform: 'uppercase' }}>{operation.type_operation || "—"}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>STATUT</Typography>
                        <Typography sx={valueStyle}>{getStatutLabel(operation.statut)}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>DATE REMBOURSEMENT</Typography>
                        <Typography sx={valueStyle}>{formatDate(operation.date_remboursement)}</Typography>
                    </Box>
                </Box>

                {/* SECTION: BÉNÉFICIAIRE */}
                <Box sx={sectionHeaderStyle}>
                    <Shield size={16} color="#007580" />
                    <Typography variant="subtitle2" sx={sectionTitleStyle}>Bénéficiaire & Affiliation</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px', mb: 4 }}>
                    <Box>
                        <Typography sx={labelStyle}>AFFILIATION ASSURANCE</Typography>
                        <Typography sx={valueStyle}>{operation.affiliation?.mutuelle?.nom || "—"} ({operation.affiliation?.regime?.nom || operation.affiliation?.regime?.label || "Régime"})</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>NUMÉRO ADHÉRENT</Typography>
                        <Typography sx={valueStyle}>{operation.affiliation?.numero_adherent || "—"}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>TYPE BÉNÉFICIAIRE</Typography>
                        <Typography sx={valueStyle}>{operation.beneficiaire_type || "—"}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={labelStyle}>NOM DU BÉNÉFICIAIRE</Typography>
                        <Typography sx={valueStyle}>
                            {operation.beneficiaire_type === "EMPLOYE" ? fullName : (operation.beneficiaire_nom || "—")}
                        </Typography>
                    </Box>
                    {operation.beneficiaire_type !== "EMPLOYE" && (
                        <Box>
                            <Typography sx={labelStyle}>LIEN DE PARENTÉ</Typography>
                            <Typography sx={valueStyle}>{operation.lien_parente || "—"}</Typography>
                        </Box>
                    )}
                </Box>

                {/* SECTION: DOCUMENTS */}
                <Box sx={sectionHeaderStyle}>
                    <FileText size={16} color="#007580" />
                    <Typography variant="subtitle2" sx={sectionTitleStyle}>Documents joints</Typography>
                </Box>
                {operation.documents && operation.documents.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                        {operation.documents.map((doc) => (
                            <Box key={doc.id} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: '10px 12px',
                                bgcolor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                gap: 1
                            }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1.5, 
                                    flex: 1, 
                                    minWidth: 0,
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '6px',
                                        bgcolor: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <FileText size={16} color="#64748b" />
                                    </Box>
                                    <Typography variant="body2" sx={{ 
                                        fontWeight: 600, 
                                        color: '#1e293b',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {doc.nom || doc.file_name}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(`http://localhost:8000/storage/${doc.file_path}`, '_blank')}
                                        title="Visualiser"
                                    >
                                        <Eye size={16} color="#007580" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        component="a"
                                        href={`http://localhost:8000/api/mutuelles/documents/${doc.id}/download`}
                                        title="Télécharger"
                                    >
                                        <Download size={16} color="#64748b" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#9ca3af', mb: 3 }}>
                        Aucun document lié à cette opération.
                    </Typography>
                )}

                {/* SECTION: COMMENTAIRES */}
                <Box sx={sectionHeaderStyle}>
                    <MessageSquare size={16} color="#007580" />
                    <Typography variant="subtitle2" sx={sectionTitleStyle}>Commentaires / Notes</Typography>
                </Box>
                <Box sx={{
                    p: 2,
                    bgcolor: '#fdfdfd',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    minHeight: '80px',
                    mb: 4
                }}>
                    <Typography sx={{ ...valueStyle, whiteSpace: 'pre-wrap', color: operation.commentaire ? '#374151' : '#9ca3af' }}>
                        {operation.commentaire || "Aucun commentaire pour cette opération."}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default OperationDetails;
