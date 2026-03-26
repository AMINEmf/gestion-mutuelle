import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { User, Briefcase, FileText, ClipboardList } from "lucide-react";
import { STATUTS_MOBILITE, STATUTS_DEMANDE_MOBILITE_LIST } from "../../constants/status";

const TYPES_MOBILITE = [
  "Promotion",
  "Mutation interne",
  "Changement de département",
  "Reclassification",
];

const SOURCES_DEMANDE = [
  "Entretien avec l’employé",
  "Demande par mail",
  "Recommandation manager",
  "Plan de carrière",
];

const STATUTS = STATUTS_DEMANDE_MOBILITE_LIST;

const DISPONIBILITE_POSTE_VALUES = ["Oui", "Non", "En attente"];

const AddDemandeMobilite = ({
  employees,
  postes = [],
  demande = null,
  mode = "add",
  onSubmit,
  onCancel,
}) => {
  const isEdit = mode === "edit";
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    employe_id: demande?.employe_id ? String(demande.employe_id) : "",
    poste_actuel: demande?.poste_actuel || "",
    departement_actuel: demande?.departement_nom || "",
    poste_souhaite: demande?.poste_souhaite || "",
    type_mobilite: demande?.type_mobilite || "",
    source_demande: demande?.source_demande || "",
    motivation: demande?.motivation || "",
    disponibilite: demande?.disponibilite || "",
    avis_manager: demande?.avis_manager || "",
    compatibilite_profil_poste: demande?.compatibilite_profil_poste || "",
    besoin_formation: demande?.besoin_formation === null || demande?.besoin_formation === undefined ? "" : (demande?.besoin_formation ? "1" : "0"),
    details_formation: demande?.details_formation || "",
    disponibilite_poste: demande?.disponibilite_poste || "",
    impact_organisationnel: demande?.impact_organisationnel || "",
    commentaire_rh: demande?.commentaire_rh || "",
    statut: demande?.statut || STATUTS_MOBILITE.EN_ETUDE,
    rh_responsable: demande?.rh_responsable || "",
    remove_cv_interne: false,
  });

  const [file, setFile] = useState(null);

  const selectedEmployee = useMemo(
    () => employees.find((emp) => String(emp.id) === String(form.employe_id)) || null,
    [employees, form.employe_id]
  );

  const posteOptions = useMemo(() => {
    const names = postes
      .map((item) => item?.nom || item?.poste || item?.label || "")
      .map((name) => String(name).trim())
      .filter(Boolean);

    return [...new Set(names)].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  }, [postes]);

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "employe_id") {
      const employee = employees.find((emp) => String(emp.id) === String(value));
      setForm((prev) => ({
        ...prev,
        employe_id: value,
        poste_actuel: employee?.poste?.nom || prev.poste_actuel || "",
        departement_actuel: employee?.departements?.[0]?.nom || prev.departement_actuel || "",
      }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.employe_id) next.employe_id = "L’employé concerné est obligatoire.";
    if (!String(form.poste_souhaite || "").trim()) next.poste_souhaite = "Le poste souhaité est obligatoire.";
    if (!form.type_mobilite) next.type_mobilite = "Le type de mobilité est obligatoire.";
    if (!form.motivation.trim()) next.motivation = "La motivation est obligatoire.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      if (key === "remove_cv_interne") {
        payload.append(key, value ? "1" : "0");
        return;
      }
      payload.append(key, value);
    });

    if (file) {
      payload.append("cv_interne", file);
    }

    if (!isEdit) {
      payload.set("statut", STATUTS_MOBILITE.EN_ETUDE);
    }

    return payload;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(buildPayload());
  };

  const renderError = (name) => (errors[name] ? <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors[name]}</div> : null);

  return (
    <Form onSubmit={submit}>
      <div className="mb-3">
        <div className="cnss-section-title">
          <User size={14} />
          <span>Section 1 : Informations employé</span>
        </div>
        <div className="mb-2">
          <label className="cnss-form-label">Employé concerné <span className="text-danger">*</span></label>
          <Form.Select className="cnss-form-control" value={form.employe_id} onChange={(e) => handleField("employe_id", e.target.value)} disabled={isEdit}>
            <option value="">Sélectionner un employé</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {(emp.nom || "") + " " + (emp.prenom || "")} {emp.matricule ? `(${emp.matricule})` : ""}
              </option>
            ))}
          </Form.Select>
          {renderError("employe_id")}
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <div className="cnss-field-group">
              <label className="cnss-form-label">Poste actuel</label>
              <Form.Control className="cnss-form-control" value={form.poste_actuel} onChange={(e) => handleField("poste_actuel", e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="cnss-field-group">
              <label className="cnss-form-label">Département actuel</label>
              <Form.Control className="cnss-form-control" value={form.departement_actuel} onChange={(e) => handleField("departement_actuel", e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="cnss-field-group">
              <label className="cnss-form-label">Poste souhaité <span className="text-danger">*</span></label>
              <Form.Select className="cnss-form-control" value={form.poste_souhaite} onChange={(e) => handleField("poste_souhaite", e.target.value)}>
                <option value="">Sélectionner un poste</option>
                {posteOptions.map((posteNom) => (
                  <option key={posteNom} value={posteNom}>{posteNom}</option>
                ))}
                {form.poste_souhaite && !posteOptions.includes(form.poste_souhaite) ? (
                  <option value={form.poste_souhaite}>{form.poste_souhaite}</option>
                ) : null}
              </Form.Select>
            </div>
            {renderError("poste_souhaite")}
          </div>
          <div className="col-md-6">
            <div className="cnss-field-group">
              <label className="cnss-form-label">Type de mobilité <span className="text-danger">*</span></label>
              <Form.Select className="cnss-form-control" value={form.type_mobilite} onChange={(e) => handleField("type_mobilite", e.target.value)}>
              <option value="">Sélectionner</option>
              {TYPES_MOBILITE.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Form.Select>
            </div>
            {renderError("type_mobilite")}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="cnss-section-title">
          <FileText size={14} />
          <span>Section 2 : Contexte de la demande</span>
        </div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="cnss-form-label">Source de la demande</label>
            <Form.Select className="cnss-form-control" value={form.source_demande} onChange={(e) => handleField("source_demande", e.target.value)}>
              <option value="">Sélectionner</option>
              {SOURCES_DEMANDE.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-6">
            <label className="cnss-form-label">Disponibilité</label>
            <Form.Control className="cnss-form-control" type="date" value={form.disponibilite} onChange={(e) => handleField("disponibilite", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="cnss-form-label">Motivation <span className="text-danger">*</span></label>
            <Form.Control className="cnss-form-control" as="textarea" rows={3} value={form.motivation} onChange={(e) => handleField("motivation", e.target.value)} />
            {renderError("motivation")}
          </div>
          <div className="col-12">
            <label className="cnss-form-label">Avis manager</label>
            <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.avis_manager} onChange={(e) => handleField("avis_manager", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="cnss-form-label">CV interne / dossier</label>
            <Form.Control
              className="cnss-form-control"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {isEdit && demande?.cv_interne_url && (
              <div className="mt-2 d-flex flex-column gap-1">
                <a href={demande.cv_interne_url} target="_blank" rel="noreferrer">Consulter le document actuel</a>
                <a href={demande.cv_interne_url} download={demande.cv_interne_nom_original || "document_mobilite"}>Télécharger le document</a>
                <Form.Check
                  type="checkbox"
                  id="removeCvInterne"
                  label="Supprimer le document actuel"
                  checked={form.remove_cv_interne}
                  onChange={(e) => handleField("remove_cv_interne", e.target.checked)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="cnss-section-title">
          <Briefcase size={14} />
          <span>Section 3 : Analyse RH</span>
        </div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="cnss-form-label">Compatibilité profil / poste</label>
            <Form.Control className="cnss-form-control" value={form.compatibilite_profil_poste} onChange={(e) => handleField("compatibilite_profil_poste", e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="cnss-form-label">Disponibilité du poste</label>
            <Form.Select className="cnss-form-control" value={form.disponibilite_poste} onChange={(e) => handleField("disponibilite_poste", e.target.value)}>
              <option value="">Sélectionner</option>
              {DISPONIBILITE_POSTE_VALUES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-6">
            <label className="cnss-form-label">Besoin de formation</label>
            <Form.Select className="cnss-form-control" value={form.besoin_formation} onChange={(e) => handleField("besoin_formation", e.target.value)}>
              <option value="">Non renseigné</option>
              <option value="1">Oui</option>
              <option value="0">Non</option>
            </Form.Select>
          </div>
          <div className="col-md-6">
            <label className="cnss-form-label">Détail de la formation nécessaire</label>
            <Form.Control className="cnss-form-control" value={form.details_formation} onChange={(e) => handleField("details_formation", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="cnss-form-label">Impact organisationnel</label>
            <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.impact_organisationnel} onChange={(e) => handleField("impact_organisationnel", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="cnss-form-label">Commentaire RH</label>
            <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.commentaire_rh} onChange={(e) => handleField("commentaire_rh", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="cnss-section-title">
          <ClipboardList size={14} />
          <span>Section 4 : Suivi</span>
        </div>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="cnss-form-label">Statut</label>
            <Form.Select className="cnss-form-control" value={form.statut} onChange={(e) => handleField("statut", e.target.value)} disabled={!isEdit}>
              {STATUTS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-6">
            <label className="cnss-form-label">RH responsable</label>
            <Form.Control className="cnss-form-control" value={form.rh_responsable} onChange={(e) => handleField("rh_responsable", e.target.value)} />
          </div>

          {isEdit && (
            <>
              <div className="col-md-6">
                <label className="cnss-form-label">Date de création</label>
                <Form.Control className="cnss-form-control" value={demande?.created_at ? new Date(demande.created_at).toLocaleString("fr-FR") : "—"} readOnly />
              </div>
              <div className="col-md-6">
                <label className="cnss-form-label">Dernière mise à jour</label>
                <Form.Control className="cnss-form-control" value={demande?.updated_at ? new Date(demande.updated_at).toLocaleString("fr-FR") : "—"} readOnly />
              </div>
            </>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <div className="alert alert-light" style={{ border: "1px solid #e5e7eb" }}>
          Employé sélectionné : <strong>{selectedEmployee.nom} {selectedEmployee.prenom}</strong>
          {selectedEmployee.matricule ? ` (${selectedEmployee.matricule})` : ""}
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" variant="outline-secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="cnss-btn-primary">
          {isEdit ? "Enregistrer" : "Créer la demande"}
        </Button>
      </div>
    </Form>
  );
};

export default AddDemandeMobilite;
