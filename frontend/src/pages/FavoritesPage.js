// frontend/src/pages/FavoritesPage.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function FavoritesPage() {
  const { auth } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth.token) {
      setMessage("You must be logged in to view favorites.");
      return;
    }

    api
      .get("/users/favorites")
      .then((res) => {
        setFavorites(res.data.items || []);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load favorites.");
      });
  }, [auth.token]);

  if (!auth.token) {
    return <p className="info-message">Please log in to see your favorites.</p>;
  }

  return (
    <div className="page">
      <h2>My Favorite Artists</h2>
      {message && <p className="info-message">{message}</p>}

      {favorites.length === 0 ? (
        <p>You have no favorite artists yet.</p>
      ) : (
        <div className="cards-grid">
          {favorites.map((artist) => (
            <div key={artist._id} className="artist-card">
              <h3>{artist.name}</h3>
              {artist.genres && (
                <p>
                  <strong>Genres:</strong> {artist.genres.join(", ")}
                </p>
              )}
              {artist.country && (
                <p>
                  <strong>Country:</strong> {artist.country}
                </p>
              )}
              {artist.popularity_score != null && (
                <p>
                  <strong>Popularity:</strong> {artist.popularity_score}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
