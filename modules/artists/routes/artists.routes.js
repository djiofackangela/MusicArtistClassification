// modules/artists/routes/artists.routes.js
const express = require("express");
const router = express.Router();

const {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
} = require("../models/artists.model");

const { validateArtist } = require("../middlewares/artists.validation");
const handleValidation = require("../middlewares/handleValidation");

// GET /artists?genre=R&B&country=Canada&minPopularity=60&page=1&limit=10&sortBy=popularity_score&order=desc
router.get("/", async (req, res, next) => {
  try {
    const { genre, country, minPopularity, page, limit, sortBy, order } =
      req.query;

    const result = await getAllArtists(
      { genre, country, minPopularity },
      { page, limit, sortBy, order }
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /artists/:id
router.get("/:id", async (req, res, next) => {
  try {
    const artist = await getArtistById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(artist);
  } catch (err) {
    next(err);
  }
});

// POST /artists
router.post("/", validateArtist, handleValidation, async (req, res, next) => {
  try {
    const created = await createArtist(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /artists/:id
router.put(
  "/:id",
  validateArtist,
  handleValidation,
  async (req, res, next) => {
    try {
      const updated = await updateArtist(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Artist not found" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /artists/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteArtist(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json({ message: "Artist deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
