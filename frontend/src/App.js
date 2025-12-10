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
import ArtistDetailPage from "./pages/ArtistDetailPage";

import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// Wrapper for protected routes (requires login, and optionally roles)
function ProtectedRoute({ children, roles }) {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.role)) {
    return <p className="info-message">You do not have permission to access this page.</p>;
  }

  return children;
}

function Layout() {
  const { auth, logout } = useAuth();

  return (
    <>
      <header className="app-header">
        <span className="app-title">MusicArtistClass</span>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          {auth.token && <Link to="/favorites">Favorites</Link>}
          {auth.token && <Link to="/profile">Profile</Link>}
          {auth.token && auth.role === "admin" && (
            <Link to="/add" className="primary-chip">
              Add Artist
            </Link>
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
          {/* Home list */}
          <Route path="/" element={<ArtistList />} />

          {/* Artist detail */}
          <Route path="/artists/:id" element={<ArtistDetailPage />} />

          {/* Admin add artist */}
          <Route
            path="/add"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddArtist />
              </ProtectedRoute>
            }
          />

          {/* Favorites & profile */}
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

          {/* Auth */}
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
