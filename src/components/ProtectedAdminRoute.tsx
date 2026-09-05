import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export function ProtectedAdminRoute() {
  const location = useLocation();
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/secure-admin-login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
