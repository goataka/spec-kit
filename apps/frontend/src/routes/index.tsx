import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AttendancePage } from '../pages/AttendancePage';
import { UsersPage } from '../pages/admin/UsersPage';
import { EmployeesPage } from '../pages/admin/EmployeesPage';
import { AttendanceManagementPage } from '../pages/admin/AttendanceManagementPage';
import { Layout } from '../components/layout/Layout';
import { PrivateRoute } from '../components/common/PrivateRoute';
import { AdminRoute } from '../components/common/AdminRoute';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<AttendancePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          
          {/* Admin routes */}
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/employees"
            element={
              <AdminRoute>
                <EmployeesPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/attendance"
            element={
              <AdminRoute>
                <AttendanceManagementPage />
              </AdminRoute>
            }
          />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
