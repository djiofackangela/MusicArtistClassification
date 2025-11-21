// src/pages/AddArtist.js
import React, { useState } from "react";
import api from "../api";

export default function AddArtist() {
  const [form, setForm] = useState({
    name: "",
    genres: "",
    country: "",
    popularity_score: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.genres || !form.country) {
      setMessage("⚠️ Name, genres and country are required.");
      return;
    }

    try {
      await api.post("/artists", {
        name: form.name,
        genres: form.genres.split(",").map((g) => g.trim()),
        country: form.country,
        popularity_score: form.popularity_score
          ? Number(form.popularity_score)
          : undefined
      });

      setMessage("✅ Artist added successfully!");
      setForm({ name: "", genres: "", country: "", popularity_score: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add artist.");
    }
  };

  return (
    <div className="page">
      <h2>Add New Artist</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Artist name"
          />
        </div>

        <div>
          <label>Genres (comma-separated): </label>
          <input
            name="genres"
            value={form.genres}
            onChange={handleChange}
            placeholder="R&B, Pop"
          />
        </div>

        <div>
          <label>Country: </label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Canada"
          />
        </div>

        <div>
          <label>Popularity score (0–100, optional): </label>
          <input
            name="popularity_score"
            value={form.popularity_score}
            onChange={handleChange}
            type="number"
            min="0"
            max="100"
          />
        </div>

        <button type="submit">Add Artist</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
