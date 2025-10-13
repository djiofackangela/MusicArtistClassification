const express = require("express");
const path = require("path");

// Routers
const artistsRouter = require("./modules/artists/routes/artists.routes");

// App-level middlewares
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount feature routers
app.use("/api/artists", artistsRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "music-artist-classification-api" });
});

// 404 (after routes)
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
