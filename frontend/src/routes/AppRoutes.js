// src/routes/AppRoutes.js
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import CategoryList from "../pages/CategoryManagement/CategoryList";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/category/list"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <CategoryList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
