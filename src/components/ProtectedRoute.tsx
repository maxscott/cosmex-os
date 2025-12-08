import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";

export const ProtectedRoute = () => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">error: {JSON.stringify(error)}</p>
          <p className="text-gray-600">user: {JSON.stringify(user)}</p>
          <p className="text-gray-600">isLoading: {JSON.stringify(isLoading)}</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

