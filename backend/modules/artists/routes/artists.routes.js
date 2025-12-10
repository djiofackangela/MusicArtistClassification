// backend/modules/artists/routes/artists.routes.js
const express = require("express");
const router = express.Router();

const { Artist } = require("../models/artists.model");
const authenticate = require("../../users/middlewares/authenticate");
const requireRole = require("../../users/middlewares/requireRole");

// GET /artists  -> paginated list
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Artist.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Artist.countDocuments(),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// GET /artists/:id  -> single artist by id
router.get("/:id", async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.json(artist);
  } catch (err) {
    next(err);
  }
});

// POST /artists  -> create artist (ADMIN ONLY)
router.post("/", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    const artist = new Artist({
      name: req.body.name,
      genres: req.body.genres || [],
      country: req.body.country,
      popularity_score: req.body.popularity_score,
      imageUrl: req.body.imageUrl,
      sampleSongTitle: req.body.sampleSongTitle,
      audioPreviewUrl: req.body.audioPreviewUrl,
      description: req.body.description,
    });

    const saved = await artist.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// PUT /artists/:id  -> update artist (ADMIN ONLY)
router.put("/:id", authenticate, requireRole("admin"), async (req, res, next) => {
  try {
    const updated = await Artist.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        genres: req.body.genres || [],
        country: req.body.country,
        popularity_score: req.body.popularity_score,
        imageUrl: req.body.imageUrl,
        sampleSongTitle: req.body.sampleSongTitle,
        audioPreviewUrl: req.body.audioPreviewUrl,
        description: req.body.description,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /artists/:id  -> delete artist (ADMIN ONLY)
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const deleted = await Artist.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Artist not found" });
      }

      res.json({ message: "Artist deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
