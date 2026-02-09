import React, { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { Button, Card, Table, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaPlus } from "react-icons/fa6";
import { useOpen } from "../../Acceuil/OpenProvider";

const theme = createTheme();

const columns = [
  { key: "employe", label: "Employé" },
  { key: "matricule", label: "Matricule" },
  { key: "dateAccident", label: "Date accident" },
  { key: "heure", label: "Heure" },
  { key: "lieu", label: "Lieu" },
  { key: "typeAccident", label: "Type accident" },
  { key: "gravite", label: "Gravité" },
  { key: "arretTravail", label: "Arrêt travail" },
  { key: "dureeArret", label: "Durée arrêt (j)" },
  { key: "declarationCnss", label: "Déclaration CNSS" },
  { key: "statut", label: "Statut dossier" },
];

const mapApiToUi = (item) => ({
  id: item.id,
  employe: item.employe || item.nom_complet || "N/A",
  matricule: item.matricule || "N/A",
  dateAccident: item.date_accident,
  heure: item.heure,
  lieu: item.lieu,
  typeAccident: item.type_accident,
  gravite: item.gravite,
  arretTravail: item.arret_travail ? "oui" : "non",
  dureeArret: item.duree_arret ?? 0,
  declarationCnss: item.declaration_cnss ? "oui" : "non",
  statut: item.statut,
  departement_id: item.departement_id ? Number(item.departement_id) : null,
});

const mapUiToApi = (form, departementId) => ({
  departement_id: departementId ? Number(departementId) : null,
  employe: form.employe,
  matricule: form.matricule,
  date_accident: form.dateAccident,
  heure: form.heure,
  lieu: form.lieu,
  type_accident: form.typeAccident,
  gravite: form.gravite,
  arret_travail: form.arretTravail === "oui",
  duree_arret: Number(form.dureeArret) || 0,
  declaration_cnss: form.declarationCnss === "oui",
  statut: form.statut,
});

const AccidentTable = forwardRef((props, ref) => {
  const { departementId, departementName = "", includeSubDepartments, getSubDepartmentIds, departements, globalSearch = "" } = props;
  const { dynamicStyles } = useOpen();

  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employe: "",
    matricule: "",
    dateAccident: "",
    heure: "",
    lieu: "",
    typeAccident: "",
    gravite: "léger",
    arretTravail: "non",
    dureeArret: 0,
    declarationCnss: "non",
    statut: "en cours",
  });

  const filtered = useMemo(() => {
    if (!departementId) return accidents;
    const ids = includeSubDepartments && getSubDepartmentIds ? getSubDepartmentIds(departements || [], departementId) : [departementId];
    const normalizedIds = ids.map((id) => Number(id));
    const scoped = accidents.filter((a) => normalizedIds.includes(Number(a.departement_id)));
    return scoped.length ? scoped : accidents;
  }, [accidents, departementId, includeSubDepartments, getSubDepartmentIds, departements]);

  const searched = useMemo(() => {
    if (!globalSearch.trim()) return filtered;
    const term = globalSearch.toLowerCase();
    return filtered.filter((row) =>
      columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(term))
    );
  }, [filtered, globalSearch]);

  const resetForm = useCallback(() => {
    setForm({
      employe: "",
      matricule: "",
      dateAccident: "",
      heure: "",
      lieu: "",
      typeAccident: "",
      gravite: "léger",
      arretTravail: "non",
      dureeArret: 0,
      declarationCnss: "non",
      statut: "en cours",
    });
  }, []);

  const loadAccidents = useCallback(() => {
    setLoading(true);
    setError("");
    axios
      .get("http://127.0.0.1:8000/api/accidents")
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : [];
        setAccidents(payload.map(mapApiToUi));
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les accidents.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAccidents();
  }, [loadAccidents]);

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = mapUiToApi(form, departementId);
    axios
      .post("http://127.0.0.1:8000/api/accidents", payload)
      .then((res) => {
        const created = mapApiToUi(res.data);
        setAccidents((prev) => [...prev, created]);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible d'enregistrer l'accident.");
      });
  };

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Accidents de travail ${departementName}`, 14, 18);
    doc.autoTable({
      head: [columns.map((c) => c.label)],
      body: searched.map((row) => columns.map((c) => row[c.key] ?? "")),
      startY: 24,
    });
    doc.save(`accidents_${departementName || "tous"}.pdf`);
  }, [searched, departementName]);

  const exportToExcel = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(
      searched.map((row) => {
        const r = {};
        columns.forEach((c) => {
          r[c.label] = row[c.key];
        });
        return r;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accidents");
    XLSX.writeFile(wb, `accidents_${departementName || "tous"}.xlsx`);
  }, [searched, departementName]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    const head = columns.map((c) => `<th>${c.label}</th>`).join("");
    const body = searched
      .map((row) => `<tr>${columns.map((c) => `<td>${row[c.key] ?? ""}</td>`).join("")}</tr>`)
      .join("");
    printWindow.document.write(`
      <html><head><style>
      table { width: 100%; border-collapse: collapse; font-family: Arial; }
      th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
      th { background: #f5f5f5; }
      </style></head><body>
      <h2>Accidents de travail ${departementName}</h2>
      <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [searched, departementName]);

  useImperativeHandle(ref, () => ({
    exportToPDF,
    exportToExcel,
    handlePrint,
  }));

  const renderRow = (row) => (
    <tr key={row.id}>
      {columns.map((c) => (
        <td key={c.key}>{row[c.key]}</td>
      ))}
    </tr>
  );

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ ...dynamicStyles, p: 2 }}>
        <Card className="shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Accidents de travail</h5>
              <small className="text-muted">Suivi des accidents déclarés</small>
            </div>
            <Button variant="success" onClick={() => setShowModal(true)} disabled={!departementId}>
              <FaPlus className="me-2" /> Ajouter un accident
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            {error && <Alert variant="danger" className="m-3">{error}</Alert>}
            {loading && (
              <div className="d-flex align-items-center gap-2 px-3 py-2">
                <Spinner animation="border" size="sm" />
                <span>Chargement...</span>
              </div>
            )}
            <div className="table-responsive">
              <Table hover striped className="mb-0">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c.key}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{searched.map(renderRow)}</tbody>
              </Table>
            </div>
            {searched.length === 0 && !loading && (
              <div className="text-center py-3 text-muted">Aucun accident trouvé.</div>
            )}
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={handleClose} centered>
          <Form onSubmit={handleSave}>
            <Modal.Header closeButton>
              <Modal.Title>Ajouter un accident de travail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Employé</Form.Label>
                <Form.Control name="employe" value={form.employe} onChange={handleInput} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Matricule</Form.Label>
                <Form.Control name="matricule" value={form.matricule} onChange={handleInput} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date accident</Form.Label>
                <Form.Control type="date" name="dateAccident" value={form.dateAccident} onChange={handleInput} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Heure</Form.Label>
                <Form.Control type="time" name="heure" value={form.heure} onChange={handleInput} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lieu</Form.Label>
                <Form.Control name="lieu" value={form.lieu} onChange={handleInput} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type accident</Form.Label>
                <Form.Control name="typeAccident" value={form.typeAccident} onChange={handleInput} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gravité</Form.Label>
                <Form.Select name="gravite" value={form.gravite} onChange={handleInput}>
                  <option value="léger">Léger</option>
                  <option value="grave">Grave</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Arrêt de travail</Form.Label>
                <Form.Select name="arretTravail" value={form.arretTravail} onChange={handleInput}>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Durée arrêt (jours)</Form.Label>
                <Form.Control type="number" min="0" name="dureeArret" value={form.dureeArret} onChange={handleInput} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Déclaration CNSS</Form.Label>
                <Form.Select name="declarationCnss" value={form.declarationCnss} onChange={handleInput}>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Statut dossier</Form.Label>
                <Form.Select name="statut" value={form.statut} onChange={handleInput}>
                  <option value="en cours">En cours</option>
                  <option value="déclaré">Déclaré</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Fermer
              </Button>
              <Button variant="primary" type="submit" disabled={!departementId}>
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Box>
    </ThemeProvider>
  );
});

export default AccidentTable;
