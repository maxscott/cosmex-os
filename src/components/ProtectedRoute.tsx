import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

