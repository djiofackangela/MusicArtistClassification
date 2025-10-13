const { body, param } = require("express-validator");

const idParamRule = [
  param("id").isUUID().withMessage("Invalid artist id (uuid expected).")
];

const createArtistRules = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("genres").isArray({ min: 1 }).withMessage("genres must be a non-empty array"),
  body("country").trim().notEmpty().withMessage("country is required"),
  body("popularityScore")
    .isInt({ min: 0, max: 100 })
    .withMessage("popularityScore must be an integer between 0 and 100"),
  body("debutYear").optional().isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("debutYear must be a valid year"),
  body("imageUrl").optional().isURL().withMessage("imageUrl must be a valid URL")
];

const updateArtistRules = [
  body("name").optional().trim().notEmpty(),
  body("genres").optional().isArray({ min: 1 }),
  body("country").optional().trim().notEmpty(),
  body("popularityScore").optional().isInt({ min: 0, max: 100 }),
  body("debutYear").optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  body("imageUrl").optional().isURL()
];

module.exports = {
  idParamRule,
  createArtistRules,
  updateArtistRules
};
