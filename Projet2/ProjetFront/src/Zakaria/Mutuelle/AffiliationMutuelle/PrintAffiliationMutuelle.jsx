import React from 'react';

const PrintAffiliationMutuelle = ({ data, departementNom }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0,00';
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatStatut = (statut) => {
    const statutLabels = {
      'active': 'Active',
      'suspendue': 'Suspendue',
      'resiliee': 'Résiliée'
    };
    return statutLabels[statut] || statut;
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      backgroundColor: 'white',
      color: 'black',
      fontSize: '12px'
    }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
          }
        `}
      </style>

      <div className="print-container">
        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
          <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            RAPPORT D'AFFILIATION MUTUELLE
          </h1>
          {departementNom && (
            <h2 style={{ margin: '10px 0', fontSize: '18px', color: '#666' }}>
              Département: {departementNom}
            </h2>
          )}
          <p style={{ margin: '10px 0', fontSize: '14px' }}>
            Date d'impression: {formatDate(new Date().toISOString())}
          </p>
        </div>

        {/* Statistiques générales */}
        <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
            Statistiques Générales
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', margin: '5px' }}>
              <strong>Total Affiliations:</strong><br />
              {data.length}
            </div>
            <div style={{ textAlign: 'center', margin: '5px' }}>
              <strong>Affiliations Actives:</strong><br />
              {data.filter(item => item.statut === 'active').length}
            </div>
            <div style={{ textAlign: 'center', margin: '5px' }}>
              <strong>Affiliations Suspendues:</strong><br />
              {data.filter(item => item.statut === 'suspendue').length}
            </div>
            <div style={{ textAlign: 'center', margin: '5px' }}>
              <strong>Affiliations Résiliées:</strong><br />
              {data.filter(item => item.statut === 'resiliee').length}
            </div>
          </div>
        </div>

        {/* Tableau des affiliations */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Employé
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Mutuelle
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                N° Affiliation
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Date Affiliation
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Date Fin
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Statut
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Cotisation Mensuelle
              </th>
              <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((affiliation, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {affiliation.employe ? `${affiliation.employe.nom} ${affiliation.employe.prenom}` : 'Non spécifié'}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {affiliation.mutuelle ? affiliation.mutuelle.nom : 'Non spécifié'}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {affiliation.numero_affiliation || 'Non défini'}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {formatDate(affiliation.date_affiliation)}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {formatDate(affiliation.date_fin_affiliation)}
                </td>
                <td style={{ 
                  border: '1px solid black', 
                  padding: '8px',
                  fontWeight: 'bold',
                  color: affiliation.statut === 'active' ? 'green' : 
                         affiliation.statut === 'suspendue' ? 'orange' : 'red'
                }}>
                  {formatStatut(affiliation.statut)}
                </td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>
                  {formatCurrency(affiliation.cotisation_mensuelle)} MAD
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {affiliation.type_affiliation === 'obligatoire' ? 'Obligatoire' : 'Volontaire'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Résumé par mutuelle */}
        <div style={{ marginTop: '30px', pageBreakBefore: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
            Résumé par Mutuelle
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                  Mutuelle
                </th>
                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                  Nombre d'Affiliations
                </th>
                <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold' }}>
                  Total Cotisations Mensuelles
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(data.map(item => item.mutuelle?.nom).filter(Boolean)))
                .map(mutuelleNom => {
                  const affiliationsMutuelle = data.filter(item => item.mutuelle?.nom === mutuelleNom);
                  const totalCotisations = affiliationsMutuelle.reduce((sum, item) => 
                    sum + (parseFloat(item.cotisation_mensuelle) || 0), 0
                  );
                  
                  return (
                    <tr key={mutuelleNom}>
                      <td style={{ border: '1px solid black', padding: '8px' }}>
                        {mutuelleNom}
                      </td>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                        {affiliationsMutuelle.length}
                      </td>
                      <td style={{ border: '1px solid black', padding: '8px', textAlign: 'right' }}>
                        {formatCurrency(totalCotisations)} MAD
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>

        {/* Pied de page */}
        <div style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '1px solid #ddd',
          textAlign: 'center',
          fontSize: '10px',
          color: '#666'
        }}>
          <p>
            Rapport généré automatiquement - Système de Gestion RH<br />
            Date: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintAffiliationMutuelle;