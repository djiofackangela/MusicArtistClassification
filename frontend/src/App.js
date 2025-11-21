// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArtistList from "./pages/ArtistList";
import AddArtist from "./pages/AddArtist";
import "./App.css"; // this is okay if App.css exists

function App() {
  return (
    <Router>
      <header style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <h1>Music Artist Classification</h1>
        <nav>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/add">Add Artist</Link>
        </nav>
      </header>

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<ArtistList />} />
          <Route path="/add" element={<AddArtist />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
