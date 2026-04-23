import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, role, loading } = useAuth();

  
  if (loading) return null;

  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  
  return children;
}
