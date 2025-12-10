// src/pages/ArtistList.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

// Helper function to get initials and colors for avatar
const getAvatarInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

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

export default function ArtistList() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [message, setMessage] = useState("");

  // search / filter / sort
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "popularity"

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

  // Load favorites for logged-in user
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
      });
  }, [auth.token]);

  const isFavorite = (id) => favoritesIds.includes(id);

  const handleToggleFavorite = async (artistId) => {
    if (!auth.token) {
      setMessage("Please log in to add favorites.");
      return;
    }

    try {
      if (isFavorite(artistId)) {
        await api.delete(`/users/favorites/${artistId}`);
        setFavoritesIds((prev) => prev.filter((id) => id !== artistId));
      } else {
        await api.post(`/users/favorites/${artistId}`);
        setFavoritesIds((prev) => [...prev, artistId]);
      }
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.message;
      setMessage(backendMsg || "Failed to update favorites.");
    }
  };

  // Derived genre / country options for filters
  const genreOptions = useMemo(() => {
    const set = new Set();
    artists.forEach((a) => {
      (a.genres || []).forEach((g) => set.add(g));
    });
    return Array.from(set);
  }, [artists]);

  const countryOptions = useMemo(() => {
    const set = new Set();
    artists.forEach((a) => {
      if (a.country) set.add(a.country);
    });
    return Array.from(set);
  }, [artists]);

  // Apply search / filter / sort to artists
  const visibleArtists = useMemo(() => {
    let list = [...artists];

    const s = search.trim().toLowerCase();
    if (s) {
      list = list.filter((a) => {
        const inName = a.name?.toLowerCase().includes(s);
        const inGenres = (a.genres || [])
          .join(" ")
          .toLowerCase()
          .includes(s);
        return inName || inGenres;
      });
    }

    if (genreFilter) {
      list = list.filter((a) =>
        (a.genres || []).includes(genreFilter)
      );
    }

    if (countryFilter) {
      list = list.filter((a) => a.country === countryFilter);
    }

    if (sortBy === "popularity") {
      list.sort(
        (a, b) =>
          (b.popularity_score || 0) - (a.popularity_score || 0)
      );
    } else {
      // relevance (for now: keep original order)
    }

    return list;
  }, [artists, search, genreFilter, countryFilter, sortBy]);

  const handleView = (id) => {
    navigate(`/artists/${id}`);
  };

  return (
    <div className="page">
      <section className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters-row">
          <div className="chip-group">
            <select
              className="filter-chip"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">Genres</option>
              {genreOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              className="filter-chip"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <option value="">Country</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="filter-chip"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Popularity</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          <div className="sort-label">
            <span className="sort-text">Sort</span>
            <span className="sort-pill">
              {sortBy === "popularity" ? "Most popular" : "Relevance"}
            </span>
          </div>
        </div>
      </section>

      {message && <p className="info-message">{message}</p>}

      {visibleArtists.length === 0 ? (
        <p>No artists found.</p>
      ) : (
        <div className="cards-list">
          {visibleArtists.map((artist) => (
            <div key={artist._id} className="artist-card row-card">
              {/* left image / avatar */}
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


              {/* right content */}
              <div className="artist-card-content">
                <div className="artist-card-main">
                  <div>
                    <h3>{artist.name}</h3>
                    {Array.isArray(artist.genres) &&
                      artist.genres.length > 0 && (
                        <p className="sub-text">
                          {artist.genres.join(", ")}
                        </p>
                      )}
                    {artist.sampleSongTitle && (
                      <p className="sub-text">
                        <strong>Song:</strong>{" "}
                        {artist.sampleSongTitle}
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
                      className="view-btn"
                      onClick={() => handleView(artist._id)}
                    >
                      View
                    </button>
                  </div>
                </div>

                {auth.token ? (
                  <button
                    className="favorite-btn"
                    onClick={() => handleToggleFavorite(artist._id)}
                    title={isFavorite(artist._id) ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    {isFavorite(artist._id)
                      ? "★ Remove from Favorites"
                      : "☆ Add to Favorites"}
                  </button>
                ) : (
                  <p style={{ fontSize: "0.75rem", color: "#999", margin: "0.3rem 0 0 0" }}>Log in to add favorites</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pager dots removed - pagination not currently implemented */}
    </div>
  );
}
