// backend/modules/artists/models/artists.model.js
const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    country: {
      type: String,
      trim: true,
    },
    popularity_score: {
      type: Number,
      min: 0,
      max: 100,
    },

    // NEW FIELDS FOR UI + SONG PREVIEW
    imageUrl: {
      type: String, // URL to an image for the card
    },
    sampleSongTitle: {
      type: String, // name of the preview song
      trim: true,
    },
    audioPreviewUrl: {
      type: String, // URL or /audio/local-file.mp3
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { collection: "artists", timestamps: true }
);

const Artist = mongoose.model("Artist", artistSchema);

module.exports = { Artist };
