// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import ArtistList from "./pages/ArtistList";
import AddArtist from "./pages/AddArtist";
import LoginPage from "./pages/LoginPage";
import OtpVerifyPage from "./pages/OtpVerifyPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "./App.css";

// Wrapper for protected routes (requires login, and optionally roles)
function ProtectedRoute({ children, roles }) {
  const { auth } = useAuth();

  // Not logged in
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Role-restricted
  if (roles && !roles.includes(auth.role)) {
    return <p>You do not have permission to access this page.</p>;
  }

  return children;
}

// Layout with header + nav + main content
function Layout() {
  const { auth, logout } = useAuth();

  return (
    <>
      <header className="app-header">
        <h1>Music Artist Classification</h1>

        <nav className="nav-links">
          <Link to="/">Home</Link>

          {auth.token && <Link to="/favorites">My Favorites</Link>}
          {auth.token && <Link to="/profile">My Profile</Link>}

          {auth.token && auth.role === "admin" && (
            <Link to="/add">Add Artist</Link>
          )}

          {!auth.token && <Link to="/login">Login</Link>}

          {auth.token && (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          {/* Public */}
          <Route path="/" element={<ArtistList />} />

          {/* Protected + role restricted (admin) */}
          <Route
            path="/add"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddArtist />
              </ProtectedRoute>
            }
          />

          {/* Protected (logged in, any role) */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<OtpVerifyPage />} />

          {/* Fallback */}
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
