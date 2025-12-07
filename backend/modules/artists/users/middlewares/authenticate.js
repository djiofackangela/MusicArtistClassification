// backend/modules/users/middlewares/authenticate.js
const { decodeToken } = require("../../../shared/jwt-utils");

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const decoded = decodeToken(header);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = decoded; // { id, email, role, iat, exp }
  next();
}

module.exports = authenticate;
