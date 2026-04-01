import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function ProtectRoute({ children, adminOnly }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectRoute;
