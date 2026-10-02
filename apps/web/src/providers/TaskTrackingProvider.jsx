import { createContext, useContext, useState, useCallback, useMemo } from "react";

const TaskTrackingContext = createContext();
export const useTaskTracking = () => useContext(TaskTrackingContext);

const API_URL = import.meta.env.VITE_API_URL;

const URL_ASSIGNMENTS = `${API_URL}/assignments`;
const URL_TIMESHEETS = `${API_URL}/timesheets`;

export const TaskTrackingProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ASSIGNMENTS 

  const fetchAssignments = useCallback(async (taskId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_ASSIGNMENTS}/task/${taskId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al obtener asignaciones");
      setAssignments(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAssignment = useCallback(async (companyId, taskId, payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_ASSIGNMENTS}/${companyId}/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al asignar");
      await fetchAssignments(taskId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAssignments]);

  const updateAssignment = useCallback(async (companyId, assignmentId, payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_ASSIGNMENTS}/${companyId}/${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar asignación");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAssignment = useCallback(async (companyId, assignmentId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_ASSIGNMENTS}/${companyId}/${assignmentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar asignación");
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // TIMESHEETS 

  const fetchTimesheets = useCallback(async (companyId) => {
    if (!companyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/${companyId}`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al obtener tiempos");
      setTimesheets(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTimesheet = useCallback(async (payload, companyId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al registrar tiempo");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTimesheet = useCallback(async (payload, companyId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/${companyId}/${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar tiempo");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTimesheet = useCallback(async (payload, companyId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/${companyId}/${payload.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar tiempo");
      if (payload.id) setTimesheets((prev) => prev.filter((t) => t.id !== payload.id));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      assignments,
      timesheets,
      isLoading,
      error,
      fetchAssignments,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      fetchTimesheets,
      createTimesheet,
      updateTimesheet,
      deleteTimesheet,
    }),
    [
      assignments,
      timesheets,
      isLoading,
      error,
      fetchAssignments,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      fetchTimesheets,
      createTimesheet,
      updateTimesheet,
      deleteTimesheet,
    ]
  );

  return (
    <TaskTrackingContext.Provider value={contextValue}>
      {children}
    </TaskTrackingContext.Provider>
  );
};