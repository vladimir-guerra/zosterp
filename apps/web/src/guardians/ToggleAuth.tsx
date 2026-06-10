import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { ErpLayout } from "../layouts";

interface Props {
  requireAuth: boolean;
}

export const ToogleAuth = ({ requireAuth = true }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <p>Cargando...</p>;
  const condition = requireAuth ? isAuthenticated : !isAuthenticated;
  const nav = requireAuth ? "/auth/login" : "/erp";
  const Component = requireAuth ? <ErpLayout /> : <Outlet />;
  return condition ? Component : <Navigate to={nav} replace />;
};
