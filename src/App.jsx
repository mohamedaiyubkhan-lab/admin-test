
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AdminProvider } from "./admin/context/AdminContext";

import AdminSidebar from "./admin/components/AdminSidebar";
import AdminHeader from "./admin/components/AdminHeader";

import AdminDashboard from "./admin/pages/AdminDashboard";
import DepartmentManagement from "./admin/pages/DepartmentManagement";
import DoctorManagement from "./admin/pages/DoctorManagement";
import CreateDoctor from "./admin/pages/CreateDoctor";
import UserManagement from "./admin/pages/UserManagement";
import RoleManagement from "./admin/pages/RoleManagement";
import Reports from "./admin/pages/Reports";
import Settings from "./admin/pages/Settings";

import "./admin/styles/Admin.css";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const titles = {
    "/admin": "Admin Overview",
    "/admin/departments": "Department Management",
    "/admin/doctors": "Doctor Management",
    "/admin/doctors/create": "Create Doctor Profile",
    "/admin/users": "User Management",
    "/admin/roles": "Roles & Permissions",
    "/admin/reports": "Reports & Analytics",
    "/admin/settings": "System Settings",
  };

  const title = titles[location.pathname] || "Admin Dashboard";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logout functionality will be connected with Admin Login.");
      navigate("/admin");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        <AdminHeader title={title} />

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route
              path="departments"
              element={<DepartmentManagement />}
            />

            <Route
              path="doctors"
              element={<DoctorManagement />}
            />

            <Route
              path="doctors/create"
              element={<CreateDoctor />}
            />

            <Route
              path="doctors/edit/:doctorId"
              element={<CreateDoctor />}
            />

            <Route
              path="users"
              element={<UserManagement />}
            />

            <Route
              path="roles"
              element={<RoleManagement />}
            />

            <Route
              path="reports"
              element={<Reports />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/admin" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
