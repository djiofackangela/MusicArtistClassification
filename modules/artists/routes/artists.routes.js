const express = require("express");
const router = express.Router();

const model = require("../models/artists.model");
const { idParamRule, createArtistRules, updateArtistRules } = require("../middlewares/artists.validation");
const handleValidation = require("../middlewares/handleValidation");

// GET /api/artists?genre=&country=&q=
router.get("/", async (req, res, next) => {
  try {
    const { genre, country, q } = req.query;
    const list = await model.getAllArtists({ genre, country, q });
    return res.status(200).json(list); // 200 OK
  } catch (err) {
    next(err);
  }
});

// GET /api/artists/:id
router.get("/:id", idParamRule, async (req, res, next) => {
  try {
    const v = handleValidation(req, res);
    if (v) return;

    const item = await model.getArtistById(req.params.id);
    if (!item) return res.status(404).json({ status: 404, message: "Artist not found" }); // 404
    return res.status(200).json(item); // 200 OK
  } catch (err) {
    next(err);
  }
});

// POST /api/artists
router.post("/", createArtistRules, async (req, res, next) => {
  try {
    const v = handleValidation(req, res);
    if (v) return;

    const created = await model.addNewArtist(req.body);
    return res.status(201).json(created); // 201 Created
  } catch (err) {
    next(err);
  }
});

// PUT /api/artists/:id
router.put("/:id", [...idParamRule, ...updateArtistRules], async (req, res, next) => {
  try {
    const v = handleValidation(req, res);
    if (v) return;

    const updated = await model.updateExistingArtist(req.params.id, req.body);
    if (!updated) return res.status(404).json({ status: 404, message: "Artist not found" });
    return res.status(200).json(updated); // 200 OK
  } catch (err) {
    next(err);
  }
});

// DELETE /api/artists/:id
router.delete("/:id", idParamRule, async (req, res, next) => {
  try {
    const v = handleValidation(req, res);
    if (v) return;

    const ok = await model.deleteArtist(req.params.id);
    if (!ok) return res.status(404).json({ status: 404, message: "Artist not found" });
    return res.status(200).json({ status: 200, message: "Deleted" }); // 200 OK
  } catch (err) {
    next(err);
  }
});

module.exports = router;
