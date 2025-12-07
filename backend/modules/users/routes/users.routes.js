// backend/modules/users/routes/users.routes.js
const express = require("express");
const router = express.Router();

const { User } = require("../models/user.model");
const { encodePassword, matchPassword } = require("../../../shared/password-utils");
const { randomNumberOfNDigits } = require("../../../shared/random-utils");
const { sendEmail } = require("../../../shared/email-utils");
const { encodeToken } = require("../../../shared/jwt-utils");
const authenticate = require("../middlewares/authenticate");

// POST /users/register  (use Postman to create admin & user accounts)
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashed = await encodePassword(password);
    const user = await User.create({
      email,
      password: hashed,
      role: role || "user",
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

// POST /users/login  -> validate credentials, generate OTP, send "email"
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const ok = await matchPassword(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const otp = randomNumberOfNDigits(6).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiresAt = expires;
    await user.save();

    await sendEmail(
      user.email,
      "Your MusicArtistClassification OTP",
      `Your OTP is: ${otp}. It expires in 5 minutes.`
    );

    res.json({
      message:
        "OTP sent to your email (simulated in console for this project).",
    });
  } catch (err) {
    next(err);
  }
});

// POST /users/verify-login  -> verify OTP, return JWT
router.post("/verify-login", async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.otp || !user.otpExpiresAt) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please login again." });
    }

    const now = new Date();
    if (now > user.otpExpiresAt) {
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP expired. Please login again." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = encodeToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

// GET /users/me  -> profile endpoint (extra feature)
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpiresAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// =============================
// FAVORITES FEATURE (EXTRA)
// =============================

// GET /users/favorites  -> list favorite artists (populated)
router.get("/favorites", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      items: user.favorites || [],
      total: (user.favorites || []).length,
    });
  } catch (err) {
    next(err);
  }
});

// POST /users/favorites/:artistId  -> add artist to favorites
router.post("/favorites/:artistId", authenticate, async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const already = user.favorites?.some(
      (favId) => favId.toString() === artistId
    );
    if (!already) {
      user.favorites.push(artistId);
      await user.save();
    }

    res.json({ message: "Artist added to favorites" });
  } catch (err) {
    next(err);
  }
});

// DELETE /users/favorites/:artistId  -> remove artist from favorites
router.delete("/favorites/:artistId", authenticate, async (req, res, next) => {
  try {
    const { artistId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== artistId
    );
    await user.save();

    res.json({ message: "Artist removed from favorites" });
  } catch (err) {
    next(err);
  }
});

// TEMPORARY DELETE USER BY EMAIL (FOR DEBUGGING ONLY)
router.delete("/delete-by-email/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
