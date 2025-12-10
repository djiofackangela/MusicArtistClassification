// src/pages/FavoritesPage.js
import React, { useEffect, useState } from "react";
import api from "../api";

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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Map artistId -> previewUrl from iTunes
  const [previewUrls, setPreviewUrls] = useState({});

  // 1) Load favorites from backend
  useEffect(() => {
    setLoading(true);
    api
      .get("/users/favorites")
      .then((res) => {
        const items = res.data.items || [];
        setFavorites(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load favorites.");
        setLoading(false);
      });
  }, []);

  // 2) For each favorite artist, fetch an audio preview from iTunes
  useEffect(() => {
    async function fetchPreviews() {
      // Avoid hammering iTunes if there are no favorites
      if (!favorites.length) return;

      const newPreviews = {};

      for (const artist of favorites) {
        try {
          // First check if there's already a preview URL stored
          if (artist.audioPreviewUrl) {
            newPreviews[artist._id] = artist.audioPreviewUrl;
            continue;
          }

          // Use sampleSongTitle first, otherwise fall back to artist name
          const term =
            artist.sampleSongTitle && artist.sampleSongTitle.trim().length > 0
              ? `${artist.name} ${artist.sampleSongTitle}`
              : artist.name;

          const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
            term
          )}&entity=song&limit=5&media=music`;

          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error(`iTunes API returned status ${response.status}`);
          }
          
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            // Find first result with a preview URL
            const resultWithPreview = data.results.find(r => r.previewUrl);
            if (resultWithPreview) {
              newPreviews[artist._id] = resultWithPreview.previewUrl;
            } else {
              newPreviews[artist._id] = null;
            }
          } else {
            newPreviews[artist._id] = null;
          }
        } catch (err) {
          console.error("Error fetching iTunes preview for", artist.name, err);
          newPreviews[artist._id] = null;
        }
      }

      setPreviewUrls(newPreviews);
    }

    fetchPreviews();
  }, [favorites]);

  const handleRemoveFavorite = async (artistId) => {
    try {
      await api.delete(`/users/favorites/${artistId}`);
      setFavorites((prev) => prev.filter((a) => a._id !== artistId));
      setMessage("Removed from favorites.");
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.message;
      setMessage(backendMsg || "Failed to remove favorite.");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2 className="section-title">My Favorites</h2>
        <p>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="section-title">My Favorite Artists</h2>

      {message && <p className="info-message">{message}</p>}

      {favorites.length === 0 ? (
        <p>You have not added any favorite artists yet.</p>
      ) : (
        <div className="cards-list">
          {favorites.map((artist) => (
              <div key={artist._id} className="artist-card row-card">
                {/* image on the left */}
                <div className="artist-card-image">
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      style={{ width: "72px", height: "72px", borderRadius: "12px", objectFit: "cover" }}
                    />
                  ) : null}
                  <div
                    className="artist-avatar"
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "12px",
                      background: getAvatarColor(artist.name),
                      display: artist.imageUrl ? "none" : "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      textAlign: "center",
                      userSelect: "none",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    title={artist.name}
                  >
                    {getAvatarInitials(artist.name)}
                  </div>
                </div>

                {/* content on the right */}
                <div className="artist-card-content">
                  <div className="artist-card-main">
                    <div>
                      <h3>{artist.name}</h3>
                      {artist.genres && artist.genres.length > 0 && (
                        <p className="sub-text">
                          {artist.genres.join(", ")}
                        </p>
                      )}
                      {artist.sampleSongTitle && (
                        <p className="sub-text">
                          <strong>Song:</strong> {artist.sampleSongTitle}
                        </p>
                      )}
                      {artist.country && (
                        <p className="sub-text">
                          <strong>Country:</strong> {artist.country}
                        </p>
                      )}
                    </div>

                    <div className="badge-and-button">
                      {artist.popularity_score != null && (
                        <span className="popularity-badge">
                          Popularity {artist.popularity_score}
                        </span>
                      )}
                      <button
                        className="favorite-btn"
                        onClick={() => handleRemoveFavorite(artist._id)}
                      >
                        ★ Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: "0.4rem" }}>
                    <p className="sub-text">
                      <strong>Preview:</strong>{" "}
                      {previewUrls[artist._id]
                        ? "Tap play to listen."
                        : "No preview found for this artist."}
                    </p>

                    {previewUrls[artist._id] && (
                      <audio
                        className="audio-player"
                        controls
                        src={previewUrls[artist._id]}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}
