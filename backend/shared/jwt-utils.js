// backend/shared/jwt-utils.js
const jwt = require("jsonwebtoken");

const { TOKEN_SECRET } = process.env;

function encodeToken(payload, options = {}) {
  if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is not set in .env");
  }
  // 1 hour expiry by default
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1h", ...options });
}

function decodeToken(token) {
  if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is not set in .env");
  }
  try {
    // supports "Bearer xxx"
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }
    return jwt.verify(token, TOKEN_SECRET);
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return undefined;
  }
}

module.exports = { encodeToken, decodeToken };
