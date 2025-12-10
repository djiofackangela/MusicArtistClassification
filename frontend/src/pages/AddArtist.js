// src/pages/AddArtist.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddArtist() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [genres, setGenres] = useState("");
  const [country, setCountry] = useState("");
  const [popularity, setPopularity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sampleSongTitle, setSampleSongTitle] = useState("");
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      name,
      genres: genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      country: country || undefined,
      popularity_score: popularity ? Number(popularity) : undefined,
      imageUrl: imageUrl || undefined,
      sampleSongTitle: sampleSongTitle || undefined,
      audioPreviewUrl: audioPreviewUrl || undefined,
      description: description || undefined,
    };

    try {
      await api.post("/artists", payload);
      setMessage("Artist created successfully.");
      navigate("/");
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.message;
      setMessage(backendMsg || "Failed to create artist.");
    }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>Add New Artist</h2>
          <p style={{ color: "#666", fontSize: "0.95rem", margin: "0" }}>Create a new artist entry</p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "8px",
              background: message.includes("successfully") ? "#e8f5e9" : "#ffebee",
              color: message.includes("successfully") ? "#2e7d32" : "#dc3545",
              fontSize: "0.9rem",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <form
          className="form-card"
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "18px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "1.3rem",
          }}
        >
          <div>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Artist Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Taylor Swift"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="genres"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Genres (comma separated)
            </label>
            <input
              id="genres"
              type="text"
              placeholder="R&B, Soul, Pop"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                htmlFor="country"
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#4b3869",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                Country
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="popularity"
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#4b3869",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                Popularity (0-100)
              </label>
              <input
                id="popularity"
                type="number"
                min="0"
                max="100"
                value={popularity}
                onChange={(e) => setPopularity(e.target.value)}
                placeholder="85"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Image URL
            </label>
            <input
              id="imageUrl"
              type="text"
              placeholder="https://example.com/artist.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="sampleSongTitle"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Sample Song Title
            </label>
            <input
              id="sampleSongTitle"
              type="text"
              placeholder="e.g., Anti-Hero"
              value={sampleSongTitle}
              onChange={(e) => setSampleSongTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="audioPreviewUrl"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Audio Preview URL
            </label>
            <input
              id="audioPreviewUrl"
              type="text"
              placeholder="https://.../preview.mp3"
              value={audioPreviewUrl}
              onChange={(e) => setAudioPreviewUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this artist..."
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                fontFamily: '"Poppins", sans-serif',
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#845ec2",
              color: "white",
              border: "none",
              padding: "0.85rem",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s ease, transform 0.1s ease",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#5c4b99";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#845ec2";
              e.target.style.transform = "scale(1)";
            }}
          >
            Save Artist
          </button>
        </form>
      </div>
    </div>
  );
}
