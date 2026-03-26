import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faTimes } from "@fortawesome/free-solid-svg-icons";

const AffiliationMutuelleFichePrint = ({ show, onHide, affiliation }) => {
  if (!affiliation) return null;

  const employe = affiliation.employe || {};
  const mutuelle = affiliation.mutuelle || {};
  const regime = affiliation.regime || affiliation.regime_mutuelle || {};
  const statut = affiliation.statut || affiliation.statut_affiliation || "N/A";
  const dateAdhesion = affiliation.date_adhesion || affiliation.date_affiliation;
  const dateResiliation = affiliation.date_resiliation || affiliation.date_fin;
  const numeroAdherent = affiliation.numero_adherent || affiliation.numeroAdherent || "N/A";
  const partEmployeur = affiliation.part_employeur_pct ?? regime.part_employeur_pct ?? affiliation.part_employeur;
  const partEmploye = affiliation.part_employe_pct ?? regime.part_employe_pct ?? affiliation.part_employe;
  const tauxCouverture = affiliation.taux_couverture ?? regime.taux_couverture ?? regime.taux_remboursement;
  const cotisation = affiliation.cotisation_mensuelle ?? regime.cotisation_mensuelle ?? regime.montant;

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "");
  const fmtBool = (v) => (v ? "Oui" : "Non");

  const handlePrint = () => {
    const printContent = document.getElementById("affiliation-fiche-print");
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Fiche Affiliation Assurances</title>
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
              background: linear-gradient(135deg, #2c767c 0%, #3a8a90 100%);
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
              font-size: 12px;
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

  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "13px",
    lineHeight: "1.4",
    color: "#2c3e50",
    padding: "20px",
    background: "#fff",
  };

  const headerStyle = {
    textAlign: "center",
    margin: "0 0 30px",
    color: "#2c3e50",
    fontWeight: "600",
    fontSize: "22px",
    borderBottom: "3px solid #3a8a90",
    paddingBottom: "10px",
    position: "relative",
  };

  const sectionStyle = {
    marginBottom: "25px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const sectionHeaderStyle = {
    background: "linear-gradient(135deg, #2c767c 0%, #3a8a90 100%)",
    color: "white",
    padding: "12px 15px",
    margin: "0",
    fontWeight: "600",
    fontSize: "14px",
    border: "none",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  };

  const cellStyle = {
    padding: "10px 15px",
    borderBottom: "1px solid #f0f0f0",
    verticalAlign: "middle",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#34495e",
    width: "200px",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const valueStyle = {
    color: "#2c3e50",
    fontWeight: "500",
    minHeight: "20px",
    borderBottom: "1px dotted #bdc3c7",
    paddingBottom: "5px",
  };

  const buttonGroupStyle = {
    position: "absolute",
    top: "0",
    right: "0",
    display: "flex",
    gap: "10px",
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered style={{ marginTop: "2%" }}>
      <Modal.Body style={{ padding: "0" }}>
        <div id="affiliation-fiche-print" style={containerStyle}>
          <div style={headerStyle}>
            <h2 style={{ margin: 0 }}>Fiche Affiliation Assurances</h2>
            <div className="no-print" style={buttonGroupStyle}>
              <Button
                variant="primary"
                className="no-focus-outline"
                onClick={handlePrint}
                size="sm"
              >
                <FontAwesomeIcon icon={faPrint} /> Imprimer
              </Button>
              <Button variant="outline-secondary" onClick={onHide} size="sm">
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </div>

          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>Informations Employé</h5>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Matricule :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{affiliation.matricule_employe || employe.matricule || ""}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>CIN :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{employe.cin || ""}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Nom :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{affiliation.nom_employe || employe.nom || ""}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Prénom :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{affiliation.prenom_employe || employe.prenom || ""}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Date naissance :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{fmtDate(employe.date_naiss)}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Situation familiale :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{employe.situation_fm || ""}</td>
                </tr>
                <tr style={{ borderBottom: "none" }}>
                  <td style={{ ...cellStyle, ...labelStyle, borderBottom: "none" }}>Adresse :</td>
                  <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }}>{employe.adresse || ""}</td>
                  <td style={{ ...cellStyle, ...labelStyle, borderBottom: "none" }}>Date embauche :</td>
                  <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }}>{fmtDate(employe.date_embauche)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>Informations Assurances</h5>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Nom de l'assurance :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{mutuelle.nom || affiliation.nom_mutuelle || ""}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Régime :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{regime.libelle || ""}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>N° d'adhérent :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{numeroAdherent}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Statut :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{statut}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Date d'adhésion :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{fmtDate(dateAdhesion)}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Date de résiliation :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{fmtDate(dateResiliation)}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Taux de couverture :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{tauxCouverture ?? ""}{tauxCouverture ? "%" : ""}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Cotisation mensuelle :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{cotisation ?? ""}{cotisation ? " DH" : ""}</td>
                </tr>
                <tr style={{ borderBottom: "none" }}>
                  <td style={{ ...cellStyle, ...labelStyle, borderBottom: "none" }}>Part employeur :</td>
                  <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }}>{partEmployeur ?? 0}%</td>
                  <td style={{ ...cellStyle, ...labelStyle, borderBottom: "none" }}>Part Employé :</td>
                  <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }}>{partEmploye ?? 0}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>Ayants droit</h5>
            <table style={tableStyle}>
              <tbody>
                <tr style={{ borderBottom: "none" }}>
                  <td style={{ ...cellStyle, ...labelStyle, borderBottom: "none" }}>Enfants ayants droit :</td>
                  <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }}>{fmtBool(affiliation.ayant_droit)}</td>
                  <td style={{ ...cellStyle, ...labelStyle, borderBottom: "none" }}>Conjoint ayant droit :</td>
                  <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }}>{fmtBool(affiliation.conjoint_ayant_droit)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {affiliation.commentaire && (
            <div style={sectionStyle}>
              <h5 style={sectionHeaderStyle}>Commentaire</h5>
              <table style={tableStyle}>
                <tbody>
                  <tr style={{ borderBottom: "none" }}>
                    <td style={{ ...cellStyle, ...valueStyle, borderBottom: "none" }} colSpan="4">{affiliation.commentaire}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AffiliationMutuelleFichePrint;
