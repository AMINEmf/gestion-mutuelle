import { useState, useCallback } from "react";
import apiClient from "../../../../services/apiClient";

/**
 * Hook for fetching/managing AI-suggested participants for a formation.
 *
 * @param {number|string} formationId
 */
export function useSuggestedParticipants(formationId) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchSuggestions = useCallback(async () => {
    if (!formationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/formations/${formationId}/suggested-participants`);
      setSuggestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("useSuggestedParticipants error:", err);
      setError("Impossible de charger les suggestions.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [formationId]);

  /** Optimistically remove after adding as participant */
  const removeFromSuggestions = useCallback((employeId) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== employeId));
  }, []);

  return { suggestions, loading, error, fetchSuggestions, removeFromSuggestions };
}
