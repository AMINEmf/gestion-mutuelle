import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import './AffiliationMutuelleFichePrint.css';

const AffiliationMutuelleFichePrint = ({ show, onHide, affiliation }) => {
  if (!affiliation) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Fiche Affiliation Mutuelle - ${affiliation.nom_employe} ${affiliation.prenom_employe}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #00afaa;
              padding-bottom: 20px;
            }
            .header h1 { 
              color: #00afaa; 
              margin: 0;
              font-size: 24px;
            }
            .header h2 { 
              color: #666; 
              margin: 5px 0 0 0;
              font-size: 16px;
              font-weight: normal;
            }
            .section { 
              margin: 25px 0; 
              page-break-inside: avoid;
            }
            .section-title { 
              background-color: #00afaa; 
              color: white; 
              padding: 10px 15px; 
              margin: 0 0 15px 0;
              font-weight: bold;
              border-radius: 4px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin: 15px 0;
            }
            .info-item { 
              margin: 8px 0; 
            }
            .info-label { 
              font-weight: bold; 
              color: #555;
              display: inline-block;
              min-width: 150px;
            }
            .info-value { 
              color: #333; 
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-actif {
              background-color: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .status-inactif {
              background-color: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
            }
            .status-suspendu {
              background-color: #fff3cd;
              color: #856404;
              border: 1px solid #ffeaa7;
            }
            .repartition-box {
              border: 2px solid #00afaa;
              border-radius: 8px;
              padding: 15px;
              margin: 15px 0;
              background-color: #f8f9fa;
            }
            .repartition-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 10px 0;
              padding: 8px 0;
              border-bottom: 1px solid #dee2e6;
            }
            .repartition-item:last-child {
              border-bottom: none;
              font-weight: bold;
              color: #00afaa;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FICHE AFFILIATION MUTUELLE</h1>
            <h2>Système de Gestion RH</h2>
          </div>

          <div class="section">
            <div class="section-title">INFORMATIONS EMPLOYÉ</div>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Matricule :</span>
                  <span class="info-value">${affiliation.matricule_employe}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Nom :</span>
                  <span class="info-value">${affiliation.nom_employe}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Prénom :</span>
                  <span class="info-value">${affiliation.prenom_employe}</span>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Date d'affiliation :</span>
                  <span class="info-value">${new Date(affiliation.date_affiliation).toLocaleDateString('fr-FR')}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Statut :</span>
                  <span class="status-badge status-${affiliation.statut.toLowerCase()}">${affiliation.statut}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">INFORMATIONS MUTUELLE</div>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <span class="info-label">Nom de la mutuelle :</span>
                  <span class="info-value">${affiliation.nom_mutuelle}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">N° d'adhérent :</span>
                  <span class="info-value">${affiliation.numero_adherent}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">RÉPARTITION DES COTISATIONS</div>
            <div class="repartition-box">
              <div class="repartition-item">
                <span>Part Employeur :</span>
                <span><strong>${affiliation.part_employeur || 0}%</strong></span>
              </div>
              <div class="repartition-item">
                <span>Part Employé :</span>
                <span><strong>${affiliation.part_employe || 0}%</strong></span>
              </div>
              <div class="repartition-item">
                <span>TOTAL :</span>
                <span><strong>${(parseFloat(affiliation.part_employeur) || 0) + (parseFloat(affiliation.part_employe) || 0)}%</strong></span>
              </div>
            </div>
          </div>

          ${affiliation.observations ? `
          <div class="section">
            <div class="section-title">OBSERVATIONS</div>
            <div style="padding: 15px; background-color: #f8f9fa; border-radius: 4px; border-left: 4px solid #00afaa;">
              ${affiliation.observations}
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Système de Gestion des Ressources Humaines</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    // Implémentation pour télécharger en PDF
    // Pourrait utiliser jsPDF ou html2pdf
    console.log('Téléchargement PDF à implémenter');
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="fiche-modal-header">
        <Modal.Title>
          <FontAwesomeIcon icon={faPrint} className="me-2" />
          Fiche Affiliation Mutuelle
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="fiche-modal-body">
        <div className="fiche-content">
          {/* En-tête de la fiche */}
          <div className="fiche-header">
            <h4 className="fiche-title">AFFILIATION MUTUELLE</h4>
            <p className="fiche-subtitle">
              {affiliation.nom_employe} {affiliation.prenom_employe}
            </p>
          </div>

          {/* Informations employé */}
          <div className="fiche-section">
            <h5 className="section-title">
              <i className="fas fa-user me-2"></i>
              Informations Employé
            </h5>
            <div className="row">
              <div className="col-md-6">
                <div className="info-item">
                  <label>Matricule :</label>
                  <span>{affiliation.matricule_employe}</span>
                </div>
                <div className="info-item">
                  <label>Nom :</label>
                  <span>{affiliation.nom_employe}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item">
                  <label>Prénom :</label>
                  <span>{affiliation.prenom_employe}</span>
                </div>
                <div className="info-item">
                  <label>Date d'affiliation :</label>
                  <span>{new Date(affiliation.date_affiliation).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations mutuelle */}
          <div className="fiche-section">
            <h5 className="section-title">
              <i className="fas fa-shield-alt me-2"></i>
              Informations Mutuelle
            </h5>
            <div className="row">
              <div className="col-md-6">
                <div className="info-item">
                  <label>Nom de la mutuelle :</label>
                  <span>{affiliation.nom_mutuelle}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item">
                  <label>N° d'adhérent :</label>
                  <span>{affiliation.numero_adherent}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statut et répartition */}
          <div className="fiche-section">
            <h5 className="section-title">
              <i className="fas fa-chart-pie me-2"></i>
              Statut et Répartition
            </h5>
            <div className="row">
              <div className="col-md-6">
                <div className="info-item">
                  <label>Statut :</label>
                  <span className={`badge badge-${affiliation.statut.toLowerCase()}`}>
                    {affiliation.statut}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="repartition-summary">
                  <div className="repartition-item">
                    <span>Part employeur: <strong>{affiliation.part_employeur || 0}%</strong></span>
                  </div>
                  <div className="repartition-item">
                    <span>Part employé: <strong>{affiliation.part_employe || 0}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          {affiliation.observations && (
            <div className="fiche-section">
              <h5 className="section-title">
                <i className="fas fa-sticky-note me-2"></i>
                Observations
              </h5>
              <div className="observations-box">
                {affiliation.observations}
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="fiche-modal-footer">
        <Button variant="outline-secondary" onClick={onHide}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Fermer
        </Button>
        <Button variant="outline-primary" onClick={handleDownloadPDF}>
          <FontAwesomeIcon icon={faDownload} className="me-2" />
          Télécharger PDF
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} className="me-2" />
          Imprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AffiliationMutuelleFichePrint;