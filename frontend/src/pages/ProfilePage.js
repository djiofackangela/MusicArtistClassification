// frontend/src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

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
    return <p>You must be logged in to view your profile.</p>;
  }

  return (
    <div className="page">
      <h2>My Profile</h2>
      {error && <p className="error">{error}</p>}
      {!profile ? (
        <p>Loading...</p>
      ) : (
        <div className="profile-card">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
