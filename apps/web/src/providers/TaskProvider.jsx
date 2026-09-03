import { createContext, useContext, useState, useCallback } from "react";
import { useCompany } from "./CompanyProvider";

const TaskContext = createContext();
const API_URL = import.meta.env.VITE_API_URL_DASHBOARD;

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentCompany } = useCompany();

  const fetchTasks = useCallback(async (forcedCompanyId) => {
    const pathSegments = window.location.pathname.split('/');
    const urlCompanyId = pathSegments[2];
    const targetCompanyId = forcedCompanyId || currentCompany?.id || urlCompanyId;

    if (!targetCompanyId || targetCompanyId === "tasks" || targetCompanyId === "erp") {
      setTasks([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${targetCompanyId}/tasks`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener las tareas");
      const jsonResponse = await response.json();
      setTasks(jsonResponse.data || []);
    } catch (error) {
      console.error("Error en fetchTasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompany]);

  const createTask = async (payload) => {
    try {
      const response = await fetch(`${API_URL}/${payload.companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al crear la tarea");

      const jsonResponse = await response.json();

      if (jsonResponse.data) {
        setTasks((prevTasks) => [...prevTasks, jsonResponse.data]);
      }
      return jsonResponse.data;
    } catch (error) {
      console.error("Error en createTask:", error);
      throw error;
    }
  };

  const updateTask = async (companyId, taskId, payload) => {
    try {
      const response = await fetch(`${API_URL}/${companyId}/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al actualizar la tarea");

      const jsonResponse = await response.json();

      if (jsonResponse.data) {
        setTasks((prev) => prev.map(task => task.id === taskId ? jsonResponse.data : task));
      }
      return jsonResponse.data;
    } catch (error) {
      console.error("Error en updateTask:", error);
      throw error;
    }
  };

  const deleteTask = async (companyId, taskId) => {
    try {
      const response = await fetch(`${API_URL}/${companyId}/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar la tarea");
      const data = await response.json();
      console.log(data);
      
      setTasks((prev) => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error en deleteTask:", error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);