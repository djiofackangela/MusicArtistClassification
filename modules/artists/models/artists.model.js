// modules/artists/models/artistModel.js
const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genres: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one genre is required"
      }
    },
    country: { type: String, required: true, trim: true },
    debut_year: { type: Number },
    years_active: { type: String },
    popularity_score: { type: Number, min: 0, max: 100 },
    popularity_level: {
      type: String,
      enum: ["Emerging", "Mainstream", "Legendary"],
      default: "Emerging"
    },
    label: { type: String },
    avg_tempo: { type: Number },
    bio: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "artists"
  }
);

const Artist = mongoose.model("Artist", artistSchema);

// ===== CRUD + QUERY FUNCTIONS =====

// filters: { genre, country, minPopularity }
// options: { page, limit, sortBy, order }
async function getAllArtists(filters = {}, options = {}) {
  const query = {};

  if (filters.genre) {
    query.genres = filters.genre;
  }
  if (filters.country) {
    query.country = filters.country;
  }
  if (filters.minPopularity) {
    query.popularity_score = { $gte: Number(filters.minPopularity) };
  }

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "name";
  const order = options.order === "desc" ? -1 : 1;
  const sort = { [sortBy]: order };

  const [items, total] = await Promise.all([
    Artist.find(query).sort(sort).skip(skip).limit(limit),
    Artist.countDocuments(query)
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

async function getArtistById(id) {
  return Artist.findById(id);
}

async function createArtist(data) {
  const artist = new Artist(data);
  return artist.save();
}

async function updateArtist(id, data) {
  return Artist.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteArtist(id) {
  return Artist.findByIdAndDelete(id);
}

module.exports = {
  Artist,
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist
};
