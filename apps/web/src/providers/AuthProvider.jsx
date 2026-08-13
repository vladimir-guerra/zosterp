import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(undefined);
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const hasInfo = data.info && Object.keys(data.info).length > 0;

        const errorMsg = hasInfo
          ? Object.values(data.info)[0]
          : "Ocurrió un error inesperado en el registro. Verifique sus datos.";

        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error("Error al registrar:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const [accessToken, setAccessToken] = useState(null);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.info?.invalid_credentials || "Error de credenciales");
      }

      // 1. Obtenemos el token de acceso
      const data = await response.json();
      setAccessToken(data.accessToken);

      // 2. 💡 Usamos el token para buscar los datos reales del usuario
      const meResponse = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${data.accessToken}` // Adjuntamos el Pase VIP
        }
      });

      if (!meResponse.ok) {
        throw new Error("No se pudo obtener el perfil del usuario");
      }

      const meData = await meResponse.json();

      // 3. Ahora SÍ guardamos el usuario real (suponiendo que tu endpoint devuelve { user: {...} })
      setUser(meData.user);

      return true;
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, isLoading, register }}
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