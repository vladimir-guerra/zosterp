import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CompanyContext = createContext();
const API_URL = `${import.meta.env.VITE_API_URL}/company`;

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedCompany = localStorage.getItem("currentCompany");
      if (storedCompany) {
        setCurrentCompany(JSON.parse(storedCompany));
      }
    } catch (error) {
      console.error("Error al leer currentCompany de localStorage:", error);
      localStorage.removeItem("currentCompany");
    }
  }, []);

  const selectCompany = useCallback((company) => {
    setCurrentCompany(company);
    if (company) {
      localStorage.setItem("currentCompany", JSON.stringify(company));
    } else {
      localStorage.removeItem("currentCompany");
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}`, { 
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener compañías");
      const jsonResponse = await response.json();
      setCompanies(jsonResponse.data || []);
    } catch (error) {
      console.error("Error en fetchCompanies:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCompany = useCallback(async (payload) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al crear la empresa");
      const jsonResponse = await response.json();
      
      if (jsonResponse.data) {
        setCompanies((prev) => [...prev, jsonResponse.data]);
      }
      return jsonResponse.data;
    } catch (error) {
      console.error("Error en createCompany:", error);
      throw error;
    }
  }, []);

  const updateCompany = useCallback(async (companyId, payload) => {
    try {
      const response = await fetch(`${API_URL}/${companyId}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error al actualizar la empresa");
      const jsonResponse = await response.json();
      
      setCompanies((prev) => prev.map(c => c.id === companyId ? jsonResponse.data : c));
      
      setCurrentCompany((prev) => {
        if (prev?.id === companyId) {
          localStorage.setItem("currentCompany", JSON.stringify(jsonResponse.data));
          return jsonResponse.data;
        }
        return prev;
      });

      return jsonResponse.data;
    } catch (error) {
      console.error("Error en updateCompany:", error);
      throw error;
    }
  }, []);

  const deleteCompany = useCallback(async (companyId) => {
    try {
      const response = await fetch(`${API_URL}/${companyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar la empresa");
      
      setCompanies((prev) => prev.filter(c => c.id !== companyId));
      
      setCurrentCompany((prev) => {
        if (prev?.id === companyId) {
          localStorage.removeItem("currentCompany");
          return null;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error en deleteCompany:", error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      companies,
      currentCompany,
      isLoading,
      selectCompany,
      fetchCompanies,
      createCompany,
      updateCompany,
      deleteCompany,
    }),
    [
      companies,
      currentCompany,
      isLoading,
      selectCompany,
      fetchCompanies,
      createCompany,
      updateCompany,
      deleteCompany,
    ]
  );

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);