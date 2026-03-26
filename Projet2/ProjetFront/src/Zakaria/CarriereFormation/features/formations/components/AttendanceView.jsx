import React, { useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Swal from "sweetalert2";
import SectionTitle from "../../../../CNSS/SectionTitle";
import { useFormationAttendance } from "../useFormationAttendance";
import { ClipboardList } from "lucide-react";

const STATUT_OPTIONS = ["Présent", "Absent", "Retard"];

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("fr-FR");
  } catch {
    return d;
  }
};

/**
 * AttendanceView
 *
 * Full-panel attendance management for a given session.
 * Displayed inside the Drawer when user clicks "Gérer présence".
 *
 * Props:
 *  - session       {Object} – the session object (id, date, salle, etc.)
 *  - onBack()      – called to return to the formation view
 *  - onSaved()     – called after successfully saving attendance (optional)
 */
const AttendanceView = ({ session, onBack, onSaved }) => {
  const {
    attendance,
    loading,
    saving,
    error,
    fetchAttendance,
    updateRow,
    saveAttendance,
  } = useFormationAttendance(session?.id);

  useEffect(() => {
    if (session?.id) fetchAttendance();
  }, [session?.id, fetchAttendance]);

  const handleSave = async () => {
    try {
      await saveAttendance();
      Swal.fire({ icon: "success", title: "Présences enregistrées", timer: 1400, showConfirmButton: false });
      // Notify parent to refresh data
      if (onSaved) onSaved();
    } catch {
      Swal.fire({ icon: "error", title: "Erreur", text: "Impossible d'enregistrer les présences." });
    }
  };

  const formatDateRange = () => {
    const parts = [formatDate(session?.date)];
    if (session?.heure_debut) {
      const h = `${session.heure_debut}${session.heure_fin ? ` – ${session.heure_fin}` : ""}`;
      parts.push(h);
    }
    if (session?.salle) parts.push(`Salle : ${session.salle}`);
    return parts.join(" · ");
  };

  return (
    <div>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "#3a8a90",
          fontWeight: 600,
          fontSize: "0.85rem",
          cursor: "pointer",
          padding: 0,
          marginBottom: "16px",
        }}
      >
        <ArrowLeft size={16} /> Retour à la formation
      </button>

      {/* Session info strip */}
      <div style={{
        backgroundColor: "#f0fafa",
        border: "1px solid #c7e8ea",
        borderRadius: "8px",
        padding: "10px 14px",
        marginBottom: "18px",
      }}>
        <SectionTitle iconComponent={ClipboardList} text="Gestion des présences" />
        <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#4b5563" }}>{formatDateRange()}</p>
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "12px" }}>{error}</p>
      )}

      {/* Loading */}
      {loading ? (
        <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Chargement…</p>
      ) : attendance.length === 0 ? (
        <p style={{ fontSize: "0.85rem", color: "#9ca3af", textAlign: "center", padding: "20px" }}>
          Aucun participant inscrit.
        </p>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={thStyle}>Participant</th>
                  {STATUT_OPTIONS.map((s) => (
                    <th key={s} style={{ ...thStyle, textAlign: "center", width: "70px" }}>{s}</th>
                  ))}
                  <th style={thStyle}>Remarque</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((row) => (
                  <tr key={row.employe_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: "#1f2937" }}>{row.employe}</span>
                      {row.departement && (
                        <span style={{ display: "block", fontSize: "0.76rem", color: "#9ca3af" }}>{row.departement}</span>
                      )}
                    </td>
                    {STATUT_OPTIONS.map((statut) => (
                      <td key={statut} style={{ ...tdStyle, textAlign: "center" }}>
                        <input
                          type="radio"
                          name={`statut_${row.employe_id}`}
                          value={statut}
                          checked={row.statut === statut}
                          onChange={() => updateRow(row.employe_id, "statut", statut)}
                          style={{ cursor: "pointer", accentColor: "#3a8a90" }}
                        />
                      </td>
                    ))}
                    <td style={tdStyle}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.remarque || ""}
                        onChange={(e) => updateRow(row.employe_id, "remarque", e.target.value)}
                        placeholder="Remarque…"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Save button */}
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                backgroundColor: "#3a8a90",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={15} /> {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const thStyle = {
  padding: "8px 10px",
  textAlign: "left",
  fontWeight: 700,
  color: "#374151",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "7px 10px",
  color: "#374151",
  verticalAlign: "middle",
};

export default AttendanceView;
