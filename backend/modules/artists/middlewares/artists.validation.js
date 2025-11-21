// modules/artists/middlewares/artists.validation.js
const { body } = require("express-validator");

const validateArtist = [
  body("name").notEmpty().withMessage("Name is required"),
  body("genres")
    .isArray({ min: 1 })
    .withMessage("Genres must be a non-empty array"),
  body("country").notEmpty().withMessage("Country is required"),
  body("popularity_score")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Popularity score must be between 0 and 100"),
  body("popularity_level")
    .optional()
    .isIn(["Emerging", "Mainstream", "Legendary"])
    .withMessage("Invalid popularity level")
];

module.exports = { validateArtist };
