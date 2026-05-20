import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";

export default function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, booting } = useAuth();

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "staff") return <Navigate to="/staff/billing" replace />;
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
