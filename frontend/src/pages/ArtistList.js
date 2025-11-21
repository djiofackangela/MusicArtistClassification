// src/pages/ArtistList.js
import React, { useEffect, useState } from "react";
import api from "../api";

export default function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/artists")
      .then((res) => {
        // our backend returns { items, total, page, limit, totalPages }
        setArtists(res.data.items || []);
      })
      .catch((err) => {
        console.error("Error fetching artists:", err);
        setError("Failed to load artists");
      });
  }, []);

  return (
    <div className="page">
      <h2>🎵 All Artists</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {artists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <ul>
          {artists.map((a) => (
            <li key={a._id}>
              <strong>{a.name}</strong> — {a.country}{" "}
              {a.genres && `(${a.genres.join(", ")})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
