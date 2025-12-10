// src/pages/ArtistDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// Helper function to get initials for avatar
const getAvatarInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to get consistent colors for avatar
const getAvatarColor = (name) => {
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
  const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return colors[hash % colors.length];
};

export default function ArtistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [artist, setArtist] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/artists/${id}`)
      .then((res) => {
        setArtist(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load artist details.");
      });
  }, [id]);

  if (!artist) {
    return (
      <div className="page">
        {message ? <p className="info-message">{message}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="page">
      <button className="link-button" onClick={() => navigate(-1)}>
        ← Back to artists
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-image">
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
                style={{ width: "120px", height: "120px", borderRadius: "16px", objectFit: "cover" }}
              />
            ) : null}
            <div
              className="artist-avatar-detail"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "16px",
                background: getAvatarColor(artist.name),
                display: artist.imageUrl ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "3rem",
                fontWeight: "700",
                textAlign: "center",
                userSelect: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              title={artist.name}
            >
              {getAvatarInitials(artist.name)}
            </div>
          </div>

          <div className="detail-main">
            <h2>{artist.name}</h2>
            {artist.genres && artist.genres.length > 0 && (
              <p className="sub-text">Genres: {artist.genres.join(", ")}</p>
            )}
            {artist.country && (
              <p className="sub-text">Country: {artist.country}</p>
            )}
            {artist.popularity_score != null && (
              <p className="sub-text">
                Popularity score: {artist.popularity_score}
              </p>
            )}
          </div>
        </div>

        {artist.description && (
          <p className="detail-description">{artist.description}</p>
        )}

        <hr className="divider" />

        <section>
          <h3>Song Preview</h3>
          {artist.sampleSongTitle && (
            <p className="sub-text">
              <strong>Track:</strong> {artist.sampleSongTitle}
            </p>
          )}
          {artist.audioPreviewUrl ? (
            <audio
              className="audio-player"
              controls
              src={artist.audioPreviewUrl}
            >
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p className="sub-text">
              No audio preview has been added for this artist yet.
            </p>
          )}
        </section>

        {auth.token && (
          <p className="sub-text muted">
            (Admin can update this artist to change song preview URL and other
            details.)
          </p>
        )}
      </div>
    </div>
  );
}
