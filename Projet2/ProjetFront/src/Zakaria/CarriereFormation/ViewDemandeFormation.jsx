import React from "react";
import { Button } from "react-bootstrap";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR");
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  if (Number.isNaN(number)) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD", maximumFractionDigits: 2 }).format(number);
};

const InfoRow = ({ label, value }) => (
  <div className="mb-2">
    <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: "0.92rem", color: "#111827" }}>{value || "—"}</div>
  </div>
);

const ViewDemandeFormation = ({ demande, onClose, onEdit }) => {
  if (!demande) return null;

  return (
    <div className="career-drawer-content">
      <div className="career-drawer-section mb-3">
        <h6>Bloc 1 : Informations</h6>
        <InfoRow label="Employé" value={demande.employe_nom_complet} />
        <InfoRow label="Département" value={demande.departement_nom} />
        <InfoRow label="Manager" value={demande.manager_nom_complet} />
        <InfoRow label="Formation souhaitée" value={demande.formation_souhaitee} />
        <InfoRow label="Objectif" value={demande.objectif} />
        <InfoRow label="Lien avec poste" value={demande.lien_poste} />
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Bloc 2 : Demande</h6>
        <InfoRow label="Urgence" value={demande.urgence} />
        <InfoRow label="Coût estimé" value={formatCurrency(demande.cout_estime)} />
        <InfoRow label="Source" value={demande.source_demande} />
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Bloc 3 : Suivi RH</h6>
        <InfoRow label="Statut" value={demande.statut} />
        <InfoRow label="Commentaire RH" value={demande.commentaire_rh} />
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Bloc 4 : Suivi formation</h6>
        <InfoRow label="Organisation" value={demande.organisation_formation} />
        <InfoRow label="Inscription" value={demande.inscription} />
        <InfoRow label="Participation" value={demande.suivi_participation} />
        <InfoRow label="Résultat" value={demande.resultat} />

        <div className="mt-2">
          <div style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>Certificat</div>
          {demande.certificat_url ? (
            <div className="d-flex gap-2 mt-1">
              <a className="cnss-btn-secondary" style={{ textDecoration: "none", padding: "6px 12px" }} href={demande.certificat_url} target="_blank" rel="noreferrer">
                Consulter
              </a>
              <a className="cnss-btn-secondary" style={{ textDecoration: "none", padding: "6px 12px" }} href={demande.certificat_url} download>
                Télécharger
              </a>
            </div>
          ) : (
            <div>—</div>
          )}
        </div>
      </div>

      <div className="career-drawer-section mb-3">
        <h6>Traçabilité</h6>
        <InfoRow label="Date de création" value={formatDate(demande.created_at)} />
        <InfoRow label="Date de mise à jour" value={formatDate(demande.updated_at)} />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button className="cnss-btn-secondary" onClick={onClose}>Fermer</Button>
        <Button className="cnss-btn-primary" onClick={onEdit}>Modifier</Button>
      </div>
    </div>
  );
};

export default ViewDemandeFormation;
