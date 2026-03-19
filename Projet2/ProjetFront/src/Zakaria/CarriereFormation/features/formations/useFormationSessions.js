import { useState, useCallback } from "react";
import apiClient from "../../../../services/apiClient";

/**
 * Hook for managing sessions (planning) of a formation.
 *
 * @param {number|string} formationId
 */
export function useFormationSessions(formationId) {
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!formationId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/formations/${formationId}/sessions`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("useFormationSessions fetch error:", err);
      setError("Impossible de charger les séances.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [formationId]);

  const createSession = useCallback(async (data) => {
    const res = await apiClient.post(`/formations/${formationId}/sessions`, data);
    setSessions((prev) => [...prev, res.data]);
    return res.data;
  }, [formationId]);

  const updateSession = useCallback(async (sessionId, data) => {
    const res = await apiClient.put(`/sessions/${sessionId}`, data);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? res.data : s))
    );
    return res.data;
  }, []);

  const deleteSession = useCallback(async (sessionId) => {
    await apiClient.delete(`/sessions/${sessionId}`);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}
