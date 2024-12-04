import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRoles = [] }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles.length === 0 || requiredRoles.includes(user.role)) {
        return children;
    }

    // Unauthorized
    return <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
