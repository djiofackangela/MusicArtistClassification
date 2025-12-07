// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDb = require("./modules/artists/middlewares/connect-db");
const artistRoutes = require("./modules/artists/routes/artists.routes");
const userRoutes = require("./modules/users/routes/users.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// connect to MongoDB (lazy singleton inside middleware)
app.use(connectDb);

// routes
app.use("/artists", artistRoutes);
app.use("/users", userRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
