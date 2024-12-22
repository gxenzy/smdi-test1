import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ElectricalSystem from './pages/ElectricalSystem';
import EnergyAudit from './pages/EnergyAudit';
import SystemTools from './pages/SystemTools';
import Testing from './pages/Testing';
import TamEvaluation from './pages/TamEvaluation';
import UserManagement from './pages/UserManagement';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';
import { UserRole } from './types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Login />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/electrical-system"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <ElectricalSystem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/energy-audit"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <EnergyAudit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/system-tools"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.MODERATOR]}>
              <SystemTools />
            </ProtectedRoute>
          }
        />

        <Route
          path="/testing"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
              <Testing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tam-evaluation"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR]}>
              <TamEvaluation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
