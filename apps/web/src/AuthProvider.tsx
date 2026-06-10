import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  user: any | null; // Cambia 'any' por tu interfaz de usuario
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const login = (userData: any) => {
    try {
      setIsLoading(true)
      setUser(userData);
    } catch (error) {   
    }finally{
      setIsLoading(false)
    }
  }
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};