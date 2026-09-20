import React, { createContext, useContext, useState, useCallback } from "react";

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

  const createAssignment = async (companyId, taskId, payload) => {
    setIsLoading(true);
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
  };

  const updateAssignment = async (companyId, assignmentId, payload) => {
    setIsLoading(true);
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
  };

  const deleteAssignment = async (companyId, assignmentId) => {
    setIsLoading(true);
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
  };

  // TIMESHEETS 

  const fetchTimesheets = useCallback(async (taskId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_TIMESHEETS}?taskId=${taskId}`, {
        credentials: "include",
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

  const createTimesheet = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/newTimesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al registrar tiempo");
      if (payload.taskId) await fetchTimesheets(payload.taskId);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimesheet = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/${payload.id}`, {
        method: "PUT",
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
  };

  const deleteTimesheet = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL_TIMESHEETS}/${payload.id}`, {
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
  };

  return (
    <TaskTrackingContext.Provider
      value={{
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
      }}
    >
      {children}
    </TaskTrackingContext.Provider>
  );
};