import React from "react";
import { Button } from "react-bootstrap";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR");
};

const InfoRow = ({ label, value }) => (
  <div className="mb-2">
    <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: "0.92rem", color: "#111827" }}>{value || "—"}</div>
  </div>
);

const ViewDemandeMobilite = ({ demande, onClose, onEdit }) => {
  if (!demande) return null;

  return (
    <div className="career-drawer-content">
      <div className="career-drawer-section mb-3">
        <h6>Bloc 1 : Informations générales</h6>
        <InfoRow label="Employé" value={demande.employe_nom_complet} />
        <InfoRow label="Matricule" value={demande.matricule} />
        <InfoRow label="Poste actuel" value={demande.poste_actuel} />
        <InfoRow label="Poste souhaité" value={demande.poste_souhaite} />
        <InfoRow label="Type de mobilité" value={demande.type_mobilite} />
        <InfoRow label="Disponibilité" value={demande.disponibilite ? new Date(demande.disponibilite).toLocaleDateString("fr-FR") : "—"} />
        <InfoRow label="Source de la demande" value={demande.source_demande} />
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Bloc 2 : Justification</h6>
        <InfoRow label="Motivation" value={demande.motivation} />
        <InfoRow label="Avis manager" value={demande.avis_manager} />
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Bloc 3 : Analyse RH</h6>
        <InfoRow label="Compatibilité profil / poste" value={demande.compatibilite_profil_poste} />
        <InfoRow label="Besoin de formation" value={demande.besoin_formation === null || demande.besoin_formation === undefined ? "—" : (demande.besoin_formation ? "Oui" : "Non")} />
        <InfoRow label="Détail formation" value={demande.details_formation} />
        <InfoRow label="Disponibilité du poste" value={demande.disponibilite_poste} />
        <InfoRow label="Impact organisationnel" value={demande.impact_organisationnel} />
        <InfoRow label="Commentaire RH" value={demande.commentaire_rh} />
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Bloc 4 : Suivi</h6>
        <InfoRow label="Statut" value={demande.statut} />
        <InfoRow label="RH responsable" value={demande.rh_responsable} />
        <InfoRow label="Date de création" value={formatDate(demande.created_at)} />
        <InfoRow label="Date de mise à jour" value={formatDate(demande.updated_at)} />
        <div className="mt-2">
          <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>Pièce jointe</div>
          {demande.cv_interne_url ? (
            <div className="d-flex gap-2 mt-1">
              <a className="cnss-btn-secondary" style={{ textDecoration: "none", padding: "6px 12px" }} href={demande.cv_interne_url} target="_blank" rel="noreferrer">
                Consulter
              </a>
              <a className="cnss-btn-secondary" style={{ textDecoration: "none", padding: "6px 12px" }} href={demande.cv_interne_url} download={demande.cv_interne_nom_original || "document_mobilite"}>
                Télécharger
              </a>
            </div>
          ) : (
            <div>—</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button className="cnss-btn-secondary" onClick={onClose}>Fermer</Button>
        <Button className="cnss-btn-primary" onClick={onEdit}>Modifier</Button>
      </div>
    </div>
  );
};

export default ViewDemandeMobilite;
