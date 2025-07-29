import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TransactionHistory from "./pages/TransactionHistory";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Navigate
            to={user?.role === "admin" ? "/admin" : "/dashboard"}
            replace
          />
        }
      />

      <Route path="/" element={<Layout />}>
        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="p-6 bg-white/80 backdrop-blur-lg rounded-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Settings
                </h1>
                <p className="text-gray-600">
                  User settings panel coming soon...
                </p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Default redirects */}
      <Route
        path="/"
        element={
          <Navigate
            to={user?.role === "admin" ? "/admin" : "/dashboard"}
            replace
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={user?.role === "admin" ? "/admin" : "/dashboard"}
            replace
          />
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
