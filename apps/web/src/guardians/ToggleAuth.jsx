import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers";

export default function ToggleAuth({ requireUser, children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <p>...</p>;
  const condition = requireUser ? isAuthenticated : !isAuthenticated;
  const nav = requireUser ? "/auth/login" : "/erp";
  if (condition) return children ? children : <Outlet />;
  return <Navigate to={nav} replace />;
}
