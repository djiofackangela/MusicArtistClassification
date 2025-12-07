// src/pages/ArtistList.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function ArtistList() {
  const { auth } = useAuth();
  const [artists, setArtists] = useState([]);
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [message, setMessage] = useState("");

  // Load all artists
  useEffect(() => {
    api
      .get("/artists", { params: { page: 1, limit: 100 } })
      .then((res) => {
        const data = res.data;
        const items = Array.isArray(data) ? data : data.items || [];
        setArtists(items);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load artists.");
      });
  }, []);

  // Load current user's favorites (if logged in)
  useEffect(() => {
    if (!auth.token) {
      setFavoritesIds([]);
      return;
    }

    api
      .get("/users/favorites")
      .then((res) => {
        const items = res.data.items || [];
        setFavoritesIds(items.map((a) => a._id));
      })
      .catch((err) => {
        console.error(err);
        // no user-facing error here so we don't spam the UI
      });
  }, [auth.token]);

  const isFavorite = (artistId) => favoritesIds.includes(artistId);

  const handleToggleFavorite = async (artistId) => {
    if (!auth.token) {
      setMessage("Please log in to add favorites.");
      return;
    }

    try {
      if (isFavorite(artistId)) {
        // remove from favorites
        await api.delete(`/users/favorites/${artistId}`);
        setFavoritesIds((prev) => prev.filter((id) => id !== artistId));
      } else {
        // add to favorites
        await api.post(`/users/favorites/${artistId}`);
        setFavoritesIds((prev) => [...prev, artistId]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to update favorites.");
    }
  };

  return (
    <div className="page">
      <h2>All Artists</h2>

      {message && <p className="info-message">{message}</p>}

      {artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <div className="cards-grid">
          {artists.map((artist) => (
            <div key={artist._id} className="artist-card">
              <h3>{artist.name}</h3>

              {Array.isArray(artist.genres) && artist.genres.length > 0 && (
                <p>
                  <strong>Genres:</strong> {artist.genres.join(", ")}
                </p>
              )}

              {artist.country && (
                <p>
                  <strong>Country:</strong> {artist.country}</p>
              )}

              {artist.popularity_score != null && (
                <p>
                  <strong>Popularity:</strong> {artist.popularity_score}</p>
              )}

              {auth.token && (
                <button
                  className="favorite-btn"
                  onClick={() => handleToggleFavorite(artist._id)}
                >
                  {isFavorite(artist._id)
                    ? "★ Remove from Favorites"
                    : "☆ Add to Favorites"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
