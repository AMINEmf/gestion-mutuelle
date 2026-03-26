import React, { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import Swal from "sweetalert2";
import "./CareerTraining.css";

const PostesEnAttenteTab = ({ employeeId, onPosteUpdate }) => {
  const [postesEnAttente, setPostesEnAttente] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeId) {
      fetchPostesEnAttente();
    }
  }, [employeeId]);

  const fetchPostesEnAttente = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get(`/employes/${employeeId}/postes-en-attente`);
      setPostesEnAttente(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des postes en attente:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les postes en attente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPoste = async (posteHistoriqueId) => {
    const result = await Swal.fire({
      title: "Accepter ce poste ?",
      text: "L'employé sera affecté à ce nouveau poste et son ancien poste sera clôturé.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "✔ Accepter",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.post(`/carrieres/${posteHistoriqueId}/accept`);
      
      Swal.fire({
        icon: "success",
        title: "Poste accepté",
        text: "Le poste a été accepté avec succès.",
        showConfirmButton: false,
        timer: 1500,
      });

      // Refresh the list
      fetchPostesEnAttente();
      
      // Notify parent to refresh the career tab
      if (onPosteUpdate) {
        onPosteUpdate();
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation du poste:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Impossible d'accepter le poste.",
      });
    }
  };

  const handleRefusePoste = async (posteHistoriqueId) => {
    const result = await Swal.fire({
      title: "Refuser ce poste ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "❌ Refuser",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      await apiClient.post(`/carrieres/${posteHistoriqueId}/refuse`);
      
      Swal.fire({
        icon: "success",
        title: "Poste refusé",
        text: "Le poste a été refusé.",
        showConfirmButton: false,
        timer: 1500,
      });

      // Refresh the list
      fetchPostesEnAttente();
      
      // Notify parent
      if (onPosteUpdate) {
        onPosteUpdate();
      }
    } catch (error) {
      console.error("Erreur lors du refus du poste:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Impossible de refuser le poste.",
      });
    }
  };

  if (!employeeId) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        Sélectionnez un employé pour voir ses postes en attente
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        Chargement...
      </div>
    );
  }

  if (postesEnAttente.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        Aucun poste en attente
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
      {postesEnAttente.map((pending) => (
        <div 
          key={pending.id} 
          style={{ 
            backgroundColor: "#fff", 
            padding: "16px", 
            borderRadius: "8px", 
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "1rem", color: "#334155", marginBottom: "4px" }}>
                {pending.poste || "—"}
              </div>
              {pending.grade && (
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "2px" }}>
                  Grade: {pending.grade}
                </div>
              )}
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Proposé le: {pending.date_proposition || "—"}
              </div>
            </div>
            {pending.type_evolution && (
              <span className="career-badge info" style={{ fontSize: "0.75rem" }}>
                {pending.type_evolution}
              </span>
            )}
          </div>
          
          {/* Competences requises */}
          {(() => {
            const competences = Array.isArray(pending.competences_requises) ? pending.competences_requises : [];
            if (competences.length > 0) {
              return (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                    Compétences requises:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {competences.map((comp) => (
                      <span 
                        key={comp.id}
                        style={{ 
                          fontSize: "0.8rem", 
                          padding: "4px 12px", 
                          borderRadius: "16px",
                          backgroundColor: "#f1f5f9",
                          color: "#475569",
                          border: "1px solid #e2e8f0",
                          fontWeight: 500
                        }}
                      >
                        {comp.nom}
                        {comp.niveau_requis && (
                          <span style={{ color: "#0ea5e9", marginLeft: "4px", fontWeight: 600 }}>
                            {comp.niveau_requis}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => handleAcceptPoste(pending.id)}
              style={{
                flex: 1,
                backgroundColor: "#16a34a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#15803d"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#16a34a"}
            >
              ✔ Accepter
            </button>
            <button
              type="button"
              onClick={() => handleRefusePoste(pending.id)}
              style={{
                flex: 1,
                backgroundColor: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#b91c1c"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#dc2626"}
            >
              ❌ Refuser
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostesEnAttenteTab;
