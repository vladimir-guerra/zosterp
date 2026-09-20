import React, { createContext, useContext, useState, useCallback } from "react";

const AssociatesContext = createContext();

export const useAssociates = () => useContext(AssociatesContext);

const API_URL = `${import.meta.env.VITE_API_URL}/associates`;

export const AssociatesProvider = ({ children }) => {
  const [associates, setAssociates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssociates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al obtener asociados");

      setAssociates(data.data || data.associates || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inviteAssociate = async (companyId, email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/invitation/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al enviar invitación");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createAssociate = async (companyId, userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/workerInvitation/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al crear el asociado");

      await fetchAssociates();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeAssociate = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${email}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar asociado");

      setAssociates((prev) => prev.filter((assoc) => assoc.User.email !== email));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AssociatesContext.Provider
      value={{
        associates,
        isLoading,
        error,
        fetchAssociates,
        inviteAssociate,
        createAssociate,
        removeAssociate,
      }}
    >
      {children}
    </AssociatesContext.Provider>
  );
};