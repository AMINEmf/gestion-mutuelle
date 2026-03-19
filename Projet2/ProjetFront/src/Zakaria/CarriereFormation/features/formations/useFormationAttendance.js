import { useState, useCallback } from "react";
import apiClient from "../../../../services/apiClient";

/**
 * Hook for managing attendance of a specific session.
 *
 * @param {number|string} sessionId
 */
export function useFormationAttendance(sessionId) {
  const [attendance, setAttendance] = useState([]);
  const [session, setSession]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);

  const fetchAttendance = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/sessions/${sessionId}/attendance`);
      setSession(res.data.session ?? null);
      setAttendance(Array.isArray(res.data.attendance) ? res.data.attendance : []);
    } catch (err) {
      console.error("useFormationAttendance fetch error:", err);
      setError("Impossible de charger les présences.");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** Local optimistic update before save */
  const updateRow = useCallback((employeId, field, value) => {
    setAttendance((prev) =>
      prev.map((row) =>
        row.employe_id === employeId ? { ...row, [field]: value } : row
      )
    );
  }, []);

  const saveAttendance = useCallback(async () => {
    setSaving(true);
    try {
      await apiClient.post(`/sessions/${sessionId}/attendance/bulk-update`, {
        rows: attendance.map(({ employe_id, statut, remarque }) => ({
          employe_id,
          statut,
          remarque: remarque || null,
        })),
      });
    } finally {
      setSaving(false);
    }
  }, [sessionId, attendance]);

  return {
    attendance,
    session,
    loading,
    saving,
    error,
    fetchAttendance,
    updateRow,
    saveAttendance,
  };
}
