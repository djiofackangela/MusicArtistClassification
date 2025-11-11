// modules/artists/middlewares/connect-db.js
const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

async function connectDb(req, res, next) {
  try {
    if (!isConnected) {
      if (!process.env.DB_URL) {
        throw new Error("DB_URL is not defined in .env");
      }

      console.log(" Trying to connect to MongoDB...");
      await mongoose.connect(process.env.DB_URL);

      console.log("Connected to MongoDB Atlas");
      isConnected = true;
    }

    next();
  } catch (err) {
    console.error(" MongoDB connection error (full):", err);

    // For debugging, return the message too
    return res.status(500).json({
      message: "Database connection error",
      error: err.message
    });
  }
}

module.exports = connectDb;
