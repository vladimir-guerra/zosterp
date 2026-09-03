import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CompanyContext = createContext();
const API_URL = import.meta.env.VITE_API_URL_DASHBOARD

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedCompany = localStorage.getItem("currentCompany");
    if (storedCompany) {
      setCurrentCompany(JSON.parse(storedCompany));
    }
  }, []);

  const selectCompany = (company) => {
    setCurrentCompany(company);
    localStorage.setItem("currentCompany", JSON.stringify(company));
  };

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

  const createCompany = async (payload) => {
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
  };

  const updateCompany = async (companyId, payload) => {
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
      
      if (currentCompany?.id === companyId) {
        selectCompany(jsonResponse.data);
      }
      return jsonResponse.data;
    } catch (error) {
      console.error("Error en updateCompany:", error);
      throw error;
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await fetch(`${API_URL}/${companyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar la empresa");
      
      setCompanies((prev) => prev.filter(c => c.id !== companyId));
      
      if (currentCompany?.id === companyId) {
        setCurrentCompany(null);
        localStorage.removeItem("currentCompany");
      }
    } catch (error) {
      console.error("Error en deleteCompany:", error);
      throw error;
    }
  };

  return (
    <CompanyContext.Provider 
      value={{ 
        companies, currentCompany, isLoading, selectCompany, 
        fetchCompanies, createCompany, updateCompany, deleteCompany 
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);