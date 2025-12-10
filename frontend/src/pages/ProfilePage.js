// frontend/src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// Helper function to get user avatar initials and colors
const getUserAvatarInitials = (email) => {
  if (!email) return "?";
  const name = email.split("@")[0];
  const parts = name.split(".");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getUserAvatarColor = (email) => {
  const colors = [
    "linear-gradient(135deg, #845ec2, #d65db1)",
    "linear-gradient(135deg, #b39ddb, #f06292)",
    "linear-gradient(135deg, #7986cb, #ef5350)",
    "linear-gradient(135deg, #64b5f6, #ba68c8)",
    "linear-gradient(135deg, #81c784, #66bb6a)",
    "linear-gradient(135deg, #ffb74d, #ff7043)",
    "linear-gradient(135deg, #4db8ff, #b19cd9)",
    "linear-gradient(135deg, #ce93d8, #f48fb1)",
  ];
  const hash = email.charCodeAt(0) + email.charCodeAt(email.length - 1);
  return colors[hash % colors.length];
};

export default function ProfilePage() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load profile.");
      });
  }, []);

  if (!auth.token) {
    return (
      <div className="page">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p className="info-message">You must be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="section-title">My Profile</h2>

      {error && <p className="info-message" style={{ color: "#dc3545" }}>{error}</p>}

      {!profile ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading your profile...</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Avatar Section */}
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "2rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: getUserAvatarColor(profile.email),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "2.5rem",
                fontWeight: "700",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
              }}
            >
              {getUserAvatarInitials(profile.email)}
            </div>
            <h3 style={{ margin: "0.5rem 0 0 0", color: "#222", fontSize: "1.3rem" }}>
              {profile.email}
            </h3>
          </div>

          {/* Profile Info Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Email Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.2rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                borderLeft: "4px solid #845ec2",
              }}
            >
              <p style={{ fontSize: "0.8rem", color: "#999", margin: "0 0 0.4rem 0", fontWeight: "600", textTransform: "uppercase" }}>
                Email Address
              </p>
              <p style={{ fontSize: "1rem", color: "#222", margin: "0", fontWeight: "500" }}>
                {profile.email}
              </p>
            </div>

            {/* Role Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.2rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                borderLeft: "4px solid #d65db1",
              }}
            >
              <p style={{ fontSize: "0.8rem", color: "#999", margin: "0 0 0.4rem 0", fontWeight: "600", textTransform: "uppercase" }}>
                Account Role
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    background: profile.role === "admin" ? "#f3e5ff" : "#e3f2fd",
                    color: profile.role === "admin" ? "#6b5b8c" : "#1976d2",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {profile.role || "User"}
                </span>
              </div>
            </div>

            {/* Created Date Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.2rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                borderLeft: "4px solid #4db8ff",
              }}
            >
              <p style={{ fontSize: "0.8rem", color: "#999", margin: "0 0 0.4rem 0", fontWeight: "600", textTransform: "uppercase" }}>
                Member Since
              </p>
              <p style={{ fontSize: "1rem", color: "#222", margin: "0", fontWeight: "500" }}>
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#999", margin: "0.3rem 0 0 0" }}>
                {new Date(profile.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Account Status */}
          <div
            style={{
              background: "#f0f7ff",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center",
              borderTop: "2px solid #4db8ff",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "#1976d2", margin: "0", fontWeight: "500" }}>
              ✓ Account Active
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
