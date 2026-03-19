import { useState, useCallback } from "react";
import apiClient from "../../../../services/apiClient";

/**
 * Hook for fetching smart-scored participant suggestions for a formation.
 *
 * Each suggestion contains:
 *   id, name, matricule, department,
 *   formation_count, last_training_date, months_since_training,
 *   skill_gap, score (0-100), domain_match, reasons[]
 *
 * @param {number|string} formationId
 */
export function useSmartSuggestions(formationId) {
  const [suggestions, setSuggestions]  = useState([]);
  const [loading, setLoading]          = useState(false);
  const [error, setError]              = useState(null);

  const fetchSuggestions = useCallback(async () => {
    if (!formationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/formations/${formationId}/smart-suggestions`);
      setSuggestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("useSmartSuggestions error:", err);
      setError("Impossible de charger les suggestions intelligentes.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [formationId]);

  /** Optimistically remove after the employee is added as participant */
  const removeFromSuggestions = useCallback((employeId) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== employeId));
  }, []);

  return { suggestions, loading, error, fetchSuggestions, removeFromSuggestions };
}
