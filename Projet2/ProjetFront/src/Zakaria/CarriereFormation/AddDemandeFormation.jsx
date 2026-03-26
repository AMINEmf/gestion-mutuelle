import React, { useMemo, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { User, GraduationCap, FileText, ClipboardList, BadgeCheck } from "lucide-react";
import { STATUTS_FORMATION, STATUTS_DEMANDE_FORMATION_LIST } from "../../constants/status";

const URGENCES = ["Faible", "Moyenne", "Haute"];
const SOURCES_DEMANDE = ["Manager", "Employé", "Plan annuel", "Obligation légale"];
const STATUTS = STATUTS_DEMANDE_FORMATION_LIST;

const AddDemandeFormation = ({
  employees,
  departements,
  formations = [],
  demande = null,
  mode = "add",
  onSubmit,
  onCancel,
}) => {
  const isEdit = mode === "edit";
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    employe_id: demande?.employe_id ? String(demande.employe_id) : "",
    manager_id: demande?.manager_id ? String(demande.manager_id) : "",
    departement_id: demande?.departement_id ? String(demande.departement_id) : "",
    formation_souhaitee: demande?.formation_souhaitee || "",
    objectif: demande?.objectif || "",
    lien_poste: demande?.lien_poste || "",
    urgence: demande?.urgence || "",
    cout_estime: demande?.cout_estime || "",
    source_demande: demande?.source_demande || "",
    commentaire_rh: demande?.commentaire_rh || "",
    organisation_formation: demande?.organisation_formation || "",
    inscription: demande?.inscription || "",
    suivi_participation: demande?.suivi_participation || "",
    resultat: demande?.resultat || "",
    statut: demande?.statut || STATUTS_FORMATION.EN_ETUDE,
    remove_certificat: false,
  });

  const selectedEmployee = useMemo(
    () => employees.find((emp) => String(emp.id) === String(form.employe_id)) || null,
    [employees, form.employe_id]
  );

  const managerRecord = useMemo(
    () => employees.find((emp) => String(emp.id) === String(form.manager_id)) || null,
    [employees, form.manager_id]
  );

  const departementName = useMemo(() => {
    if (selectedEmployee?.departements?.[0]?.nom) return selectedEmployee.departements[0].nom;
    if (demande?.departement_nom) return demande.departement_nom;
    const found = departements.find((d) => String(d.id) === String(form.departement_id));
    return found?.nom || "";
  }, [selectedEmployee, demande, departements, form.departement_id]);

  const managerName = useMemo(() => {
    if (managerRecord) return `${managerRecord.nom || ""} ${managerRecord.prenom || ""}`.trim();
    if (demande?.manager_nom_complet) return demande.manager_nom_complet;
    return "";
  }, [managerRecord, demande]);

  const formationOptions = useMemo(() => {
    const labels = formations
      .map((formation) => formation?.titre || formation?.nom || formation?.intitule || formation?.label || formation?.code || "")
      .map((value) => String(value).trim())
      .filter(Boolean);

    return [...new Set(labels)].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  }, [formations]);

  const handleField = (key, value) => {
    if (key === "employe_id") {
      const emp = employees.find((item) => String(item.id) === String(value));
      setForm((prev) => ({
        ...prev,
        employe_id: value,
        manager_id: emp?.manager_id ? String(emp.manager_id) : "",
        departement_id: emp?.departement_id ? String(emp.departement_id) : "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.employe_id) next.employe_id = "L’employé est obligatoire.";
    if (!String(form.formation_souhaitee || "").trim()) next.formation_souhaitee = "La formation souhaitée est obligatoire.";
    if (!String(form.objectif || "").trim()) next.objectif = "L’objectif est obligatoire.";
    if (!form.urgence) next.urgence = "Le niveau d’urgence est obligatoire.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "remove_certificat") {
        payload.append(key, value ? "1" : "0");
        return;
      }
      if (value === null || value === undefined || value === "") return;
      payload.append(key, value);
    });

    if (file) {
      payload.append("certificat", file);
    }

    if (!isEdit) {
      payload.set("statut", STATUTS_FORMATION.EN_ETUDE);
    }

    return payload;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(buildPayload());
  };

  const renderError = (name) => (errors[name] ? <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors[name]}</div> : null);

  const showSuiviFormation = isEdit && [STATUTS_FORMATION.VALIDEE, STATUTS_FORMATION.PLANIFIEE, STATUTS_FORMATION.REALISEE].includes(form.statut);

  return (
    <Form onSubmit={submit}>
      <div className="mb-3">
        <div className="cnss-section-title">
          <User size={14} />
          <span>Section 1 : Informations employé</span>
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <label className="cnss-form-label">Employé <span className="text-danger">*</span></label>
            <Form.Select className="cnss-form-control" value={form.employe_id} onChange={(e) => handleField("employe_id", e.target.value)}>
              <option value="">Sélectionner un employé</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {(emp.nom || "") + " " + (emp.prenom || "")} {emp.matricule ? `(${emp.matricule})` : ""}
                </option>
              ))}
            </Form.Select>
            {renderError("employe_id")}
          </div>

          <div className="col-md-6">
            <label className="cnss-form-label">Département</label>
            <Form.Control className="cnss-form-control" value={departementName || ""} readOnly />
          </div>

          <div className="col-md-6">
            <label className="cnss-form-label">Manager</label>
            <Form.Control className="cnss-form-control" value={managerName || ""} readOnly />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="cnss-section-title">
          <GraduationCap size={14} />
          <span>Section 2 : Formation</span>
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <label className="cnss-form-label">Formation souhaitée <span className="text-danger">*</span></label>
            <Form.Select className="cnss-form-control" value={form.formation_souhaitee} onChange={(e) => handleField("formation_souhaitee", e.target.value)}>
              <option value="">Sélectionner une formation</option>
              {formationOptions.map((formation) => (
                <option key={formation} value={formation}>{formation}</option>
              ))}
              {form.formation_souhaitee && !formationOptions.includes(form.formation_souhaitee) ? (
                <option value={form.formation_souhaitee}>{form.formation_souhaitee}</option>
              ) : null}
            </Form.Select>
            {renderError("formation_souhaitee")}
          </div>

          <div className="col-md-6">
            <label className="cnss-form-label">Urgence <span className="text-danger">*</span></label>
            <Form.Select className="cnss-form-control" value={form.urgence} onChange={(e) => handleField("urgence", e.target.value)}>
              <option value="">Sélectionner</option>
              {URGENCES.map((item) => <option key={item} value={item}>{item}</option>)}
            </Form.Select>
            {renderError("urgence")}
          </div>

          <div className="col-md-6">
            <label className="cnss-form-label">Estimation coût</label>
            <Form.Control className="cnss-form-control" type="number" min="0" step="0.01" value={form.cout_estime} onChange={(e) => handleField("cout_estime", e.target.value)} />
          </div>

          <div className="col-12">
            <label className="cnss-form-label">Objectif <span className="text-danger">*</span></label>
            <Form.Control className="cnss-form-control" as="textarea" rows={3} value={form.objectif} onChange={(e) => handleField("objectif", e.target.value)} />
            {renderError("objectif")}
          </div>

          <div className="col-12">
            <label className="cnss-form-label">Lien avec poste</label>
            <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.lien_poste} onChange={(e) => handleField("lien_poste", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="cnss-section-title">
          <FileText size={14} />
          <span>Section 3 : Source de la demande</span>
        </div>

        <label className="cnss-form-label">Source</label>
        <Form.Select className="cnss-form-control" value={form.source_demande} onChange={(e) => handleField("source_demande", e.target.value)}>
          <option value="">Sélectionner</option>
          {SOURCES_DEMANDE.map((item) => <option key={item} value={item}>{item}</option>)}
        </Form.Select>
      </div>

      <div className="mb-3">
        <div className="cnss-section-title">
          <ClipboardList size={14} />
          <span>Section 4 : Suivi RH</span>
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <label className="cnss-form-label">Statut</label>
            <Form.Select className="cnss-form-control" value={form.statut} onChange={(e) => handleField("statut", e.target.value)} disabled={!isEdit}>
              {STATUTS.map((item) => <option key={item} value={item}>{item}</option>)}
            </Form.Select>
          </div>
          <div className="col-12">
            <label className="cnss-form-label">Commentaire RH</label>
            <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.commentaire_rh} onChange={(e) => handleField("commentaire_rh", e.target.value)} />
          </div>
        </div>
      </div>

      {showSuiviFormation && (
        <div className="mb-3">
          <div className="cnss-section-title">
            <BadgeCheck size={14} />
            <span>Section 5 : Suivi formation</span>
          </div>

          <div className="row g-2">
            <div className="col-12">
              <label className="cnss-form-label">Organisation formation</label>
              <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.organisation_formation} onChange={(e) => handleField("organisation_formation", e.target.value)} />
            </div>

            <div className="col-12">
              <label className="cnss-form-label">Inscription</label>
              <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.inscription} onChange={(e) => handleField("inscription", e.target.value)} />
            </div>

            <div className="col-12">
              <label className="cnss-form-label">Suivi participation</label>
              <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.suivi_participation} onChange={(e) => handleField("suivi_participation", e.target.value)} />
            </div>

            <div className="col-12">
              <label className="cnss-form-label">Résultat</label>
              <Form.Control className="cnss-form-control" as="textarea" rows={2} value={form.resultat} onChange={(e) => handleField("resultat", e.target.value)} />
            </div>

            <div className="col-12">
              <label className="cnss-form-label">Certificat</label>
              <Form.Control className="cnss-form-control" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />

              {isEdit && demande?.certificat_url && (
                <div className="mt-2 d-flex flex-column gap-1">
                  <a href={demande.certificat_url} target="_blank" rel="noreferrer">Consulter le certificat actuel</a>
                  <Form.Check type="checkbox" id="removeCertificat" label="Supprimer le certificat actuel" checked={form.remove_certificat} onChange={(e) => handleField("remove_certificat", e.target.checked)} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button type="button" variant="outline-secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" className="cnss-btn-primary">{isEdit ? "Enregistrer" : "Créer la demande"}</Button>
      </div>
    </Form>
  );
};

export default AddDemandeFormation;
