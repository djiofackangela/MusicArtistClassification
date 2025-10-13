const { v4: uuid } = require("uuid");
const { readJson, writeJson } = require("../../../utils/fileDb");

const FILE = "artists.json";

function toLevel(score) {
  if (score >= 95) return "Legendary";
  if (score >= 85) return "Superstar";
  if (score >= 75) return "Star";
  if (score >= 60) return "Rising";
  return "Emerging";
}

async function getAllArtists({ genre, country, q }) {
  const data = await readJson(FILE);
  let result = data;

  if (genre) {
    const g = genre.toLowerCase();
    result = result.filter(a => (a.genres || []).some(x => String(x).toLowerCase() === g));
  }
  if (country) {
    const c = country.toLowerCase();
    result = result.filter(a => String(a.country).toLowerCase().includes(c));
  }
  if (q) {
    const s = q.toLowerCase();
    result = result.filter(a =>
      String(a.name).toLowerCase().includes(s) ||
      String(a.bio || "").toLowerCase().includes(s)
    );
  }
  return result;
}

async function getArtistById(id) {
  const data = await readJson(FILE);
  return data.find(a => a.id === id) || null;
}

async function addNewArtist(payload) {
  const data = await readJson(FILE);
  const id = uuid();

  const popularityLevel = payload.popularityLevel || toLevel(Number(payload.popularityScore || 0));

  const newArtist = {
    id,
    name: payload.name,
    genres: payload.genres,
    country: payload.country,
    popularityScore: Number(payload.popularityScore),
    popularityLevel,
    debutYear: Number(payload.debutYear) || null,
    yearsActive: payload.yearsActive || null,
    label: payload.label || null,
    imageUrl: payload.imageUrl || null,
    bio: payload.bio || null
  };

  data.push(newArtist);
  await writeJson(FILE, data);
  return newArtist;
}

async function updateExistingArtist(id, payload) {
  const data = await readJson(FILE);
  const idx = data.findIndex(a => a.id === id);
  if (idx === -1) return null;

  const current = data[idx];
  const merged = {
    ...current,
    ...payload
  };

  if (payload.popularityScore != null && (payload.popularityLevel == null)) {
    merged.popularityLevel = toLevel(Number(payload.popularityScore));
  }

  data[idx] = merged;
  await writeJson(FILE, data);
  return merged;
}

async function deleteArtist(id) {
  const data = await readJson(FILE);
  const idx = data.findIndex(a => a.id === id);
  if (idx === -1) return false;
  data.splice(idx, 1);
  await writeJson(FILE, data);
  return true;
}

module.exports = {
  getAllArtists,
  getArtistById,
  addNewArtist,
  updateExistingArtist,
  deleteArtist
};
