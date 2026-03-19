import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faTimes } from '@fortawesome/free-solid-svg-icons';

const FicheAffiliationCNSS = ({ show, onHide, affiliation }) => {
    const handlePrint = () => {
        const printContent = document.getElementById('cnss-fiche-print');
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) return;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Fiche Affiliation CNSS</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #fff; 
              font-size: 13px; 
              line-height: 1.4;
            }
            .no-print { display: none !important; }
            .container { max-width: 100%; margin: 0 auto; }
            
            h2 { 
              text-align: center; 
              margin: 0 0 30px; 
              color: #2c3e50; 
              font-weight: 600; 
              font-size: 22px;
              padding-bottom: 10px;
            }
            
            .section { 
              margin-bottom: 25px; 
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .section-header { 
              background: linear-gradient(135deg, #2c767c, #3a8a90);
              color: white; 
              padding: 12px 15px; 
              margin: 0; 
              font-weight: 600; 
              font-size: 14px;
              border: none;
            }
            
            .form-table { 
              width: 100%; 
              border-collapse: collapse; 
              background: white;
            }
            
            .form-table td { 
              padding: 10px 15px; 
              border-bottom: 1px solid #f0f0f0; 
              vertical-align: middle;
            }
            
            .form-table tr:last-child td {
              border-bottom: none;
            }
            
            .form-table tr:hover {
              background-color: #f8f9fa;
            }
            
            .label { 
              font-weight: 600; 
              color: #34495e; 
              width: 200px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .value { 
              color: #2c3e50; 
              font-weight: 500;
              min-height: 20px;
              border-bottom: 1px dotted #bdc3c7;
              padding-bottom: 5px;
            }

            .no-focus-outline:focus {
              outline: none !important;
              box-shadow: none !important;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 200);
        };
    };

    if (!affiliation) return null;

    const employee = affiliation.employe || {};

    const formatValue = (v) => v || "—";

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toISOString().split('T')[0];
        } catch (e) {
            return dateString;
        }
    };

    const getDepartmentName = () => {
        if (employee.departements && employee.departements.length > 0) return employee.departements[0].nom;
        if (employee.departement) return employee.departement.nom || "";
        if (affiliation.departement_nom) return affiliation.departement_nom;
        return "—";
    };

    const getPoste = () => {
        if (employee.fonction) return employee.fonction;
        if (employee.poste && employee.poste.nom) return employee.poste.nom;
        return "—";
    };

    // Inline styles for React component (matching print style)
    const containerStyle = {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '13px',
        lineHeight: '1.4',
        color: '#2c3e50',
        padding: '20px',
        background: '#fff'
    };

    const headerStyle = {
        textAlign: 'center',
        margin: '0 0 30px',
        color: '#2c3e50',
        fontWeight: '600',
        fontSize: '22px',
        borderBottom: '3px solid #3a8a90',
        paddingBottom: '10px',
        position: 'relative'
    };

    const sectionStyle = {
        marginBottom: '25px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const sectionHeaderStyle = {
        background: 'linear-gradient(135deg, #2c767c 0%, #3a8a90 100%)',
        color: 'white',
        padding: '12px 15px',
        margin: '0',
        fontWeight: '600',
        fontSize: '14px',
        border: 'none'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white'
    };

    const cellStyle = {
        padding: '10px 15px',
        borderBottom: '1px solid #f0f0f0',
        verticalAlign: 'middle'
    };

    const labelStyle = {
        fontWeight: '600',
        color: '#34495e',
        width: '200px',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const valueStyle = {
        color: '#2c3e50',
        fontWeight: '500',
        minHeight: '20px',
        borderBottom: '1px dotted #bdc3c7',
        paddingBottom: '5px'
    };

    const buttonGroupStyle = {
        position: 'absolute',
        top: '0',
        right: '0',
        display: 'flex',
        gap: '10px'
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered style={{ marginTop: '2%' }}>
            <Modal.Body style={{ padding: '0' }}>
                <div id="cnss-fiche-print" style={containerStyle}>
                    <div style={headerStyle}>
                        <h2 style={{ margin: 0 }}>Fiche Affiliation CNSS</h2>
                        <div className="no-print" style={buttonGroupStyle}>
                            <Button
                                variant="primary"
                                className="no-focus-outline"
                                onClick={handlePrint}
                                size="sm"
                                style={{ backgroundColor: '#2c767c', borderColor: '#2c767c' }}
                            >
                                <FontAwesomeIcon icon={faPrint} /> Imprimer
                            </Button>
                            <Button variant="outline-secondary" onClick={onHide} size="sm">
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>
                        </div>
                    </div>

                    {/* Section A — Identité & Référence (CNSS) */}
                    <div style={sectionStyle}>
                        <h5 style={sectionHeaderStyle}>Identité & Référence (CNSS)</h5>
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Matricule employé :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatValue(affiliation.matricule || employee.matricule)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle }}>N° CNSS / Immatriculation :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}><strong>{formatValue(affiliation.numero_cnss)}</strong></td>
                                </tr>
                                <tr>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Prénom :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatValue(employee.prenom)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Nom :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatValue(employee.nom)}</td>
                                </tr>
                                <tr>
                                    <td style={{ ...cellStyle, ...labelStyle }}>CIN :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatValue(employee.cin)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Statut Affiliation :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatValue(affiliation.statut)}</td>
                                </tr>
                                <tr>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Date d'affiliation :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatDate(affiliation.date_debut || affiliation.date_affiliation)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Date de fin :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatDate(affiliation.date_fin)}</td>
                                </tr>
                                <tr style={{ borderBottom: 'none' }}>
                                    <td style={{ ...cellStyle, ...labelStyle, borderBottom: 'none' }}>Régime / Type :</td>
                                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: 'none' }}>{formatValue(affiliation.regime || "Régime Général")}</td>
                                    <td style={{ ...cellStyle, ...labelStyle, borderBottom: 'none' }}>Observations :</td>
                                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: 'none' }}>{formatValue(affiliation.observations || affiliation.notes)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Section B — Informations employeur / unité */}
                    <div style={sectionStyle}>
                        <h5 style={sectionHeaderStyle}>Informations employeur / Unité</h5>
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Département / Unité :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{getDepartmentName()}</td>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Poste occupé :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{getPoste()}</td>
                                </tr>
                                <tr style={{ borderBottom: 'none' }}>
                                    <td style={{ ...cellStyle, ...labelStyle, borderBottom: 'none' }}>Site / Service :</td>
                                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: 'none' }}>{formatValue(affiliation.site || affiliation.service)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle, borderBottom: 'none' }}>Responsable direct :</td>
                                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: 'none' }}>{formatValue(affiliation.responsable || employee.superieur_nom)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Section C — Administrative / Suivi */}
                    <div style={sectionStyle}>
                        <h5 style={sectionHeaderStyle}>Suivi Administratif</h5>
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Date de création :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatDate(affiliation.created_at)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle }}>Dernière mise à jour :</td>
                                    <td style={{ ...cellStyle, ...valueStyle }}>{formatDate(affiliation.updated_at)}</td>
                                </tr>
                                <tr style={{ borderBottom: 'none' }}>
                                    <td style={{ ...cellStyle, ...labelStyle, borderBottom: 'none' }}>Référence interne :</td>
                                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: 'none' }}>{formatValue(affiliation.ref_interne || affiliation.code)}</td>
                                    <td style={{ ...cellStyle, ...labelStyle, borderBottom: 'none' }}>Documents joints :</td>
                                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: 'none' }}>{formatValue(affiliation.has_documents ? "Oui" : "—")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default FicheAffiliationCNSS;
