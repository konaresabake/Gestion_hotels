import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import HotelList from "./pages/HotelList";
import HotelDetail from "./pages/HotelDetail";
import CreateHotel from "./pages/CreateHotel";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels"
          element={
            <ProtectedRoute>
              <HotelList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/new"
          element={
            <ProtectedRoute>
              <CreateHotel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotels/:id"
          element={
            <ProtectedRoute>
              <HotelDetail />
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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
