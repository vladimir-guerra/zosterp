import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, api } from "../services/api.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSetToken = (token) => {
    setAccessToken(token);
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/refresh");
        if (response.data.accessToken)
          handleSetToken(response.data.accessToken);
      } catch (error) {
        handleSetToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    setError(null);
  }, []);

  const TFA = async (code, token) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post(`/auth/2FA`, { code }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.accessToken)
        handleSetToken(response.data.accessToken);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error de autenticación";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPassword = async(email) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post(`/auth/password`, { email });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error de autenticación";
      setError(errorMessage);
      throw error;
      return false
    } finally {
      setIsLoading(false);
    }
  }

  const auth = async (userData, register = true) => {
    try {
      setError(null);
      setIsLoading(true);
      const endpoint = register ? "/auth/register" : "/auth/login";
      const response = await api.post(endpoint, userData);

      if (response.data?.token) return { to2FA: true, token: response.data.token };
      else {
        handleSetToken(response.data.accessToken);
        return { to2FA: false };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error de autenticación";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await api.get(`/auth/logout`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error al cerrar sesión";
      setError(errorMessage);
    } finally {
      handleSetToken(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, logout, isLoading, auth, TFA, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};