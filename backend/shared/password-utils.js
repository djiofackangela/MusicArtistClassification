// backend/shared/password-utils.js
const bcrypt = require("bcrypt");

async function encodePassword(rawPassword) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(rawPassword, salt);
  } catch (err) {
    console.error("Error encoding password:", err);
    throw err;
  }
}

async function matchPassword(rawPassword, encodedPassword) {
  try {
    return await bcrypt.compare(rawPassword, encodedPassword);
  } catch (err) {
    console.error("Error comparing passwords:", err);
    throw err;
  }
}

module.exports = { encodePassword, matchPassword };
