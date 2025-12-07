// frontend/src/pages/AddArtist.js
import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function AddArtist() {
  const [form, setForm] = useState({
    name: "",
    genres: "",
    country: "",
    popularity_score: "",
  });
  const [message, setMessage] = useState("");
  const { auth } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.genres || !form.country) {
      setMessage(" Name, genres and country are required.");
      return;
    }

    try {
      await api.post("/artists", {
        name: form.name,
        genres: form.genres.split(",").map((g) => g.trim()),
        country: form.country,
        popularity_score: form.popularity_score
          ? Number(form.popularity_score)
          : undefined,
      });

      setMessage(" Artist added successfully!");
      setForm({ name: "", genres: "", country: "", popularity_score: "" });
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || " Failed to add artist."
      );
    }
  };

  if (!auth.token) {
    return <p>You must be logged in as admin to add artists.</p>;
  }
  if (auth.role !== "admin") {
    return <p>Only admin users can add artists.</p>;
  }

  return (
    <div className="page">
      <h2>Add New Artist</h2>

      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Name:
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
          />
        </label>

        <label>
          Genres (comma-separated):
          <input
            name="genres"
            value={form.genres}
            onChange={handleChange}
            type="text"
          />
        </label>

        <label>
          Country:
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            type="text"
          />
        </label>

        <label>
          Popularity score (0–100, optional):
          <input
            name="popularity_score"
            value={form.popularity_score}
            onChange={handleChange}
            type="number"
            min="0"
            max="100"
          />
        </label>

        <button type="submit">Add Artist</button>
      </form>

      {message && <p className="info-message">{message}</p>}
    </div>
  );
}
